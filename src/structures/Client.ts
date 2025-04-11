import type { Command, Event } from '@/structures'
import type { ResolvedConfig } from '@/utils/configLoader'
import type { APIApplicationCommand, ClientEvents } from 'discord.js'
import type { ConsolaInstance } from 'consola'

import _config from '@/config'
import { I18n } from '@/services'
import { loadConfig } from '@/utils/configLoader'
import { readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { Client, GatewayIntentBits, Options, Partials, REST, Routes } from 'discord.js'
import { createConsola } from 'consola'
import { PrismaClient } from '@prisma/client'

const config = await loadConfig('.', _config)

/**
 * @description The client instance
 * @class Blop
 * @extends {Client}
 */
export class Blop extends Client<true> {
  public logger: ConsolaInstance
  public config: ResolvedConfig
  public database: PrismaClient
  public i18n: I18n
  public commands: Command[]
  private readonly events: { [K in keyof ClientEvents]: (...args: any[]) => void }
  constructor() {
    super({
      allowedMentions: {
        parse: ['users', 'roles'],
        repliedUser: true
      },
      partials: [
        Partials.Message
      ],
      intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildExpressions,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.MessageContent
      ],
      sweepers: Options.DefaultSweeperSettings
    })

    this.logger = createConsola({
      level: process.env.NODE_ENV === 'development' ? 4 : 3,
      defaults: {
        tag: 'Blop'
      }
    })
    this.logger.wrapAll()

    this.config = config

    this.commands = []
    this.events = {} as { [K in keyof ClientEvents]: (...args: any[]) => void }
    this.database = new PrismaClient()
    this.i18n = new I18n(this)

    void this.start()
  }

  /**
	 * @description Start a Websocket instance
	 * @private
	 * @returns {void}
	 */
  private async start(): Promise<void> {
    const DISCORD_CLIENT_TOKEN = process.env.DISCORD_CLIENT_TOKEN

    // Validate BOT_TOKEN
    if (!DISCORD_CLIENT_TOKEN) {
      this.logger.error('The DISCORD_CLIENT_TOKEN environment variable is not set.')
      process.exit(1)
    }

    // Enable debugger logs on Development environment
    if (process.env.NODE_ENV === 'development') this.on('debug', (debug) => this.logger.debug(debug))
    // Enable warning logger provided by Discord.js
    this.on('warn', (warn) => this.logger.warn(warn))

    await this.i18n.init()

    await this.commandsModulesLoader()
    await this.eventModulesLoader()

    await this.login(DISCORD_CLIENT_TOKEN)
      .then(() => this.logger.info(`[Shard #${this.shard!.ids[0]}] Connected to the WebSocket.`))
      .catch(() => this.logger.error(`[Shard #${this.shard!.ids[0]}] Connection to the WebSocket failed.`))

    await this.registerCommands()
  }

  /**
   * @description Load all categories and commands modules
   * @private
   * @returns {void}
   */
  private async commandsModulesLoader(): Promise<void> {
    let totalCommands = 0
    const start = process.hrtime()

    try {
      const categoryNames = await readdir(this.config.dirs.commands)

      for (const categoryName of categoryNames) {
        const commandFileNames = await readdir(join(this.config.dirs.commands, categoryName))

        for (const commandFileName of commandFileNames) {
          try {
            totalCommands++

            const commandPath = join(this.config.dirs.commands, categoryName, commandFileName)
            const commandPathUrl = pathToFileURL(commandPath).href

            const CommandImport = await import(commandPathUrl) as { default: new (...args: any[]) => Command }
            const CommandClass = CommandImport.default
            const command: Command = new CommandClass(this)

            command.category = categoryName

            this.commands.push(command)
          } catch (error: any) {
            this.logger.error(`[Shard #${this.shard!.ids[0]}] Unable to load command ${commandFileName}: ${error instanceof Error ? error.stack : error}`)
          }
        }
      }
    } catch (error: any) {
      this.logger.error(`[Shard #${this.shard!.ids[0]}] Unable to load some commands: ${error instanceof Error ? error.stack : error}`)
    }

    const end = process.hrtime(start)
    this.logger.info(`[Shard #${this.shard!.ids[0]}] Loaded ${this.commands.length}/${totalCommands} commands (took ${(end[1] / 1000000).toFixed()}ms)`)
  }

  /**
   * @description Register all commands to the Discord API
   * @returns {Promise<void>}
   */
  async registerCommands(): Promise<void> {
    const rest = new REST().setToken(process.env.DISCORD_CLIENT_TOKEN ?? '')
    
    try {
      const guilds = await this.database.guild.findMany()
      
      this.logger.info(`Started refreshing application (/) commands for ${guilds.length} guilds.`)

      for (const guild of guilds) {
        try {
          const filteredCommands = this.commands.filter(command => {
            const modules = guild.modules || {}

            return !modules[command.category] || modules[command.category].enabled
          })
          
          const commandsToRegister = filteredCommands.map(cmd => cmd.applicationCommandBody)

          const data = await rest.put(
            Routes.applicationGuildCommands(this.user.id, guild.id),
            { body: commandsToRegister }
          ) as APIApplicationCommand[]
          
          this.logger.info(`Registered ${data.length} commands for guild ${guild.id}`)
        } catch (error: unknown) {
          this.logger.error(`Failed to register commands for guild ${guild.id}: ${error instanceof Error ? error.message : String(error)}`)
        }
      }
    } catch (error: unknown) {
      this.logger.error(`Command registration process failed: ${error instanceof Error ? error.message : String(error)}`)
    }
  }

  /**
   * @description Load all Discord event modules
   * @private
   * @returns {void}
   */
  private async eventModulesLoader(): Promise<void> {
    const start = process.hrtime()
    const eventFileNames = await readdir(this.config.dirs.events)

    for (const eventFileName of eventFileNames) {
      const moduleName = eventFileName.split('.')[0] as keyof ClientEvents

      if (!moduleName) {
        this.logger.error(`[Shard #${this.shard!.ids[0]}] Invalid event name: ${eventFileName.split('.')[0]}`)
        continue
      }

      try {
        const eventPath = join(this.config.dirs.events, eventFileName)
        const eventPathUrl = pathToFileURL(eventPath).href

        const eventImport = await import(eventPathUrl) as { default: new (...args: ClientEvents[]) => Event }
        const EventClass = eventImport.default
        const event = new EventClass()

        this.events[moduleName] = event.handle.bind(event, this)

        if (event.once) {
          this.once(moduleName, this.events[moduleName])
        } else {
          this.on(moduleName, this.events[moduleName])
        }
      } catch (error: any) {
        this.logger.error(`[Shard #${this.shard!.ids[0]}] Unable to load event ${moduleName}: ${error instanceof Error ? error.stack : error}`)
      }
    }

    const end = process.hrtime(start)
    this.logger.info(`[Shard #${this.shard!.ids[0]}] Loaded ${Object.keys(this.events).length}/${eventFileNames.length} events (took ${(end[1] / 1000000).toFixed()}ms)`)
  }
}

export default new Blop()

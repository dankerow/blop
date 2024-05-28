import type { Command } from '@/structures'
import type { ResolvedConfig } from '@/utils/configLoader'
import type { APIApplicationCommand } from 'discord.js'
import type { ConsolaInstance } from 'consola'

import _config from '@/config'
import { loadConfig } from '@/utils/configLoader'
import { readdir } from 'node:fs/promises'
import { join } from 'node:path'
import { pathToFileURL } from 'node:url'
import { Client, GatewayIntentBits, Options, Partials, REST, Routes } from 'discord.js'
import { consola } from 'consola'

const config = await loadConfig('.', _config)

/**
 * @description The client instance
 * @class Blop
 * @extends {Client}
 */
export class Blop extends Client<true> {
  public logger: ConsolaInstance
  public config: ResolvedConfig
  public commands: Command[]
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
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.MessageContent
      ],
      sweepers: Options.DefaultSweeperSettings
    })

    this.logger = consola
    this.config = config

    this.commands = []

    this.start()
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

    await this.commandsModulesLoader()

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

            const commandPath = join(this.config.dirs.commands, categoryName, commandFileName);
            const commandPathUrl = pathToFileURL(commandPath).href

            const CommandImport = await import(commandPathUrl) as { default: new (...args: any[]) => Command }
            const CommandClass = CommandImport.default
            const command: Command = new CommandClass(this)

            command.category = categoryName

            this.commands.push(command)
          } catch (error: any) {
            console.error(`[Shard #${this.shard!.ids[0]}] Unable to load command ${commandFileName}: ${error instanceof Error ? error.stack : error}`)
          }
        }
      }
    } catch (error: any) {
      console.error(`[Shard #${this.shard!.ids[0]}] Unable to load some commands: ${error instanceof Error ? error.stack : error}`)
    }

    const end = process.hrtime(start)
    console.log(`[Shard #${this.shard!.ids[0]}] Loaded ${this.commands.length}/${totalCommands} commands (took ${(end[1] / 1000000).toFixed()}ms)`)
  }

  /**
   * @description Register all commands to the Discord API
   * @returns {Promise<void>}
   */
  async registerCommands(): Promise<void> {
    const rest = new REST().setToken(process.env.BOT_TOKEN ?? '')
    const commands = this.commands.map((command) => command.applicationCommandBody)

    try {
      consola.log(`Started refreshing ${this.commands.length} application (/) commands.`)

      const data = await rest.put(
        Routes.applicationCommands(this.user.id),
        { body: commands }
      ) as APIApplicationCommand[]

      consola.log(`Successfully reloaded ${data.length} application (/) commands.`)
    } catch (error) {
      consola.error(error)
    }
  }
}

export default new Blop()

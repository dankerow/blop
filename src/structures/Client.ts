import type { DiscordClientConfig } from '@/types'
import type { ConsolaInstance } from 'consola'

import config from '@/config'
import { Client, GatewayIntentBits, Options, Partials } from 'discord.js'
import { consola } from 'consola'

/**
 * @description The client instance
 * @class Blop
 * @extends {Client}
 */
export class Blop extends Client<true> {
  public logger: ConsolaInstance
  public config: DiscordClientConfig
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

    await this.login(DISCORD_CLIENT_TOKEN)
      .then(() => this.logger.info(`[Shard #${this.shard!.ids[0]}] Connected to the WebSocket.`))
      .catch(() => this.logger.error(`[Shard #${this.shard!.ids[0]}] Connection to the WebSocket failed.`))
  }
}

export default new Blop()

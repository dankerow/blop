import type { Blop } from '@/structures'
import { Event } from '@/structures'

/**
 * @class Ready
 */
export default class Ready extends Event {
  constructor() {
    super('ready', { once: true })
  }

  /**
	 * Handles ready
	 * @param {Blop} client The Discord client instance
	 * @returns {Promise<void>} Nothing
	 */
  handle(client: Blop): void {
    try {
      // If the token isn't a bot token the process will be destroyed.
      if (!client.user.bot) {
        client.logger.error('An invalid token was provided. (Bot token expected.)')
        return process.exit(0)
      }

      client.logger.info(`[Shard #${client.shard!.ids[0]}] Discord Client connected.`)

      client.user.setPresence({
        activities: [{
          name: 'with your heart'
        }]
      })
    } catch (error: any) {
      return client.logger.error(`${this.name} - ${error instanceof Error ? error.stack : error}`)
    }
  }
}

import type { CommandOutput } from '@/types'
import type { Blop } from '@/structures'
import type { ChatInputCommandInteraction, InteractionResponse, Message } from 'discord.js'

import { Event } from '@/structures'

/**
 * @class InteractionCreate
 */
export default class InteractionCreate extends Event {
  /**
   * @property {CommandOutput} output
   * @description The output of the command execution.
   */
  private output: CommandOutput
  constructor() {
    super('interactionCreate')

    this.output = null
  }

  async handle(client: Blop, interaction: ChatInputCommandInteraction<'cached'>): Promise<void | InteractionResponse | Message> {
    if (!interaction.isCommand()) return

    try {
      const command = client.commands.filter((module) => module.name === interaction.commandName)[0]

      if (!command) return

      client.logger.log(`[Shard #${interaction.guild.shardId}] ${interaction.user.tag}(${interaction.user.id}) ran command ${command.name} on ${interaction.guild.name}(${interaction.guild.id}) in #${interaction.channel?.name}(${interaction.channel!.id}).`)

      try {
        this.output = await command.execute({ client, interaction })
      } catch (error: any) {
        client.logger.error(error instanceof Error ? error.stack : error)
        return interaction.reply('\uD83D\uDEA7 An error occurred. Try again later.')
      }

      if (interaction.replied) return

      if (this.output && (typeof this.output === 'string' || (typeof this.output === 'object' && (this.output.embeds || this.output.files)))) {
        const message: {
          content?: string
          embeds?: any[]
          files?: any[]
          components?: any[]
        } = {}

        typeof this.output === 'object' ? message.content = this.output.content : null
        typeof this.output === 'object' ? message.embeds = this.output.embeds : null
        typeof this.output === 'object' ? message.files = this.output.files : null
        typeof this.output === 'object' ? message.components = this.output.components : null
        typeof this.output === 'string' ? message.content = this.output : null

        return interaction.reply(message).catch((error) => {
          client.logger.error(error)
          return interaction.followUp('\uD83D\uDEA7 An error occurred. Try again later.')
        })
      }
    } catch (error: any) {
      return client.logger.error(`[Shard #${interaction.guild.shardId}] ${this.name} - ${error instanceof Error ? error.stack : error}`)
    }
  }
}

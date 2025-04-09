import type { CommandOutput } from '@/types'
import type { Blop } from '@/structures'
import type { ChatInputCommandInteraction, InteractionResponse, Snowflake, Message } from 'discord.js'

import { Event } from '@/structures'
import { Collection } from 'discord.js'

/**
 * @class InteractionCreate
 */
export default class InteractionCreate extends Event {
  /**
   * @property {CommandOutput} output
   * @description The output of the command execution.
   */
  private output: CommandOutput

  /**
   * @property {Collection<Snowflake, number>} cooldowns
   * @description The cooldowns collection.
   */
  private readonly cooldowns: Collection<Snowflake, number>

  /**
   * @property {NodeJS.Timeout} cooldownSweep
   * @description The cooldown sweep interval.
   */
  protected cooldownSweep: NodeJS.Timeout
  constructor() {
    super('interactionCreate')

    this.output = null
    this.cooldowns = new Collection()
    this.cooldownSweep = setInterval(this.sweepCooldowns.bind(this), 60000 * 30)
  }

  async handle(client: Blop, interaction: ChatInputCommandInteraction<'cached'>): Promise<void | InteractionResponse | Message> {
    if (!interaction.isCommand()) return

    try {
      const data = {
        user: await client.database.user.upsert({
          where: {
            id: interaction.user.id
          },
          create: {
            id: interaction.user.id
          },
          update: {}
        }),
        guild: await client.database.guild.upsert({
          where: {
            id: interaction.guild.id
          },
          create: {
            id: interaction.guild.id
          },
          update: {}
        })
      }

      interaction.translate = (key: string, options) => {
        return client.i18n.translate({ client, data }, key, options)
      }

      const command = client.commands.filter((module) => module.name === interaction.commandName)[0]

      if (!command) return

      if (command.disabled && !client.config.maintainers.includes(interaction.user.id)) {
        return interaction.reply(':x: This command is disabled at the moment.')
      }

      client.logger.log(`[Shard #${interaction.guild.shardId}] ${interaction.user.tag}(${interaction.user.id}) ran command ${command.name} on ${interaction.guild.name}(${interaction.guild.id}) in #${interaction.channel?.name}(${interaction.channel!.id}).`)

      if (this.cooldowns.has(interaction.user.id) && this.cooldowns.get(interaction.user.id)! > Date.now()) {
        await this.userInCooldown(interaction)
        return
      }

      this.cooldowns.set(interaction.user.id, Date.now() + (command.cooldown ? command.cooldown : 2000))

      try {
        this.output = await command.execute({ client, interaction, data })
      } catch (error: any) {
        client.logger.error(error instanceof Error ? error.stack : error)
        return interaction.reply('\uD83D\uDEA7 An error occurred. Try again later.')
      }

      if (interaction.replied) return

      if (this.output) {
        interaction.reply(this.output).catch((error) => {
          console.error(error)
          void interaction.followUp('\uD83D\uDEA7 An error occurred. Try again later.')
        })
      }
    } catch (error: any) {
      return client.logger.error(`[Shard #${interaction.guild.shardId}] ${this.name} - ${error instanceof Error ? error.stack : error}`)
    }
  }

  /**
   * @method sweepCooldowns
   * @description Sweeps expired cooldowns.
   */
  private sweepCooldowns() {
    for (const [key, value] of this.cooldowns) {
      if (value < Date.now()) this.cooldowns.delete(key)
    }
  }

  /**
   * @param {ChatInputCommandInteraction} interaction The interaction
   * @returns {Promise<Message<true>>} The message
   */
  private async userInCooldown(interaction: ChatInputCommandInteraction<'cached'>): Promise<InteractionResponse<true>> {
    const userCooldown = this.cooldowns.get(interaction.user.id)!
    const seconds = Math.round((userCooldown - Date.now()) / 1000)

    try {
      return interaction.reply(`'You are in the cooldown zone, please wait another ${seconds > 1 ? `${seconds} seconds` : 'another second' }.`)
    } catch {
      return interaction.reply('\uD83D\uDEA7 An error occurred. Try again later.')
    }
  }
}

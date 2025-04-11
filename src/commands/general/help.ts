import type { CommandContext } from '@/types'
import type { Blop } from '@/structures'
import type { APIEmbed } from 'discord.js'

import { Command } from '@/structures'
import { ApplicationCommandOptionType } from 'discord.js'

export default class Help extends Command {
  constructor(client: Blop) {
    super(client, {
      _filename: import.meta.url,
      name: 'help',
      options: [
        {
          name: 'command',
          description: 'Display information about a specific command',
          type: ApplicationCommandOptionType.String
        }
      ]
    })
  }

  execute({ client, interaction, data }: CommandContext) {
    const commandArg = interaction.options.getString('command')
    if (commandArg) {
      const command = client.commands.find((module) => module.name === commandArg.toLowerCase())

      if (!command) return 'Command not found.'

      return {
        embeds: [
          {
            author: {
              name: interaction.t('commands.help.command.name', {
                name: interaction.t(`commands.${command.name}.name`),
                format: 'capital'
              }),
              icon_url: client.user.displayAvatarURL()
            },
            color: 7154431,
            description: command.description({ client, interaction })
          }
        ]
      }
    }

    const embed: APIEmbed = {
      author: {
        name: `${client.user.username}'s documentation`,
        icon_url: client.user.displayAvatarURL()
      },
      color: 7154431,
      description: interaction.t('commands.help.embed.description', { format: 'capital' }),
      fields: [],
      footer: {
        text: interaction.t('commands.help.embed.footer')
      }
    }

    const categories: string[] = []

    client.commands.forEach((command) => {
      if (!categories.includes(command.category)) {
        if (data.guild.modules[command.category.toLowerCase()] &&
        !data.guild.modules[command.category.toLowerCase()].enabled) return

        categories.push(command.category)
      }
    })

    categories.sort((a, b) => {
      const localizedA = interaction.t(`commands.${a}.name`)
      const localizedB = interaction.t(`commands.${b}.name`)

      return localizedA.localeCompare(localizedB)
    })

    categories.forEach((category) => {
      const commands = client.commands.filter((module) => module.category === category)
      if (commands.length < 1) return

      embed.fields!.push({
        name: interaction.t(`commands.${category}.name`, { format: 'capital' }),
        value: `\`${commands.map((command) => interaction.t(`commands.${command.name}.name`)).join('`, `')}\``
      })
    })

    return { embeds: [embed] }
  }
}

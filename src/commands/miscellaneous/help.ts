import type { CommandContext } from '@/types'
import type { Blop } from '@/structures'
import type { APIEmbed } from 'discord.js'

import { Command } from '@/structures'

export default class Help extends Command {
  constructor(client: Blop) {
    super(client, {
      _filename: import.meta.url,
      name: 'help',
      description: () => 'Displays all the available commands.',
      options: [
        {
          name: 'command',
          description: 'Display information about a specific command',
          type: 3
        }
      ]
    })
  }

  execute({ client, interaction }: CommandContext) {
    const commandArg = interaction.options.getString('command')
    if (commandArg) {
      const command = client.commands.find((module) => module.name === commandArg.toLowerCase())

      if (!command) return 'Command not found.'

      return {
        embeds: [
          {
            author: {
              name: `Command Documentation: ${command.name}`,
              icon_url: client.user.displayAvatarURL()
            },
            color: 7154431,
            description: command.description({ client })
          }
        ]
      }
    }

    const embed: APIEmbed = {
      author: {
        name: `${client.user.username} Documentation`,
        icon_url: client.user.displayAvatarURL()
      },
      color: 7154431,
      description: 'To get more details about how to use commands, do `/help <command>`.',
      fields: [],
      footer: {
        text: '<> means required command parameter | [] means optional command parameter'
      }
    }

    const categories: string[] = []

    client.commands.forEach((command) => {
      if (!categories.includes(command.category)) {
        categories.push(command.category)
      }
    })

    categories.forEach((category) => {
      const commands = client.commands.filter((module) => module.category === category)
      if (commands.length < 1) return

      embed.fields!.push({
        name: category,
        value: `\`${commands.map((command) => command.name).join('`, `')}\``
      })
    })

    return { embeds: [embed] }
  }
}

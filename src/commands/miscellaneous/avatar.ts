import type { CommandContext } from '@/types'
import type { Blop } from '@/structures'

import { Command } from '@/structures'
import { ApplicationCommandOptionType } from 'discord.js'

export default class Avatar extends Command {
  constructor(client: Blop) {
    super(client, {
      _filename: import.meta.url,
      name: 'avatar',
      options: [
        {
          name: 'user',
          description: 'An user to get the avatar from',
          type: ApplicationCommandOptionType.User
        }
      ]
    })
  }

  execute({ interaction }: CommandContext) {
    let { user } = interaction

    const userArg = interaction.options.getUser('user')
    if (userArg) {
      user = userArg

      if (interaction.guild.members.cache.has(userArg.id)) {
        user = interaction.guild.members.cache.get(userArg.id)!.user
      }
    }

    const formats = ['webp', 'png', 'jpg', 'jpeg']

    if (user.avatar && user.avatar.startsWith('a_')) formats.push('gif')

    return {
      embeds: [
        {
          image: {
            url: user.displayAvatarURL({ extension: 'png', size: 512 })
          },
          fields: [
            {
              name: interaction.t('commands.avatar.name', {
                format: 'capital'
              }),
              value: `${user.username}\n\`${interaction.t('commands.avatar.download-links', { format: 'capital' })}\` ${formats.map((format) => `[${format.toUpperCase()}](${user.displayAvatarURL({ extension: format, size: 512 })})`).join(' | ')}`
            }
          ],
          color: 7154431
        }
      ]
    }
  }
}

import type { CommandContext } from '@/types'
import type { Blop } from '@/structures'

import { Command } from '@/structures'
import generateImage from '@/utils/generateImage'
import { ApplicationCommandOptionType } from 'discord.js'

export default class Blur extends Command {
  constructor(client: Blop) {
    super(client, {
      _filename: import.meta.url,
      name: 'blur',
      cooldown: 5000,
      options: [
        {
          name: 'user',
          description: 'An user to get the avatar from',
          type: ApplicationCommandOptionType.User
        },
        {
          name: 'radius',
          description: 'The blur radius',
          type: ApplicationCommandOptionType.Number,
          min_value: 1,
          max_value: 100
        }
      ]
    })
  }

  async execute({ client, interaction }: CommandContext) {
    const userArg = interaction.options.getUser('user')
    const radiusArg = interaction.options.getNumber('radius')

    let { member } = interaction

    if (userArg) {
      if (interaction.guild.members.cache.has(userArg.id)) {
        member = interaction.guild.members.cache.get(userArg.id)!
      }
    }

    const imageBuffer = await generateImage({ client, interaction }, {
      name: this.name,
      category: 'filters',
      params: {
        image: member.user.displayAvatarURL({ extension: 'png', size: 512 }),
        radius: radiusArg
      }
    })

    if (Buffer.byteLength(imageBuffer) > 8e+6) return interaction.translate('errors.file-too-large')

    return { files: [{ attachment: imageBuffer, name: `${this.name}.png` }] }
  }
}

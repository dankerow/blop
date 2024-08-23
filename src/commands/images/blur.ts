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
      description: () => 'Applies a blur effect on your avatar.',
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
          type: ApplicationCommandOptionType.Number
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

    if (radiusArg) {
      if (radiusArg < 1) return '\\🚧 You can\'t set the blur radius to 0 or below.'
      else if (radiusArg > 100) return '\\🚧 You can\'t set the blur radius higher than 100.'
    }

    const imageBuffer = await generateImage({ client, interaction }, {
      name: this.name,
      category: 'filters',
      params: {
        image: member.user.displayAvatarURL({ extension: 'png', size: 512 })
      }
    })

    if (Buffer.byteLength(imageBuffer) > 8e+6) return 'The image is above 8MB, I can\'t display that.'

    return { files: [{ attachment: imageBuffer, name: `${this.name}.png` }] }
  }
}

import type { CommandContext } from '@/types'
import type { Blop } from '@/structures'

import { Command } from '@/structures'
import generateImage from '@/utils/generateImage'
import { ApplicationCommandOptionType } from 'discord.js'

export default class Bobross extends Command {
  constructor(client: Blop) {
    super(client, {
      _filename: import.meta.url,
      name: 'bobross',
      cooldown: 5000,
      options: [
        {
          name: 'user',
          description: 'An user to get the avatar from',
          type: ApplicationCommandOptionType.User
        }
      ]
    })
  }

  async execute({ client, interaction }: CommandContext) {
    const userArg = interaction.options.getUser('user')
    let { member } = interaction

    if (userArg) {
      if (interaction.guild.members.cache.has(userArg.id)) {
        member = interaction.guild.members.cache.get(userArg.id)!
      }
    }

    const imageBuffer = await generateImage({ client, interaction }, {
      name: this.name,
      category: 'compose',
      params: {
        image: member.user.displayAvatarURL({ extension: 'png', size: 512 })
      }
    })

    if (Buffer.byteLength(imageBuffer) > 8e+6) return interaction.t('images.too-large')

    return { files: [{ attachment: imageBuffer, name: `${this.name}.png` }] }
  }
}

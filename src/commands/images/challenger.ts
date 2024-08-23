import type { CommandContext } from '@/types'
import type { Blop } from '@/structures'

import { Command } from '@/structures'
import generateImage from '@/utils/generateImage'
import { ApplicationCommandOptionType } from 'discord.js'

export default class Challenger extends Command {
  constructor(client: Blop) {
    super(client, {
      _filename: import.meta.url,
      name: 'challenger',
      description: () => 'Generates the "CHALLENGER" meme using your avatar.',
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

  async execute(context: CommandContext) {
    const userArg = context.interaction.options.getUser('user')
    let { member } = context.interaction

    if (userArg) {
      if (context.interaction.guild.members.cache.has(userArg.id)) {
        member = context.interaction.guild.members.cache.get(userArg.id)!
      }
    }

    const imageBuffer = await generateImage(context, {
      name: this.name,
      category: 'compose',
      params: {
        image: member.user.displayAvatarURL({ extension: 'png', size: 512 })
      }
    })

    if (Buffer.byteLength(imageBuffer) > 8e+6) return 'The image is above 8MB, I can\'t display that.'

    return { files: [{ attachment: imageBuffer, name: `${this.name}.png` }] }
  }
}

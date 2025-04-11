import type { CommandContext } from '@/types'
import type { Blop } from '@/structures'

import { Command } from '@/structures'
import generateImage from '@/utils/generateImage'
import { ApplicationCommandOptionType } from 'discord.js'

export default class Blurple extends Command {
  constructor(client: Blop) {
    super(client, {
      _filename: import.meta.url,
      name: 'blurple',
      cooldown: 5000,
      options: [
        {
          name: 'user',
          description: 'An user to get the avatar from',
          type: ApplicationCommandOptionType.User
        },
        {
          name: 'type',
          description: 'The type to display',
          type: ApplicationCommandOptionType.String,
          choices: [
            { name: 'Light', value: 'light' },
            { name: 'Dark', value: 'dark' },
            { name: 'Orange', value: 'orange' }
          ]
        }
      ]
    })
  }

  async execute({ client, interaction }: CommandContext) {
    const userArg = interaction.options.getUser('user')
    const typeArg = interaction.options.getString('type')
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
        type: typeArg ? encodeURI(typeArg) : null
      }
    })

    if (Buffer.byteLength(imageBuffer) > 8e+6) return interaction.t('errors.file-too-large')

    return { files: [{ attachment: imageBuffer, name: `${this.name}.png` }] }
  }
}

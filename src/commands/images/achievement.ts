import type { CommandContext } from '@/types'
import type { Blop } from '@/structures'

import { Command } from '@/structures'
import generateImage from '@/utils/generateImage'
import { ApplicationCommandOptionType } from 'discord.js'

export default class Achievement extends Command {
  constructor(client: Blop) {
    super(client, {
      _filename: import.meta.url,
      name: 'achievement',
      cooldown: 5000,
      options: [
        {
          name: 'text',
          description: 'The text to display',
          type: ApplicationCommandOptionType.String,
          required: true,
          min_length: 1,
          max_length: 25
        },
        {
          name: 'color',
          description: 'The color to display',
          type: ApplicationCommandOptionType.String
        }
      ]
    })
  }

  async execute({ client,  interaction }: CommandContext) {
    const textArg = interaction.options.getString('text', true)
    const colorArg = interaction.options.getString('color')

    const imageBuffer = await generateImage({ client, interaction }, {
      name: this.name,
      category: 'compose',
      params: {
        text: encodeURI(textArg),
        color: colorArg ? encodeURI(colorArg) : null
      }
    })

    if (Buffer.byteLength(imageBuffer) > 8e+6) return interaction.t('errors.file-too-large')

    return { files: [{ attachment: imageBuffer, name: `${this.name}.png` }] }
  }
}

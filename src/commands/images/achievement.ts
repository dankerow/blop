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
      description: () => 'Customize your Minecraft Achievement.',
      cooldown: 5000,
      options: [
        {
          name: 'text',
          description: 'The text to display',
          type: ApplicationCommandOptionType.String,
          required: true
        },
        {
          name: 'color',
          description: 'The color to display',
          type: ApplicationCommandOptionType.String,
          required: false
        }
      ]
    })
  }

  async execute({ client,  interaction }: CommandContext) {
    const textArg = interaction.options.getString('text', true)
    const colorArg = interaction.options.getString('color')

    if (textArg.length < 1 || textArg.length > 25) return 'Please insert text upper than 1 characters or fewer than 25 characters.'

    const imageBuffer = await generateImage({ client, interaction }, {
      name: this.name,
      category: 'compose',
      params: {
        text: encodeURI(textArg),
        color: colorArg ? encodeURI(colorArg) : null
      }
    })

    if (Buffer.byteLength(imageBuffer) > 8e+6) return 'The image is above 8MB, I can\'t display that.'

    return { files: [{ attachment: imageBuffer, name: `${this.name}.png` }] }
  }
}

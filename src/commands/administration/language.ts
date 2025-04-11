import type { CommandContext } from '@/types'
import type { Blop } from '@/structures'

import { Command } from '@/structures'
import { ApplicationCommandOptionType } from 'discord.js'

export default class Language extends Command {
  constructor(client: Blop) {
    super(client, {
      _filename: import.meta.url,
      name: 'language',
      options: [
        {
          name: 'language',
          description: 'The language to set',
          type: ApplicationCommandOptionType.String,
          choices: client.config.i18n.languages.map((lang) => ({
            name: lang.localeName,
            value: lang.aliases[0]
          }))
        }
      ]
    })
  }

  async execute({ client, interaction, data }: CommandContext) {
    const languageArg = interaction.options.getString('language', false)

    if (!languageArg) {
      const currentLanguage = client.config.i18n.languages.find((lang) => lang.iso === data.guild.language)?.localeName

      return interaction.t('commands.language.current-language', {
        language: currentLanguage,
        format: 'capital'
      })
    }

    const language = client.config.i18n.languages.find((lang) => lang.aliases.includes(languageArg.toLowerCase()))!

    if (language.iso === data.guild.language) {
      return interaction.t('commands.language.already-set', {
        language: language.localeName
      })
    }

    await client.database.guild.update({
      where: {
        id: data.guild.id
      },
      data: {
        language: language.iso
      }
    })

    return interaction.t('commands.language.language-changed', {
      language: language.localeName
    })
  }
}

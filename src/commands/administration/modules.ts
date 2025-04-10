import type { CommandContext, ModuleOptions, PartialCommandContext } from '@/types'
import type { Blop } from '@/structures'

import { Command } from '@/structures'
import { ApplicationCommandOptionType } from 'discord.js'
import { REST, Routes } from 'discord.js'

const DEFAULT_MODULES: ModuleOptions = {
  administration: { editable: false, enabled: true },
  general: { editable: false, enabled: true },
  images: { editable: true, enabled: true },
  miscellaneous: { editable: true, enabled: true }
}

export default class Modules extends Command {
  constructor(client: Blop) {
    super(client, {
      _filename: import.meta.url,
      name: 'modules',
      options: [
        {
          name: 'option',
          description: 'Set or reset a module',
          type: ApplicationCommandOptionType.String,
          choices: [
            { name: 'Set', value: 'set' },
            { name: 'Reset', value: 'reset' }
          ]
        },
        {
          name: 'type',
          description: 'The type of module to set/reset',
          type: ApplicationCommandOptionType.String,
          choices: [
            { name: 'Administration', value: 'administration' },
            { name: 'General', value: 'general' },
            { name: 'Images', value: 'images' },
            { name: 'Miscellaneous', value: 'miscellaneous' },
            { name: 'All', value: 'all' }
          ]
        },
        {
          name: 'toggle',
          description: 'Enable or disable the module',
          type: ApplicationCommandOptionType.String,
          required: false,
          choices: [
            { name: 'On', value: 'on' },
            { name: 'Off', value: 'off' }
          ]
        }
      ]
    })
  }

  async execute({ client, interaction, data }: CommandContext) {
    const optionArg = interaction.options.getString('option', false)
    const typeArg = interaction.options.getString('type', false)
    const toggleArg = interaction.options.getString('toggle', false)

    if (!optionArg) {
      const modules = Object.entries(data.guild.modules).map(([type, config]) => {
        return `**${type.charAt(0).toUpperCase() + type.slice(1)}**: ${config.enabled ? `\\✅ ${interaction.translate('common.enabled')}` : `\\❌ ${interaction.translate('common.disabled')}`}`
      }).join('\n')

      return {
        embeds: [
          {
            author: {
              name: interaction.translate('commands.modules.name', {
                format: 'capital'
              }),
              icon_url: interaction.guild.iconURL()
            },
            description: interaction.translate('commands.modules.embed.description', {
              modules
            }),
            color: 7154431
          }
        ]
      }
    }

    const moduleTypes = Object.entries(data.guild.modules).map((module) => module[0])

    if (optionArg.toLowerCase() === 'set') {
      if (!typeArg) {
        return interaction.translate('commands.modules.provide-module-type', {
          format: 'capital'
        })
      }

      const moduleType = typeArg.toLowerCase()

      if (!toggleArg) {
        return interaction.translate('commands.modules.provide-toggle-value', {
          format: 'capital'
        })
      }
      
      const toggleValue = toggleArg.toLowerCase()

      if (!data.guild.modules[moduleType].editable) {
        return interaction.translate('commands.modules.module-not-editable', {
          moduleType,
          format: 'capital'
        })
      }

      const isEnabled = data.guild.modules[moduleType].enabled
      const targetState = toggleValue === 'on'
       
      if (isEnabled === targetState) {
        return interaction.translate('commands.modules.module-already-state', {
          moduleType,
          state: targetState ? interaction.translate('common.enabled').toLowerCase() : interaction.translate('common.disabled').toLowerCase(),
          format: 'capital'
        })
      }

      const guildData = await client.database.guild.update({
        where: {
          id: interaction.guild.id
        },
        data: {
          modules: {
            ...data.guild.modules,
            [moduleType]: {
              editable: data.guild.modules[moduleType].editable,
              enabled: toggleValue === 'on'
            }
          }
        }
      })

      await this.refreshGuildCommands({
        client,
        data: {
          ...data,
          guild: guildData
        }
      })

      return interaction.translate('commands.modules.module-state-changed', {
        moduleType,
        state: toggleValue === 'on' ? interaction.translate('common.enabled').toLowerCase() : interaction.translate('common.disabled').toLowerCase(),
        format: 'capital'
      })
    }

    if (optionArg.toLowerCase() === 'reset') {
      if (!typeArg) {
        return interaction.translate('commands.modules.provide-module-or-all', {
          format: 'capital'
        })
      }

      const moduleType = typeArg.toLowerCase()

      if (moduleType === 'all') {
        const currentModules = data.guild.modules
        const allAtDefault = Object.keys(DEFAULT_MODULES).every(moduleKey => {
          const current = currentModules[moduleKey]
          const defaultModule = DEFAULT_MODULES[moduleKey]

          return current && 
                 current.editable === defaultModule.editable && 
                 current.enabled === defaultModule.enabled
        })
        
        if (allAtDefault) {
          return interaction.translate('commands.modules.all-modules-default', {
            format: 'capital'
          })
        }

        const guildData = await client.database.guild.update({
          where: {
            id: interaction.guild.id
          },
          data: {
            modules: undefined
          }
        })

        await this.refreshGuildCommands({
          client,
          data: {
            ...data,
            guild: guildData
          }
        })

        return interaction.translate('commands.modules.all-reset', {
          format: 'capital'
        })
      }

      if (moduleTypes.includes(moduleType)) {
        const defaultConfig = DEFAULT_MODULES[moduleType]

        if (!defaultConfig) {
          return interaction.translate('commands.modules.default-not-found', {
            moduleType,
            format: 'capital'
          })
        }

        const currentModule = data.guild.modules[moduleType]
        if (currentModule.editable === defaultConfig.editable && 
            currentModule.enabled === defaultConfig.enabled) {
          return interaction.translate('commands.modules.module-already-default', {
            moduleType,
            format: 'capital'
          })
        }
        
        const guildData = await client.database.guild.update({
          where: {
            id: interaction.guild.id
          },
          data: {
            modules: {
              ...data.guild.modules,
              [moduleType]: defaultConfig
            }
          }
        })

        await this.refreshGuildCommands({
          client,
          data: {
            ...data,
            guild: guildData
          }
        })

        return interaction.translate('commands.modules.module-reset', {
          moduleType,
          format: 'capital'
        })
      }
    }
  }

  async refreshGuildCommands(context: PartialCommandContext): Promise<void> {
    const { client, data } = context

    if (!data) return

    const rest = new REST().setToken(process.env.DISCORD_CLIENT_TOKEN ?? '')
    
    try {
      const filteredCommands = client.commands.filter(command => {
        const modules = data.guild.modules || {}

        return !modules[command.category] || modules[command.category].enabled
      })
      
      const commandsToRegister = filteredCommands.map(cmd => cmd.applicationCommandBody)

      const response = await rest.put(
        Routes.applicationGuildCommands(client.user.id, data.guild.id),
        { body: commandsToRegister }
      )
      
      client.logger.info(`Refreshed ${Array.isArray(response) ? response.length : 0} commands for guild ${data.guild.id}`)
    } catch (error) {
      client.logger.error(`Failed to register commands for guild ${data.guild.id}: ${error instanceof Error ? error.message : String(error)}`)
    }
  }
}

import type { CommandContext, ModuleOptions } from '@/types'
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
      description: () => 'Manage the modules of the bot',
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

  async execute(context: CommandContext) {
    const optionArg = context.interaction.options.getString('option', false)
    const typeArg = context.interaction.options.getString('type', false)
    const toggleArg = context.interaction.options.getString('toggle', false)

    if (!optionArg) {
      const modules = Object.entries(context.data.guild.modules).map(([type, config]) => {
        return `**${type.charAt(0).toUpperCase() + type.slice(1)}**: ${config.enabled ? '\\✅ Enabled' : '\\❌ Disabled'}`
      }).join('\n')

      return {
        embeds: [
          {
            author: {
              name: 'Modules',
              icon_url: context.interaction.guild.iconURL()
            },
            description: `> To set up modules you must do \`/modules set <type> <on/off>\`.\n> To reset configured modules you must do \`/modules reset <type>\`.\n\nCurrent modules:\n\n${modules}`,
            color: 7154431
          }
        ]
      }
    }

    const moduleTypes = Object.entries(context.data.guild.modules).map((module) => module[0])
    const toggleModes = ['on', 'off']

    if (optionArg.toLowerCase() === 'set') {
      if (!typeArg) {
        return 'Please provide a module type.'
      }

      const moduleType = typeArg.toLowerCase()

      if (!moduleTypes.includes(moduleType)) {
        return `Module type \`${moduleType}\` is not available. Valid types: \`${moduleTypes.join('`, `')}\`.`
      }

      if (!toggleArg) {
        return 'Please provide a toggle value `(on/off)`.'
      }
      
      const toggleValue = toggleArg.toLowerCase()
      
      if (!toggleModes.includes(toggleValue)) {
        return `Invalid toggle value \`${toggleValue}\`. Please use \`on\` or \`off\`.`
      }
      
      if (!context.data.guild.modules[moduleType].editable) {
        return `The \`${moduleType}\` module cannot be changed as it's marked as non-editable.`
      }

      const isEnabled = context.data.guild.modules[moduleType].enabled
      const targetState = toggleValue === 'on'
       
      if (isEnabled === targetState) {
        return `The \`${moduleType}\` module is already \`${targetState ? 'enabled' : 'disabled'}\`.`
      }

      const guildData = await context.client.database.guild.update({
        where: {
          id: context.interaction.guild.id
        },
        data: {
          modules: {
            ...context.data.guild.modules,
            [moduleType]: {
              editable: context.data.guild.modules[moduleType].editable,
              enabled: toggleValue === 'on'
            }
          }
        }
      })

      await this.refreshGuildCommands({
        ...context,
        data: {
          ...context.data,
          guild: guildData
        }
      })

      return `The \`${moduleType}\` module has been \`${toggleValue === 'on' ? 'enabled' : 'disabled'}\` successfully.`
    }

    if (optionArg.toLowerCase() === 'reset') {
      if (!typeArg) {
        return 'Please provide a module type or "all".'
      }

      const moduleType = typeArg.toLowerCase()

      if (moduleType === 'all') {
        const currentModules = context.data.guild.modules
        const allAtDefault = Object.keys(DEFAULT_MODULES).every(moduleKey => {
          const current = currentModules[moduleKey]
          const defaultModule = DEFAULT_MODULES[moduleKey]
          return current && 
                 current.editable === defaultModule.editable && 
                 current.enabled === defaultModule.enabled
        })
        
        if (allAtDefault) {
          return 'All modules are already at their default configuration.'
        }

        const guildData = await context.client.database.guild.update({
          where: {
            id: context.interaction.guild.id
          },
          data: {
            modules: undefined
          }
        })

        await this.refreshGuildCommands({
          ...context,
          data: {
            ...context.data,
            guild: guildData
          }
        })

        return 'All modules have been reset to their default configuration.'
      }

      if (moduleTypes.includes(moduleType)) {
        const defaultConfig = DEFAULT_MODULES[moduleType]

        if (!defaultConfig) {
          return `Cannot find default configuration for the \`${moduleType}\` module.`
        }

        const currentModule = context.data.guild.modules[moduleType]
        if (currentModule.editable === defaultConfig.editable && 
            currentModule.enabled === defaultConfig.enabled) {
          return `The \`${moduleType}\` module is already at its default configuration.`
        }
        
        const guildData = await context.client.database.guild.update({
          where: {
            id: context.interaction.guild.id
          },
          data: {
            modules: {
              ...context.data.guild.modules,
              [moduleType]: defaultConfig
            }
          }
        })

        await this.refreshGuildCommands({
          ...context,
          data: {
            ...context.data,
            guild: guildData
          }
        })

        return `The \`${moduleType}\` module has been reset to its default configuration.`
      }
    }
  }

  async refreshGuildCommands(context: CommandContext): Promise<void> {
    const { client, data } = context
    
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

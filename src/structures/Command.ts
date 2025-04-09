import type { CommandContext, CommandOptions, PartialCommandContext, CommandOutput } from '@/types'
import type { Blop } from '@/structures'
import type { APIApplicationCommandOption } from 'discord.js'

/**
 * Command class represents a command in the application.
 * It contains all the necessary properties and methods to execute a command.
 */
export class Command {
  /**
   * The client instance.
   */
  protected client: Blop

  /**
   * The filename of the command.
   */
  public _filename: string

  /**
   * The name of the command.
   */
  public readonly name: string

  /**
   * The category of the command.
   */
  public category: string

  /**
   * The description of the command.
   */
  public description: (context: CommandContext | PartialCommandContext) => string

  /**
   * Indicates whether the command is disabled.
   * If true, the command will not be available for use.
   * @default false
   */
  public disabled: boolean

  /**
   * The cooldown period for the command in milliseconds.
   * This property determines the minimum amount of time that must pass
   * before the command can be executed again.
   */
  public cooldown: number

  /**
   * The body of the application command.
   */
  public applicationCommandBody: {
    name: string
    description: string
    name_localizations?: Record<string, string>
    description_localizations?: Record<string, string>
    options: APIApplicationCommandOption[]
    dm_permission: boolean
  }

  /**
   * Constructs a new command.
   * @param {Blop} client - The client instance.
   * @param {CommandOptions} options - The command options.
   */
  constructor(client: Blop, options: CommandOptions) {
    this.client = client
    this._filename = options._filename
    this.name = options.name
    this.category = options.category || 'miscellaneous'

    if (options.description) {
      this.description = options.description
    } else {
      const translationKey = `${this.name}.description`
      this.description = (context) => {
        if (client.i18n.exists(translationKey)) {
          return client.i18n.translate(context, translationKey)
        } else {
          return 'No description provided.'
        }
      }
    }

    let appCommandDescription = 'No description provided.'
    if (options.description) {
      appCommandDescription = options.description({ client })
    } else {
      const translationKey = `${this.name}.description`
      if (client.i18n.exists(translationKey)) {
        appCommandDescription = client.i18n.translate({ client }, translationKey)
      }
    }

    const nameLocalizations: Record<string, string> = {}
    const descriptionLocalizations: Record<string, string> = {}

    const availableLanguages = client.config.i18n.languages.map(lang => lang.iso)

    for (const lang of availableLanguages) {
      if (lang !== 'en-US') {
        const nameKey = `${this.name}.name`
        if (client.i18n.exists(nameKey)) {
          nameLocalizations[lang] = client.i18n.translate({ client }, nameKey, { lng: lang })
        }
      }

      const descKey = `${this.name}.description`
      if (client.i18n.exists(descKey)) {
        descriptionLocalizations[lang] = client.i18n.translate({ client }, descKey, { lng: lang })
      }
    }

    this.applicationCommandBody = {
      name: options.name,
      description: appCommandDescription,
      name_localizations: Object.keys(nameLocalizations).length > 0 ? nameLocalizations : undefined,
      description_localizations: Object.keys(descriptionLocalizations).length > 0 ? descriptionLocalizations : undefined,
      options: options.options ?? [],
      dm_permission: false
    }

    this.disabled = options.disabled || false
    this.cooldown = options.cooldown || 2500
  }

  /**
   * Executes the command.
   * @param {CommandContext} context - The command context.
   * @throws {Error} If the command doesn't have an execute method.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  execute(context: CommandContext): CommandOutput {
    throw new Error(`${this.name} doesn't have an execute() method.`)
  }
}

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
    this.description = options.description

    this.applicationCommandBody = {
      name: options.name,
      description: options.description({ client }),
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

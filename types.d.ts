import type { Blop } from '@/structures'
import type {
  APIApplicationCommandOption,
  ChatInputCommandInteraction,
  Snowflake
} from 'discord.js'

export interface Config {
  dirs?: {
    commands?: string
  }
  maintainers?: Snowflake[]
}

export interface CommandOptions {
  _filename: string
  name: string
  category?: string
  description: (context: CommandContext | PartialCommandContext) => string
  options?: APIApplicationCommandOption[]
}

export interface CommandContext {
  client: Blop
  interaction: ChatInputCommandInteraction<'cached'>
}

export interface PartialCommandContext {
  client: Blop
  interaction?: ChatInputCommandInteraction<'cached'>
}

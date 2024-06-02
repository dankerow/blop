import type { Blop } from '@/structures'
import type {
  APIApplicationCommandOption,
  APIEmbed,
  ChatInputCommandInteraction,
  Snowflake
} from 'discord.js'

export interface Config {
  dirs?: {
    commands?: string
    events?: string
  }
  maintainers?: Snowflake[]
}

export interface CommandOptions {
  _filename: string
  name: string
  category?: string
  description: (context: CommandContext | PartialCommandContext) => string
  options?: APIApplicationCommandOption[]
  cooldown?: number
}

export interface CommandContext {
  client: Blop
  interaction: ChatInputCommandInteraction<'cached'>
}

export interface PartialCommandContext {
  client: Blop
  interaction?: ChatInputCommandInteraction<'cached'>
}

export type CommandOutput = string | { content?: string; embeds?: APIEmbed[]; files?: any[]; components?: any[] } | null | undefined | void | Promise<string | { content?: string; embeds?: APIEmbed[]; files?: any[]; components?: any[] } | null | undefined | void>

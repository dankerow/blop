import type { Blop } from '@/structures'
import type {
  APIApplicationCommandOption,
  APIEmbed,
  ChatInputCommandInteraction,
  Snowflake
} from 'discord.js'

interface APIItem {
  baseUrl: string
}

type APIList = Record<string, APIItem>

export interface Config {
  dirs?: {
    commands?: string
    events?: string
  }
  maintainers?: Snowflake[]
  apis?: APIList
  fetch?: {
    logChannelId?: Snowflake
  }
}

export interface CommandOptions {
  _filename: string
  name: string
  category?: string
  description: (context: CommandContext | PartialCommandContext) => string
  options?: APIApplicationCommandOption[]
  disabled?: boolean
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

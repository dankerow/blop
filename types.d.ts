import type { Blop } from '@/structures'
import type {
  APIApplicationCommandOption,
  ChatInputCommandInteraction,
  InteractionReplyOptions,
  MessagePayload,
  Snowflake
} from 'discord.js'
import type { Prisma } from '@prisma/client'
import type { InitOptions, TOptions } from 'i18next'

interface Language {
  iso: string
  localeName: string
  aliases: string[]
}

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
  i18n?: {
    languages: Language[]
    options: InitOptions
  }
  apis?: APIList
  fetch?: {
    logChannelId?: Snowflake
  }
}

export type User = Prisma.UserGetPayload<{
  id: true
  language: true
}>

export type Guild = Prisma.GuildGetPayload<{
  id: true
  modules: true
  language: true
}>

interface ModuleConfig {
  editable: boolean
  enabled: boolean
}

export interface ModuleOptions {
  [key: string]: ModuleConfig
}

declare global {
  namespace PrismaJson {
    type GuildModules = ModuleOptions
  }
}

export interface CommandOptions {
  _filename: string
  name: string
  category?: string
  description?: (context: CommandContext | PartialCommandContext) => string
  options?: APIApplicationCommandOption[]
  disabled?: boolean
  cooldown?: number
}

export interface CommandContext {
  client: Blop
  interaction: ChatInputCommandInteraction<'cached'>
  data: {
    user: User
    guild: Guild
  }
}

export type PartialCommandContext = Omit<CommandContext, 'interaction' | 'data'> & {
  interaction?: ChatInputCommandInteraction<'cached'>
  data?: {
    user: User
    guild: Guild
  }
}

export type CommandOutput = string | MessagePayload | InteractionReplyOptions | null | undefined | void | Promise<string | MessagePayload | InteractionReplyOptions | null | undefined | void>

declare module 'discord.js' {
  interface BaseInteraction {
    translate(key: string, options: TOptions = {}): string
  }
}
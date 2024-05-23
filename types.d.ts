import type { Snowflake } from 'discord.js'

export interface Config {
  dirs?: {
    commands?: string
  }
  maintainers?: Snowflake[]
}

import dotenv from 'dotenv'
dotenv.config()

import { ShardingManager } from 'discord.js'
import { consola } from 'consola'

const shardingManager = new ShardingManager('./src/structures/Client.ts', {
  respawn: true,
  execArgv: ['--import', 'tsx'],
  shardArgs: ['--color'],
  token: process.env.DISCORD_CLIENT_TOKEN,
  totalShards: 'auto'
})

shardingManager.on('shardCreate', (shard) => {
  shard.on('spawn', () => consola.info(`[Shard #${shard.id}] Shard process created. [${shard.id + 1} of ${shardingManager.totalShards}]`))
  shard.on('ready', () => consola.info(`[Shard #${shard.id}] Shard Client ready.`))
  shard.on('disconnect', () => consola.warn(`[Shard #${shard.id}] Shard Client disconnecting.`))
  shard.on('reconnecting', () => consola.warn(`[Shard #${shard.id}] Shard Client reconnecting.`))
  shard.on('death', () => consola.info(`[Shard #${shard.id}] Shard process exiting.`))
})

shardingManager.spawn().then(() => consola.success('All shards were launched.'))

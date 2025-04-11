import type { CommandContext } from '@/types'
import type { Blop } from '@/structures'

import { Command } from '@/structures'
import { version, dependencies } from '../../../package.json'
import os from 'node:os'
import { ApplicationCommandOptionType, ChannelType } from 'discord.js'

export default class About extends Command {
  constructor(client: Blop) {
    super(client, {
      _filename: import.meta.url,
      name: 'about',
      options: [
        {
          name: 'shards',
          description: 'Display shards information',
          type: ApplicationCommandOptionType.Boolean
        }
      ]
    })
  }

  async execute({ client, interaction }: CommandContext) {
    const maintainersPromises = client.config.maintainers.map(async (maintainer) => {
      if (client.users.cache.has(maintainer)) {
        return client.users.cache.get(maintainer)!.tag
      } else {
        const user = await client.users.fetch(maintainer)
        return user.tag
      }
    })

    const maintainers = (await Promise.all(maintainersPromises)).join(', ')

    let users = client.shard ? await client.shard.broadcastEval(client => client.users.cache.size) : client.users.cache.size
    if (users instanceof Array) {
      users = users.reduce((sum, val) => sum + val, 0)
    }

    let guilds = client.shard ? await client.shard.broadcastEval(client => client.guilds.cache.size) : client.guilds.cache.size
    if (guilds instanceof Array) {
      guilds = guilds.reduce((sum, val) => sum + val, 0)
    }

    let textChannels = client.shard ? await client.shard.broadcastEval((client, { ChannelType }) => client.channels.cache.filter((channel) => channel.type === ChannelType.GuildText).size, { context: { ChannelType } }) : client.channels.cache.filter((channel) => channel.type === ChannelType.GuildText).size
    if (textChannels instanceof Array) {
      textChannels = textChannels.reduce((sum, val) => sum + val, 0)
    }

    let voiceChannels = client.shard ? await client.shard.broadcastEval((client, { ChannelType }) => client.channels.cache.filter((channel) => channel.type === ChannelType.GuildVoice).size, { context: { ChannelType } }) : client.channels.cache.filter((channel) => channel.type === ChannelType.GuildVoice).size
    if (voiceChannels instanceof Array) {
      voiceChannels = voiceChannels.reduce((sum, val) => sum + val, 0)
    }

    let rss = client.shard ? await client.shard.broadcastEval(() => process.memoryUsage().rss / 1024 / 1024) : (process.memoryUsage().rss / 1024 / 1024).toFixed(2)
    if (rss instanceof Array) {
      rss = rss.reduce((sum, val) => sum + val, 0).toFixed(2)
    }

    let heapUsed = client.shard ? await client.shard.broadcastEval(() => process.memoryUsage().heapUsed / 1024 / 1024) : (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)
    if (heapUsed instanceof Array) {
      heapUsed = heapUsed.reduce((sum, val) => sum + val, 0).toFixed(2)
    }

    const shardStats = client.shard ? (await client.shard.broadcastEval(client => client.shard!.count)).reduce((sum, val) => sum + val, 0) : 0

    if (interaction.options.getBoolean('shards')) {
      if (!client.shard) {
        return interaction.t('about.no-shards', {
          format: 'capital'
        })
      }

      const shards = await client.shard.broadcastEval(client => [
        client.shard!.ids[0],
        (process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2),
        client.guilds.cache.size, Math.round(client.ws.ping)
      ])

      return {
        embeds: [
          {
            author: {
              name: `${client.user.username} | Shards`,
              icon_url: client.user.displayAvatarURL()
            },
            description: `\`\`\`kotlin\n${shards.map((shard) => `root@${client.user.username.toLowerCase()}:~# [${shard[0] === interaction.guild.shardId ? '@' : ''}Shard #${shard[0]}] @RAM #${shard[1]} @GUILDS #${shard[2]} @PING #${shard[3]}`).join('\n')}\`\`\``,
            color: 7154431,
            footer: {
              text: client.user.username,
              icon_url: client.user.displayAvatarURL()
            }
          }
        ]
      }
    }

    return {
      embeds: [
        {
          author: {
            name: client.user.username,
            icon_url: client.user.displayAvatarURL()
          },
          description: interaction.t('commands.about.embed.description', {
            clientUsername: client.user.username,
            maintainers,
            version,
            discordJsVersion: dependencies['discord.js'],
            nodeVersion: process.version,
            format: 'capital'
          }),
          fields: [
            {
              name: interaction.t('commands.about.embed.field-0.name'),
              value: `**\`Platform\`**: \`${process.platform} - (${process.arch})\`\n**\`RSS\`**: \`${rss} MB\` - **\`RAM\`**: \`${heapUsed} MB\` / \`${Math.round(os.totalmem() / 1000000000)} GB\``,
              inline: false
            },
            {
              name: interaction.t('commands.about.embed.field-1.name'),
              value: client.shard ? 
                  interaction.t('commands.about.shards-info', { 
                    shardStats, 
                    shardCount: client.shard.count 
                  }) : 
                  interaction.t('commands.about.no-shards', {
                    format: 'capital'
                  }),
              inline: false
            },
            {
              name: interaction.t('commands.about.embed.field-2.name'),
              value: '[GitHub](https://github.com/dankerow/blop)',
              inline: false
            }
          ],
          color: 7154431,
          footer: {
            text: client.user.username,
            icon_url: client.user.displayAvatarURL()
          }
        }
      ]
    }
  }
}

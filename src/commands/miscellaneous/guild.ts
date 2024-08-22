import type { CommandContext } from '@/types'
import type { Blop } from '@/structures'

import { Command } from '@/structures'
import trimArray from '@/utils/trimArray'
import { ApplicationCommandOptionType, ChannelType, GuildExplicitContentFilter, GuildVerificationLevel } from 'discord.js'
import dayjs from 'dayjs'
import utc from 'dayjs/plugin/utc'

dayjs.extend(utc)

export default class Guild extends Command {
  constructor(client: Blop) {
    super(client, {
      _filename: import.meta.url,
      name: 'guild',
      description: () => 'Displays the current guild information.',
      options: [
        {
          name: 'roles',
          description: 'Display guild\'s roles',
          type: ApplicationCommandOptionType.Boolean
        },
        {
          name: 'emotes',
          description: 'Display guild\'s emotes',
          type: ApplicationCommandOptionType.Boolean
        }
      ]
    })
  }

  execute({ interaction }: CommandContext) {
    let explicitContent: string
    switch (interaction.guild.explicitContentFilter) {
      case GuildExplicitContentFilter.Disabled:
        explicitContent = 'Disabled'
        break
      case GuildExplicitContentFilter.MembersWithoutRoles:
        explicitContent = 'Members without role'
        break
      case GuildExplicitContentFilter.AllMembers:
        explicitContent = 'All members'
        break
      default:
        explicitContent = 'Unknown'
        break
    }

    let verificationLevel: string
    switch (interaction.guild.verificationLevel) {
      case GuildVerificationLevel.None:
        verificationLevel = 'None'
        break
      case GuildVerificationLevel.Low:
        verificationLevel = 'Low'
        break
      case GuildVerificationLevel.Medium:
        verificationLevel = 'Medium'
        break
      case GuildVerificationLevel.High:
        verificationLevel = '(╯°□°）╯︵ ┻━┻'
        break
      case GuildVerificationLevel.VeryHigh:
        verificationLevel = '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻'
        break
      default:
        verificationLevel = 'Unknown'
        break
    }

    const roles = interaction.guild.roles.cache.filter((role) => role.id !== interaction.guild.id).sort((a, b) => b.position - a.position).map((role) => role)
    const emotes = interaction.guild.emojis.cache.sort((a, b) => b.createdTimestamp - a.createdTimestamp).map((emote) => emote)

    const rolesFlag = interaction.options.getBoolean('roles')
    const emotesFlag = interaction.options.getBoolean('emotes')

    if (rolesFlag) {
      return {
        embeds: [
          {
            author: {
              name: `${interaction.guild.name} - Roles`,
              icon_url: interaction.guild.iconURL()
            },
            description: roles.length ? trimArray(roles, 35).join(', ') : 'None',
            color: 7154431
          }
        ]
      }
    } else if (emotesFlag) {
      return {
        embeds: [
          {
            author: {
              name: `${interaction.guild.name} - Emotes`,
              icon_url: interaction.guild.iconURL()
            },
            description: emotes.length ? trimArray(emotes, 200).join(' - ') : 'None',
            color: 7154431
          }
        ]
      }
    }

    return {
      embeds: [
        {
          author: {
            name: interaction.guild.name,
            icon_url: interaction.guild.iconURL()
          },
          thumbnail: { url: interaction.guild.iconURL({ size: 512 }) },
          fields: [
            {
              name: 'Owner',
              value: `<@${interaction.guild.ownerId}>`,
              inline: true
            },
            {
              name: 'Verification level',
              value: verificationLevel,
              inline: true
            },
            {
              name: 'Explicit content',
              value: explicitContent,
              inline: true
            },
            {
              name: `Channels (${interaction.guild.channels.cache.size})`,
              value:`\`Text channels\` ${interaction.guild.channels.cache.filter((channel) => channel.type === ChannelType.GuildText).size} - \`Voice channels\` ${interaction.guild.channels.cache.filter((channel) => channel.type === ChannelType.GuildVoice).size} \n \`AFK channel\` ${interaction.guild.afkChannel ?? 'None'} | \`Timeout\` ${interaction.guild.afkTimeout}`,
              inline: false
            },
            {
              name: 'Roles',
              value: `There are \`${roles.length}\` role(s) on the server, do \`/guild roles\` to see them.`,
              inline: false
            },
            {
              name: 'Emotes',
              value: `There are \`${emotes.length}\` emote(s) on the server, do \`/guild emotes\` to see them.`,
              inline: false
            },
            {
              name: `Members (${interaction.guild.memberCount})`,
              value: `There are **${interaction.guild.members.cache.filter((member) => !member.user.bot).size}** user(s) and **${interaction.guild.members.cache.filter((member) => member.user.bot).size}** bot(s) on the guild.\nOnline: **${interaction.guild.members.cache.filter((member) => member.presence && member.presence.status === 'online').size}** | Idle: **${interaction.guild.members.cache.filter((member) => member.presence && member.presence.status === 'idle').size}**\nOccupied: **${interaction.guild.members.cache.filter((member) => member.presence && member.presence.status === 'dnd').size}** | Offline: **${interaction.guild.members.cache.filter((member) => member.presence && member.presence.status === 'offline').size}**`,
              inline: false
            }
          ],
          color: 7154431,
          footer: {
            text: `Guild Id: ${interaction.guild.id} | Created on the ${dayjs.utc(interaction.guild.createdAt).format('MM/DD/YYYY h:mm A')}`,
            icon_url: interaction.guild.iconURL()
          }
        }
      ]
    }
  }
}

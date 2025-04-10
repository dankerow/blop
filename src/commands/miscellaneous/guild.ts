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
        explicitContent = interaction.translate('common.disabled')
        break
      case GuildExplicitContentFilter.MembersWithoutRoles:
        explicitContent = 'Members without role'
        break
      case GuildExplicitContentFilter.AllMembers:
        explicitContent = 'All members'
        break
      default:
        explicitContent = interaction.translate('keywords.unknown')
        break
    }

    let verificationLevel: string
    switch (interaction.guild.verificationLevel) {
      case GuildVerificationLevel.None:
        verificationLevel = interaction.translate('keywords.none')
        break
      case GuildVerificationLevel.Low:
        verificationLevel = interaction.translate('guild.verification-level.low')
        break
      case GuildVerificationLevel.Medium:
        verificationLevel = interaction.translate('guild.verification-level.medium')
        break
      case GuildVerificationLevel.High:
        verificationLevel = '(╯°□°）╯︵ ┻━┻'
        break
      case GuildVerificationLevel.VeryHigh:
        verificationLevel = '┻━┻ ﾐヽ(ಠ益ಠ)ノ彡┻━┻'
        break
      default:
        verificationLevel = interaction.translate('keywords.unknown')
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
              name: `${interaction.guild.name} - ${interaction.translate('keywords.role', { count: roles.length })}`,
              icon_url: interaction.guild.iconURL()
            },
            description: roles.length ? trimArray(roles, 35).join(', ') : interaction.translate('keywords.none'),
            color: 7154431
          }
        ]
      }
    } else if (emotesFlag) {
      return {
        embeds: [
          {
            author: {
              name: `${interaction.guild.name} - ${interaction.translate('keywords.emoji', { count: emotes.length })}`,
              icon_url: interaction.guild.iconURL()
            },
            description: emotes.length ? trimArray(emotes, 200).join(' - ') : interaction.translate('keywords.none'),
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
              name: interaction.translate('commands.guild.embed.field-0.name', {
                format: 'capital'
              }),
              value: `<@${interaction.guild.ownerId}>`,
              inline: true
            },
            {
              name: interaction.translate('commands.guild.embed.field-1.name', {
                format: 'capital'
              }),
              value: verificationLevel,
              inline: true
            },
            {
              name: interaction.translate('commands.guild.embed.field-2.name', {
                format: 'capital'
              }),
              value: explicitContent,
              inline: true
            },
            {
              name: interaction.translate('commands.guild.embed.field-3.name', {
                channelCount: interaction.guild.channels.cache.size,
                format: 'capital'
              }),
              value:`\`Text channels\` ${interaction.guild.channels.cache.filter((channel) => channel.type === ChannelType.GuildText).size} - \`Voice channels\` ${interaction.guild.channels.cache.filter((channel) => channel.type === ChannelType.GuildVoice).size} \n \`AFK channel\` ${interaction.guild.afkChannel ?? 'None'} | \`Timeout\` ${interaction.guild.afkTimeout}`,
              inline: false
            },
            {
              name: interaction.translate('keywords.role', {
                count: roles.length,
                format: 'capital'
              }),
              value: interaction.translate('commands.guild.embed.field-4.value', {
                roleCount: roles.length,
                format: 'capital'
              }),
              inline: false
            },
            {
              name: interaction.translate('keywords.emoji', {
                count: emotes.length,
                format: 'capital'
              }),
              value: interaction.translate('commands.guild.embed.field-5.value', {
                emojiCount: emotes.length,
                format: 'capital'
              }),
              inline: false
            },
            {
              name: interaction.translate('commands.guild.embed.field-6.name', {
                memberCount: interaction.guild.memberCount,
                format: 'capital'
              }),
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

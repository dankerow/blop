import type { CommandContext } from '@/types'
import type { TextChannel } from 'discord.js'
import type { FetchContext, FetchResponse } from 'ofetch'
import type { R } from 'ofetch/dist/shared/ofetch.8459ad38'

/**
 * Handles fetching errors and sends an error message to a specified Discord channel.
 *
 * @param {Object} ctx - The context object that contains the client and message information.
 * @param { FetchContext & { error: Error } | FetchContext & { response: FetchResponse<R> }} fetchContext
 * @returns {Promise} - A Promise that resolves when the error message is sent to the Discord channel.
 */
export default async (ctx: CommandContext, fetchContext: FetchContext & { error: Error } | FetchContext & { response: FetchResponse<R> }): Promise<void> => {
  const logChannelId = ctx.client.config.fetch.logChannelId!
  const logChannel = ctx.client.channels.cache.get(logChannelId) as TextChannel

  if (!logChannel) return

  if (fetchContext.response) {
    await logChannel.send({
      embeds: [
        {
          author: { name: 'Fetch error - Response', icon_url: ctx.client.user.displayAvatarURL() },
          fields: [
            {
              name: 'Request',
              value: JSON.stringify(fetchContext.request)
            },
            {
              name: 'Data',
              value: JSON.stringify(fetchContext.response)
            },
            {
              name: 'Status',
              value: `${fetchContext.response.status} ${fetchContext.response.statusText}`
            },
            {
              name: 'Guild',
              value: `${ctx.interaction.guild.name} (${ctx.interaction.guild.id})`
            }
          ]
        }
      ]
    })
  } else if (fetchContext.request) {
    await logChannel.send({
      embeds: [
        {
          author: { name: 'Fetch error - Request', icon_url: ctx.client.user.displayAvatarURL() },
          fields: [
            {
              name: 'Request',
              value: JSON.stringify(fetchContext.request)
            },
            {
              name: 'Error',
              value: fetchContext.error ? JSON.stringify(fetchContext.error) : 'Unknown error'
            },
            {
              name: 'Guild',
              value: `${ctx.interaction.guild.name} (${ctx.interaction.guild.id})`
            }
          ]
        }
      ]
    })
  } else {
    await logChannel.send({
      embeds: [
        {
          author: { name: 'Fetch error - Unknown', icon_url: ctx.client.user.displayAvatarURL() },
          fields: [
            {
              name: 'Error',
              value: fetchContext.error ? JSON.stringify(fetchContext.error) : 'Unknown error'
            },
            {
              name: 'Guild',
              value: `${ctx.interaction.guild.name} (${ctx.interaction.guild.id})`
            }
          ]
        }
      ]
    })
  }
}

import type { CommandContext } from '@/types'
import type { Blop } from '@/structures'

import { Command } from '@/structures'
import getSystemUptime from '@/utils/getSystemUptime'
import { stripIndents } from 'common-tags'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration'

dayjs.extend(duration)

export default class Uptime extends Command {
  constructor(client: Blop) {
    super(client, {
      _filename: import.meta.url,
      name: 'uptime',
      description: () => 'Gives the uptime of bot its hosting server.'
    })
  }

  async execute({ client, interaction }: CommandContext) {
    const uptime = client.shard ? (await client.shard.fetchClientValues('uptime') as number[]).reduce((max, cur) => Math.max(max, cur), -Infinity) : client.uptime

    return stripIndents`\`\`\`prolog
		● Client uptime: ${dayjs.duration(uptime).format(' D ["days"], H ["hours"], m ["minutes"], s ["seconds"]')}
		● Shard #${interaction.guild.shard.id} uptime: ${dayjs.duration(client.uptime).format(' D ["days"], H ["hours"], m ["minutes"], s ["seconds"]')}
		● Server uptime: ${dayjs.duration(getSystemUptime()).format(' D ["days"], H ["hours"], m ["minutes"], s ["seconds"]')}\`\`\``
  }
}

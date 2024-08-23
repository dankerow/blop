import type { CommandContext } from '@/types'

import handleFetchError from '@/utils/handleFetchError'
import { ofetch } from 'ofetch'

export default async (context: CommandContext, options: { name: string; category: string; params?: Record<string, any> }) => {
  const imageBuffer = await ofetch(`/${options.category}/${options.name}`, {
    baseURL: context.client.config.apis.rawgo.baseUrl,
    params: options.params,
    responseType: 'arrayBuffer',
    retry: 0,
    onResponseError(fetchContext) {
      return handleFetchError(context, fetchContext)
    },
    onRequestError(fetchContext) {
      return handleFetchError(context, fetchContext)
    }
  })

  return Buffer.from(imageBuffer)
}

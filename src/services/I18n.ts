import type { Blop } from '@/structures'
import type { PartialCommandContext } from '@/types'
import type { i18n, InitOptions, TFunction, TOptions } from 'i18next'

import { createInstance, reloadResources } from 'i18next'
import Backend from 'i18next-fs-backend'

/**
 * @class I18n
 */
export class I18n {
  /**
   * @description The client instance
   * @type {Blop}
   */
  private readonly client: Blop
  /**
   * @description The i18n instance
   * @type {i18n}
   */
  public instance: i18n

  constructor(client: Blop) {
    this.client = client
    this.instance = createInstance()
  }

  /**
   * @description Initializes the i18n instance
   * @returns {Promise<TFunction>}
   */
  async init(): Promise<TFunction> {
    const options: InitOptions = this.client.config.i18n.options
    options.preload = this.client.config.i18n.languages.map((lng) => lng.iso)

    await this.instance.use(Backend).init(options)
    return this.instance.t.bind(this.instance)
  }

  /**
   * @description Changes the language of the i18n instance
   * @param {string} lng - The language to set
   * @returns {Promise<void>}
   */
  async reloadResources(): Promise<void> {
    return reloadResources()
  }

  /**
   * Translates a given key using the i18n method of the client.
   *
   * @param {PartialCommandContext} ctx - The context object.
   * @param {string} key - The key to translate.
   * @param {Object} [options={}] - Additional translation options.
   * @param {string} [options.lng] - The language to use for translation. Defaults to 'en-US'.
   * @returns {string} - The translated string.
   */
  t(ctx: PartialCommandContext, key: string, options: TOptions = {}): string {
    const availableLanguages = this.client.config.i18n.languages.map((lang) => lang.iso)

    if (ctx.interaction?.locale && availableLanguages.includes(ctx.interaction?.locale)) {
      options.lng = ctx.interaction.locale
    }

    let translated = this.instance.t(key, options)
  
    const format = options.format
    if (format) {
      switch (format) {
        case 'uppercase':
          translated = translated.toUpperCase()
          break
        case 'capital':
          translated = translated.charAt(0).toUpperCase() + translated.slice(1)
          break
        case 'lowercase':
          translated = translated.toLowerCase()
          break
      }
    }
  
    return translated
  }

  /**
   * @description Checks if a given key exists in the i18n instance
   * @param {string} key - The key to check
   * @returns {boolean}
   */
  exists(key: string): boolean {
    return this.instance.exists(key)
  }
}

import type { InteractionResponse, Message } from 'discord.js';

/**
 * @class Event
 * @description This class represents an event in the application based on Discord bot client events.
 */
export class Event {
  /**
   * @property {string} name
   * @description The name of the event.
   */
  public readonly name: string

  /**
   * @property {boolean} once
   * @description A boolean indicating whether the event should only be handled once.
   * @default false
   */
  public readonly once: boolean = false

  /**
   * @constructor
   * @param {string} name - The name of the event.
   * @param {Object} options - The options for the event.
   * @param {boolean} options.once - A boolean indicating whether the event should only be handled once.
   */
  constructor(name: string, options: { once?: boolean } = {}) {
    this.name = name
    if (options.once) this.once = options.once
  }

  /**
   * @method handle
   * @description This method should be overridden in subclasses to define what should happen when the event is handled.
   * @param {...any[]} args - The arguments to pass to the event handler.
   * @throws {Error} Throws an error if the method is not overridden in a subclass.
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  handle(...args: any[]): void | Promise<void | InteractionResponse | Message> {
    throw new Error(`${this.name} doesn't have an handle() method.`)
  }
}

import type { Config } from '@/types'

import { resolve } from 'node:path'

const RESOLVED_CONFIG_SYMBOL = Symbol('config')

export type ResolvedConfig = { [P in keyof Config]-?: Config[P] } & {
  [RESOLVED_CONFIG_SYMBOL]: true
}

/**
 * Resolves a config, marking it with a special symbol.
 * @param {Config | ResolvedConfig} config - The config to resolve.
 * @returns {ResolvedConfig} The resolved config.
 */
export function resolveConfig(
  config?: Config | ResolvedConfig
): ResolvedConfig {
  if (config && RESOLVED_CONFIG_SYMBOL in config) {
    return config
  }

  const _config = <ResolvedConfig>{
    [RESOLVED_CONFIG_SYMBOL]: true,
    ...config
  }

  return _config
}

/**
 * Loads a config from a directory, with optional overrides.
 * @param {string} dir - The directory to load the config from. Defaults to the current directory.
 * @param {Config} overrides - Config values to override.
 * @returns {Promise<ResolvedConfig>} The loaded and resolved config.
 */
export async function loadConfig(
  dir: string = '.',
  overrides: Config
): Promise<ResolvedConfig> {
  const { loadConfig } = await import('c12')

  dir = resolve(dir)

  const { config } = await loadConfig<Config>({
    cwd: dir,
    dotenv: true,
    overrides,
    defaults: {
      maintenance: false,
      dirs: {
        commands: 'src/commands',
        events: 'src/events'
      },
      maintainers: []
    }
  })

  return resolveConfig(config)
}

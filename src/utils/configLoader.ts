import type { Config } from '@/types'

import { resolve } from 'node:path'

const RESOLVED_CONFIG_SYMBOL = Symbol('config')

export type ResolvedConfig = { [P in keyof Config]-?: Config[P] } & {
  [RESOLVED_CONFIG_SYMBOL]: true
}

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

  _config.dirs = {
    commands: resolve(config.dirs.commands)
  }

  return _config
}

export async function loadConfig(
  dir = '.',
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
      },
      maintainers: []
    }
  })

  return resolveConfig(config as Config)
}

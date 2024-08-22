import os from 'node:os'
import { readFileSync } from 'node:fs'

/**
 * Retrieves the system uptime in milliseconds.
 *
 * @returns {number} The system uptime in milliseconds.
 */
export default (): number => {
  if (os.platform() === 'linux') {
    const uptime = readFileSync('/proc/uptime', { encoding: 'utf8' })
    return parseFloat(uptime.split(' ')[0]) * 1000
  } else if (os.platform() === 'win32') {
    return os.uptime()
  }

  return 0
}

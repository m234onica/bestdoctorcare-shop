import { loadEnvConfig } from 'next/dist/lib/load-env-config'
import path from 'path'

export function initTaskEnvrionment () {
  loadEnvConfig(path.join(__dirname, '../'), process.env.NODE_ENV !== 'production')
}

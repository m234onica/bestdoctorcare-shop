import { loadEnvConfig } from 'next/dist/lib/load-env-config'
import path from 'path'

export function initEnv () {
  loadEnvConfig(path.join(__dirname, '../'), process.env.NODE_ENV !== 'production')
}

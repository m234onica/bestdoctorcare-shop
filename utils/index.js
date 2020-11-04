import { loadEnvConfig } from '@next/env'
import path from 'path'

export function initEnv () {
  loadEnvConfig(path.join(__dirname, '../'), process.env.NODE_ENV !== 'production')
}

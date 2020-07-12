import { initTaskEnvrionment } from './utils'

const runners = [
  'checkOrderStatus'
]

;(async function () {
  initTaskEnvrionment()

  const module = process.argv.slice(-1)[0]

  if (runners.includes(module)) {
    const { run } = require(`./${module}`)

    await Promise.resolve(run())
  }

  process.exit(0)
})()

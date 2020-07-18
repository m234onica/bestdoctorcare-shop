import { initTaskEnvrionment } from './utils'

const runners = [
  'checkOrderStatus',
  'setupInvitation'
]

;(async function () {
  initTaskEnvrionment()

  const module = process.argv.slice(-1)[0]

  if (runners.includes(module)) {
    const { run } = require(`./${module}`)

    try {
      await Promise.resolve(run())
    } catch (err) {
      console.error(err)
    }
  } else {
    console.error('Runners is not found. Please edit run.js#runners')
  }

  process.exit(0)
})()

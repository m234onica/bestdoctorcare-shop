const path = require('path')
module.exports = {
  api: {
    externalResolver: true
  },
  sassOptions: {
    includePaths: [path.join(__dirname, 'polo')]
  }
}

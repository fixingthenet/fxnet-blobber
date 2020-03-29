const fs = require('fs')
const captureWebsite = require('capture-website')

const Base = require('./base')
const NAME='in-browser'

class Trans extends Base {
    name() {
        return NAME
    }
    explain() {
        return `screenshotting ${this.options.url} to ${this.outPath}`
    }

    async transform() {
        await captureWebsite.file('https://heise.de/', this.outPath, {
              launchOptions: {
                  args: [
                      '--no-sandbox',
                      '--disable-setuid-sandbox'
                  ]
              }
          })
    }
}

module.exports = [NAME, Trans]

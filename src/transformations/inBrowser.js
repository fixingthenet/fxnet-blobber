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
        var url = new URL(this.options.url)

        switch(url.protocol) {
        case 'att:':
            var html = await fs.promises.readFile(this.trans.attPath(url.hostname))
            await captureWebsite.file(html.toString(), this.outPath, {
                type: 'jpeg',
                inputType: 'html',
                fullPage: true,
                launchOptions: {
                    args: [
                        '--no-sandbox',
                        '--disable-setuid-sandbox'
                    ]
                }
            })
            break;
        case 'http:':
        case 'https:':
            await captureWebsite.file(this.options.url, this.outPath, {
                type: 'jpeg',
                fullPage: true,
                launchOptions: {
                    args: [
                        '--no-sandbox',
                        '--disable-setuid-sandbox'
                    ]
                }
            })
            break;
        default:
            throw("Unknown protocol ", url.protocol)
        }
        return { mime: this.options.m}
    }


}

module.exports = [NAME, Trans]

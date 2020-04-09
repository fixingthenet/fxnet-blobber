const fs = require('fs')
var needle = require('needle')
const Base = require('./base')
const NAME='in-file'
class Trans extends Base {
    name() {
        return NAME
    }
    explain() {
        return `copy ${this.options.url} to ${this.outPath}`
    }

    async transform() {
        var url = new URL(this.options.url)

        switch(url.protocol) {
        case 'att:':
            await fs.promises.copyFile(this.trans.attPath(url.hostname), this.outPath)
            break;
        case 'http:':
        case 'https:':
            await needle('get', this.options.url, { output: this.outPath })
            break;
        default:
            throw("Unknown protocol ", url.protocol)
        }
        return { mime: this.options.m }
    }
}

module.exports = [NAME,Trans]

const fs = require('fs')

const Base = require('./base')
const NAME='in-file'
class Trans extends Base {
    name() {
        return NAME
    }
    explain() {
        return `copy ${this.trans.attPath(this.options.att)} to ${this.outPath}`
    }

    async transform() {
        await fs.promises.copyFile(this.trans.attPath(this.options.att), this.outPath)
        return this.options.m
    }
}

module.exports = [NAME,Trans]

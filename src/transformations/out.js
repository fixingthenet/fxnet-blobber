const fs = require('fs')

const Base = require('./base')
const NAME='out'
class Trans extends Base {
    name() {
        return NAME
    }
    explain() {
        return `output ${this.inPath} to '${this.trans.path}/out.bin'`
    }

    async transform() {
        await fs.promises.copyFile(this.inPath, this.trans.path+'/out.bin')
        return { mime: this.options.m}
    }
}

module.exports = [NAME,Trans]

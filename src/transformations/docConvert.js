const unoconv = require('unoconv2')
const fs = require('fs')

const Base = require('./base')
const NAME='doc-convert'
class Trans extends Base {

    name() {
        return NAME
    }
    explain() {
        return `converting document from ${this.inPath} into format ${this.options.format} to ${this.outPath}`
    }

    async transform() {
        return new Promise( (resolve, reject) => {
            unoconv.convert(this.inPath, this.options.format, async (err, result) => {
                if (err) {
                    console.error(`error in ${NAME}`)
                    reject(err)
                } else {
                    await fs.promises.writeFile(this.outPath,result)
                    resolve( {mime: 'application/octet-stream'})
                }
            })
        })
    }
}

module.exports = [NAME, Trans]

const fs = require('fs')
const gm = require('gm')
const Base = require('./base')

const NAME='resize'
class Trans extends Base {

    name() {
        return NAME
    }
    explain() {
        return `resizing ${this.inPath} by ${this.options.x},${this.options.y},${this.options.opt} to ${this.outPath}`
    }

    async transform() {
        return new Promise( (resolve, reject) => {
            gm(this.inPath).
                resize(this.options.x, this.options.y, this.options.opt).
                write(this.outPath, (err) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve({mime: 'image/jpeg' })
                    }
                })
        })
    }
}

module.exports = [NAME, Trans]

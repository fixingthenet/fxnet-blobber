const fs = require('fs')
const gm = require('gm')


const Base = require('./base')
const NAME='rotate'
class Trans extends Base {

    name() {
        return NAME
    }
    explain() {
        return `rotating ${this.inPath} by ${this.options.degrees}° to ${this.outPath}`
    }

    async transform() {
        return new Promise( (resolve, reject) => {
            gm(this.inPath).
                rotate('white', this.options.degrees).
                write(this.outPath, (err) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve('image/jpg')
                    }
                })
        })
    }
}

module.exports = [NAME, Trans]

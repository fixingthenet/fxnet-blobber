const fs = require('fs')
const gm = require('gm')


const Base = require('./base')
const NAME='grayscale'
class Trans extends Base {

    name() {
        return NAME
    }
    explain() {
        return `grayscaling ${this.inPath} to ${this.outPath}`
    }

    async transform() {
        return new Promise( (resolve, reject) => {
            gm(this.inPath).
                colorspace('gray').
                write(this.outPath, (err) => {
                    if (err) {
                        reject(err)
                    } else {
                        resolve({ mime: 'image/jpeg'})
                    }
                })
        })
    }
}

module.exports = [NAME, Trans]

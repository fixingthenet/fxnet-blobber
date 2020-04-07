const fs = require('fs')
const exceptions = require('./exceptions')
class SimpleAuth {
    constructor(params) {
        this.params=params
    }

    async authenticate() {
        try {
            this.pubicKey=  await fs.promises.readFile(this.params.config.ROOT_PATH + `/simpleAuth/${this.params.key}-pub.key`)
        } catch(e) {
            throw new exceptions.AuthException('authentication failed', e)
        }
        return true
    }

    // the securityContext part
    granted(area) {
        return true
    }

    publicKey() {

    }
}

module.exports= SimpleAuth

const murmurhash = require('murmurhash')
const fs = require('fs')
const crypto = require('crypto')

class FileCache {
    constructor(config, cmd, encryptedCmd) {
        this.basePath=config.path
        this.cmd=cmd
        this.encryptedCmd=encryptedCmd


        // split the path so we don't have too many entries in a directory
        // and reduce the key space
        var cacheKey=murmurhash.v3(encryptedCmd, config.seed).toString()
        this.cacheKey=cacheKey
        this.cacheDir=`${this.basePath}/${cacheKey.slice(0,3)}/${cacheKey.slice(3,6)}/${cacheKey.slice(6)}`
        var cacheFileName=crypto.createHash('sha512').update(encryptedCmd).digest('hex')
        this.cachePath=`${this.cacheDir}/${cacheFileName}`
    }

    async isHit() {
        try {
            await fs.promises.stat(this.cachePath)
            var cacheCmd= JSON.parse(await fs.promises.readFile(this.cachePath+'.cache'))
            if (cacheCmd.blob.ca && cacheCmd.blob.ca.utl && cacheCmd.blob.ca.utl > (new Date).getTime()/1000 ) {
                this.maxAge= Math.max(Math.floor(cacheCmd.blob.ca.utl - (new Date).getTime()/1000))
                this.mime=cacheCmd.res.mime
                console.log("cache hit:", this.cachePath, this.cacheKey)
                return true
            } else {
                await this.cleanup()
                console.log("cache old:", this.cachePath, this.cacheKey, cacheInfo.ca )
            }

        } catch(e) {
            console.log("cache miss:", this.cachePath, this.cacheKey)
            return false
        }

    }

    async store(outPath, transResult) {
        if (this.cmd.blob.ca) {
            if (this.cmd.blob.ca.utl && this.cmd.blob.ca.utl > (new Date).getTime()/1000 ) {
                this.maxAge = Math.max(Math.floor(this.cmd.blob.ca.utl - (new Date).getTime()/1000))
                console.debug("FileCache: caching, until ",  this.cmd.blob.ca.utl )
                await fs.promises.mkdir(this.cacheDir, {recursive: true} )
                await fs.promises.copyFile(outPath, this.cachePath)
                this.cmd.res=transResult
                await fs.promises.writeFile(this.cachePath+'.cache', JSON.stringify(this.cmd))
            } else {
                console.debug("FileCache: not caching, until limit reached or not present")
            }
        }
    }

    async cleanup() {
        try {
            await fs.promises.rmdir(this.cacheDir, {recursive: true})
        } catch(e) {

        }
    }


    filePath() {
        return this.cachePath
    }



}

module.exports=FileCache

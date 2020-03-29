//Including the required modules

var crypto = require('crypto');
var fs = require('fs');

Array.prototype.forEachAsync = async function (fn) {
    var i=0
    for (let t of this) { await fn(t,i); i++ }
}


class Encryptor {
    constructor(ispost) {
        this.isPost=ispost
        this.algorithm="aes256"
        this.ivlength=16
    }

    async encrypt(commands, privKey, dataPath, assetPaths) {
        if (this.isPost) { //posts are not encrypted
            //base64 encode assetPaths
            if (assetPaths) {
                commands.att={}
                await assetPaths.forEachAsync( async (path,index) => {
                    var content = await fs.promises.readFile(path)
                    var base64 = Buffer.from(content).toString('base64')
                    console.log("adding",index, base64)
                    commands.att[index] = base64
                })
                console.log(commands)
                var data = JSON.stringify(commands)
            }
        } else {
            if (assetPaths) throw('can only package files on post')
            var text = Buffer.from(JSON.stringify(commands));
            var encrypted = crypto.privateEncrypt(privKey, text)
            var data = Buffer.from(encrypted).toString('base64')


        }
        await fs.promises.writeFile(dataPath, data)
        return true
    }

    async decrypt(pubKey, data, dir) {
        if (this.isPost) {
            var command= JSON.parse(data)
            if (command.att) {
                await Object.entries(command.att).forEachAsync( async ([num, base64]) => {
                    data=Buffer.from(base64,'base64').toString('ascii')
                    await fs.promises.writeFile(dir+'/'+num, data )
                });
                delete(command.att)
            }
            return command
        } else {
            var decoded = Buffer.from(data.toString(),'base64')
            var decrypted = crypto.publicDecrypt(pubKey, decoded)
            var command = JSON.parse(decrypted.toString('utf8'))
            return command
        }

    }

}


module.exports = Encryptor

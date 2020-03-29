//Including the required modules

var crypto = require('crypto');
var fs = require('fs');

Array.prototype.forEachAsync = async function (fn) {
    var i=0
    for (let t of this) { await fn(t,i); i++ }
}


class Encryptor {
    constructor(isPost) {
        this.isPost=isPost
    }

    async encrypt(commands, privKey, dataPath) {
        if (this.isPost) { //posts are not encrypted
            //base64 encode assetPaths
            var att = commands.att;
            if (att) {
                await Object.entries(att).forEachAsync( async ([num,path]) => {
                    var content = await fs.promises.readFile(path, {encoding: 'binary'})
                    var base64 = Buffer.from(content,'binary').toString('base64')
                    commands.att[num] = base64
                })
                var data = JSON.stringify(commands)
            }
        } else {
            delete(command.att) // just to make sure get have no atts
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
                    data=Buffer.from(base64,'base64').toString('binary')
                    var fileName=dir+'/'+num
                    await fs.promises.writeFile(fileName, data, { encoding: 'binary'} )
                    command.att[num]=fileName
                });
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

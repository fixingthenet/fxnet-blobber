//Including the required modules

var crypto = require('crypto');
var fs = require('fs');
var base64url = require('base64url')

Array.prototype.forEachAsync = async function (fn) {
    var i=0
    for (let t of this) { await fn(t,i); i++ }
}


class Encryptor {
    constructor(isPost) {
        this.isPost=isPost
    }

    async encrypt(command, privKey, dataPath) {
        var encCommand={}


        var text = Buffer.from(JSON.stringify(command.blob));
        var encrypted = crypto.privateEncrypt(privKey, text)
        encCommand.blob = base64url(Buffer.from(encrypted).toString('binary'))

        if (this.isPost) {
            if (command.att) {
                encCommand.att = {};
                await Object.entries(command.att).forEachAsync( async ([num,path]) => {
                    var content = await fs.promises.readFile(path, {encoding: 'binary'})
                    var base64 = Buffer.from(content,'binary').toString('base64')
                    encCommand.att[num] = base64
                })
            }

            await fs.promises.writeFile(dataPath, JSON.stringify(encCommand))
        } else {
            await fs.promises.writeFile(dataPath, encCommand.blob)
        }
    }

    async decrypt(pubKey, data, dir) {
        var command = {}


        if (this.isPost) {
            command= JSON.parse(data)
            if (command.att) {
                await Object.entries(command.att).forEachAsync( async ([num, base64]) => {
                    data=Buffer.from(base64,'base64').toString('binary')
                    var fileName=dir+'/'+num
                    await fs.promises.writeFile(fileName, data, { encoding: 'binary'} )
                    command.att[num]=fileName
                });
            }
        } else { // GET case
            command.blob = data
        }

        var decoded = Buffer.from(base64url.decode(command.blob),'binary')
//        console.log(decoded)
        var decrypted = crypto.publicDecrypt(pubKey, decoded)
        command.blob = JSON.parse(decrypted.toString('utf8'))
        return command
    }

}


module.exports = Encryptor

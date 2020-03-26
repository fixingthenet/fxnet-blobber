//Including the required modules
var crypto = require('crypto');
var fs = require('fs');



class Encryptor {
    constructor(ispost) {
        this.isPost=ispost
        this.algorithm="aes256"
        this.ivlength=16
    }

    encrypt(commands, encKey, dataPath, assetPaths) {
        if (this.isPost) {
            //base64 encode assetPaths
            if (assetPaths) {
                commands.as={}
                assetPaths.forEach( (path,index) => {
                    var content = fs.readFileSync(path)
                    var base64 = Buffer.from(content).toString('base64')
//                    console.log(base64)
                    commands.as[index]= base64
                })
            }
        } else {
            if (assetPaths) throw('can only package files on post')
        }

//        console.log(commands, encKey.length)
        var text = JSON.stringify(commands);

        var iv = crypto.randomBytes(this.ivlength);
        var cipher = crypto.createCipheriv(this.algorithm, encKey, iv);


        var ciphered = cipher.update(text, 'utf8', 'base64');
        ciphered += cipher.final('base64');
        var data = iv.toString('base64') + ':' + ciphered

        fs.writeFileSync(dataPath, data)
    }

    decrypt(encKey, data, dir) {
        var components = ciphertext.split(':');
        var iv_from_ciphertext = Buffer.from(components.shift(), outputEncoding);
        var decipher = crypto.createDecipheriv(algorithm, key, iv_from_ciphertext);
        var deciphered = decipher.update(components.join(':'), outputEncoding, inputEncoding);
        deciphered += decipher.final(inputEncoding);

        pubK = fs.readFileSync('sample/pub.key').toString();
        //decrypting the text using public key
        decoded = Buffer.from(urlParam, 'base64') //.toString('ascii')
        //console.log(decoded.toString('binary'))
        decrypted = crypto.publicDecrypt(pubK, Buffer.from(decoded))

        origData = Buffer.from(decrypted).toString('utf-8')
    }

}


module.exports = Encryptor

//middleware
const express = require('express');
const logger = require('morgan');
const config = require('./config')
//const bodyParser = require('body-parser');
//const cors = require('cors');
const uuid = require('uuid')
const fs = require('fs')

const app = express();
const transformator = require('./transformation')
const Encryptor = require('./lib/encrypt')

async function start(listen) {
    var options = {
        port: 3000,
    }
    app.use(logger('dev'));

    app.post('/api/v1/:key/:ns/:bucket/transform', async function (req, res) {
        req.pause() // until we prepared some things

        var path = config.UPLOAD_PATH + uuid.v4()
        await fs.promises.mkdir(path)
        var origPostPath=path+'/original_post.bin'
        console.debug(`POST: uploading to ${origPostPath}`)
        var origPost =  fs.createWriteStream(origPostPath)

//        res.on('finish', function() { fs.rmdir(path, {recursive: true}, function(err){
//            if (err) console.err(`cleanup failure for ${path}`)
//        })
//                                    })

        req.pipe(origPost)
        req.on('error', async () => {
            await cleanup()
            res.send({ success: false })
        })

        req.on('end', async () => {
            origPost.close()
            try {
                var enc=new Encryptor(true)
                var com = await enc.decrypt(
                    await fs.promises.readFile(config.ROOT_PATH + '/sample/pub.key'),
                    await fs.promises.readFile(origPostPath),
                    path
                )
                var trans=new transformator(com, path, true)
                trans.explain()
                await trans.execute()
                res.sendFile(path+'/out.bin')
            } catch (e) {
                console.log("UUUUPS",e)
                res.send({ success: false })
            }
        })

        req.resume()
    });

    app.get('/api/health.json', (req,res) => {
        res.send(JSON.stringify({ "success": true}))
    })

    if (listen) {
        var httpServer=app.listen(options,() => {
            console.log(`Server is running on localhost`);
        })
    }
}

module.exports= {
    start
}

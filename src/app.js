//middleware
const express = require('express');
const logger = require('morgan');
const config = require('./config')
//const bodyParser = require('body-parser');
//const cors = require('cors');
const uuid = require('uuid')
const fs = require('fs')

const app = express();

const Transformator = require('./transformation')
const Encryptor = require('./lib/encrypt')
const FileCache = require('./fileCache')

async function start(listen) {
    var options = {
        port: 3000,
    }
    app.use(logger('dev'));

    app.post('/api/v1/:ns/:bucket/:key/t', async function (req, res) {
        req.pause() // until we prepared some things

        var path = config.UPLOAD_PATH + uuid.v4()
        await fs.promises.mkdir(path)
        var origPostPath=path+'/original_post.bin'
        console.debug(`POST: uploading to ${origPostPath}`)
        var origPost =  fs.createWriteStream(origPostPath)

        var cleanup = function() {
            fs.rmdir(path, {recursive: true}, function(err){
                if (err) console.err(`cleanup failure for ${path}`)
            })}

        res.on('finish', cleanup)

        req.pipe(origPost)
        req.on('error', async () => {
            cleanup()
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
                var trans=new Transformator(com, path, true)
                trans.explain()
                await trans.execute()
                res.sendFile(path+'/out.bin')
            } catch (e) {
                console.error("UUUUPS",e)
                res.send({ success: false })
            }
        })

        req.resume()
    });

    app.get('/api/v1/:ns/:bucket/:key/t/:encrypted_cmd', async function (req, res) {
        // this could be moved into middleware
        //writing before cache check is not good....improvement needed
        var encrypted_cmd = req.params.encrypted_cmd
        var path = config.UPLOAD_PATH + uuid.v4()
        await fs.promises.mkdir(path)
        var origPostPath=path+'/original_post.bin'
        console.debug(`GET: command`)
        await fs.promises.writeFile(origPostPath, encrypted_cmd)

        var cleanup = function() {
            fs.rmdir(path, {recursive: true}, function(err){
                if (err) console.err(`cleanup failure for ${path}`)
            })}

        res.on('finish', cleanup)

        req.on('error', async () => {
            cleanup()
            res.send({ success: false })
        })


        try {
            var enc=new Encryptor(false)
            var cmd = await enc.decrypt(
                await fs.promises.readFile(config.ROOT_PATH + '/sample/pub.key'),
                await fs.promises.readFile(origPostPath),
                path
            )
            var cache=new FileCache(config.CACHE, cmd, encrypted_cmd)
            if (await cache.isHit()) {
                res.sendFile(cache.filePath()) // this is too file specific, a stream is better
            } else {
                var trans=new Transformator(cmd, path, true)
                trans.explain()
                await trans.execute()

                await cache.store(path+'/out.bin')
                res.sendFile(path+'/out.bin')
            }
        } catch (e) {
            console.error("UUUUPS",e)
            res.send({ success: false })
        }
    });

    app.get('/health', (req,res) => {
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

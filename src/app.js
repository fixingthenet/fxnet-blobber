//middleware
const express = require('express');
const logger = require('morgan');
//const bodyParser = require('body-parser');
//const cors = require('cors');
const uuid = require('uuid')
const fs = require('fs')

const app = express();
const transformator = require('./transformation')

async function start(listen) {
    // Make sure the database tables are up to date
    //    await models.sequelize.authenticate();
    var options = {
        port: 3000,
    }
    // Start the GraphQL server
    app.use(logger('dev'));
//    app.use(bodyParser.json());
//    app.use(cors());
//    server.applyMiddleware({ app });
//    await models.User.setup();
    app.post('/api/v1/:key/:ns/:bucket/transform', async function (req, res) {
        req.pause() // until we prepared some things
        var path = process.cwd() + '/uploads/' + uuid.v4()
        await fs.promises.mkdir(path)
        var origPost =  fs.createWriteStream(path+'/original_post.bin')

        cleanup= async function() { await fs.promises.rmdir(path, {recursive: true}) }

        req.pipe(origPost)
        req.on('error', async () => {
            await cleanup()
            res.send({ success: false })
        })

        req.on('end', async () => {
            try {
                trans=new transformator(req.params, path)
                trans.explain()
                trans.run()
                res.send({ success: true})
            } catch (e) {
                console.log("UUUUPS",e)
                res.send({ success: false })
            } finally {
                await cleanup()
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

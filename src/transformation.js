const uuid = require('uuid')

class Transformations {
    constructor() {
        this.registered={}
    }

    get(name) {
        var trans=this.registered[name]
        if (trans) return trans
        throw `No such transformation ${name}`
    }

    register(name,klass) {
//        console.debug(`registered: ${klass.transformation}`)
        this.registered[name]=klass
    }
}

var transformations = new Transformations();

[
    require('./transformations/inBrowser'),
    require('./transformations/inFile'),
    require('./transformations/rotate'),
    require('./transformations/out'),
    require('./transformations/grayscale'),
    require('./transformations/odtHandlebar'),
    require('./transformations/docConvert'),
].forEach( ([name,klass]) => { transformations.register(name, klass) } )


class Transformator {
    constructor(command, path, isPost) { // ns, bucket
        this.command = command
        this.path = path
        this.isPost = isPost
    }

    explain() {
        this.plan().forEach( (step) => {
            console.log(`${step.name()}: ${step.explain()}`)
        });
    }

    async execute() {
        await this.plan().forEachAsync( async (step) => {
            try {
                await step.transform()
            } catch(err) {
                console.error(`${step.name()} errored`)
            }
        });
    }

    // plan the executions piepline (currently does nothing but finds the tranformation commands)
    plan() {
        if (this.planResult) { return this.planResult}
        this.planResult=[]
        var inPath=''
        var outPath=this.tmpFilename()

        this.command.tr.forEach( (cmd) => {
            var transf = transformations.get(cmd[0])
            this.planResult.push( new transf(this,cmd[1],inPath, outPath) )
            inPath = outPath
            outPath=this.tmpFilename()
        });
        return this.planResult
    }

    attPath(num) {
        return this.path + '/' + num
    }
    tmpFilename() {
        return this.path + '/' + uuid.v4()
    }
}




module.exports = Transformator



/*
in-file (post only)
in-url
in-browser



out

transformation('image/*','image/*', 'rotate')
transformation('image/*','image/*', 'crop')
transformation('image/*','image/*', 'grayscale')
transformation('image/*','image/*', 'b&w')
transformation('image/*','image/*', 'clean')
transformation('image/*','text/plain', '2ascii-art')

transformation('application/vnd.oasis.opendocument.text','application/vnd.oasis.opendocument.text', 'handlebar')
transformation('application/vnd.oasis.opendocument.text','application/pdf', '2pdf')

transformation('text/*','text/*', 'handlebar')

transformation('image/*','application/json', 'face-detect')

*/

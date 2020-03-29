class BaseTrans {
    constructor(transformer, options, inPath,outPath) {
        this.trans=transformer
        this.options = options
        this.inPath = inPath
        this.outPath = outPath
    }

    name() {
        throw('name needs implementation')
    }
    explain() {
        throw('explain needs implementation')
    }

    async transform() {
        throw('transform needs implementation')
    }
}

module.exports = BaseTrans

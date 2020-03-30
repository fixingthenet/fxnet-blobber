const fs = require('fs')
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const Base = require('./base')
const NAME='odt-handlebar'
class Trans extends Base {

    name() {
        return NAME
    }
    explain() {
        return `replacing handlebar macros in ${this.inPath} with ${this.options.att} to ${this.outPath}`
    }

    async transform() {
        const { stdout, stderr } = await exec(`odt_handlebars ${this.inPath} ${this.outPath} ${this.trans.attPath(this.options.att)}`);
        console.debug(`${NAME} stdout:`, stdout);
        console.error(`${NAME} stderr: `, stderr);
    }
}

module.exports = [NAME, Trans]

const fs = require('fs')
const util = require('util');
const exec = util.promisify(require('child_process').exec);

const Base = require('./base')
const NAME='face-detection'
class Trans extends Base {

    name() {
        return NAME
    }
    explain() {
        return `face detecting in ${this.inPath} to ${this.outPath}`
    }

    async transform(pre) {
        const { stdout, stderr } = await exec(`/code/exe/face_detect.py ${this.inPath} ${this.outPath}`);
        console.debug(`${NAME} stdout:`, stdout);
        console.error(`${NAME} stderr: `, stderr);
        return { mime: pre.mime }
    }
}

module.exports = [NAME, Trans]

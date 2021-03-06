const simpleAuth = require ('./simpleAuth')

module.exports = {
    //  SERVER_PORT: process.env.SERVER_PORT || 3000,
    //  PAYLOAD_MAX_SIZE: process.env.PAYLOAD_MAX_SIZE || 1048576,
    //  PAYLOAD_TIMEOUT: process.env.PAYLOAD_TIMEOUT || 60000 * 2,
    //  TIMEOUT_SERVER: process.env.TIMEOUT_SERVER || 60000 * 2,
    //  TIMEOUT_SOCKET: process.env.TIMEOUT_SOCKET || 70000 * 2
    ROOT_PATH: process.cwd(),
    UPLOAD_PATH: process.cwd() + '/uploads/',
    CACHE: {
        path: process.cwd() + '/cache/',
        seed: "awioeucnr0a92384cn0q92834pc928u3p490m2q348"
    },
    AUTH: function(params) { return new simpleAuth(params)},
}

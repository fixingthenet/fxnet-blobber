class AuthException {
    constructor(msg, exc) {
        this.message = msg
        this.name = "AuthException"
        this.exc = exc
    }

//    toString() {
//        return `${this.name}: ${this.message}; ${this.exc}`
//    }
}


module.exports = {
    AuthException: AuthException,

}

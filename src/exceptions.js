class AuthException extends Error {
    constructor(msg, exc) {
        super(msg)
        this.message = msg
        this.name = "AuthException"
        this.exc = exc
    }

}

class TransformationException extends Error {
    constructor(step, exc) {
        super(step)
        this.message = step
        this.name = "TransformationException"
        this.exc = exc
    }

}


module.exports = {
    AuthException: AuthException,
    TransformationException: TransformationException,

}

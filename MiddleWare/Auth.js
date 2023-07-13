const req = require("express/lib/request")
const jwt = require("jsonwebtoken")

const authentication = (req, res, next) => {
    if (req.headers.authorization) {
        let decode = jwt.verify(req.headers.authorization, "abcd")
        if (decode) {
            req.userId = decode.userId
            next()
        } else {
            res.json({ message: "Unauthorized" })
        }
    } else {
        res.json({ message: "Unauthorized" })
    }
}

module.exports = authentication
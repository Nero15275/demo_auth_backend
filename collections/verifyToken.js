const jwt = require(`jsonwebtoken`)


const verifyToken = (req, res, next) => {
    const authHeader = req.headers.token
    if (authHeader) {
        const token = authHeader.split(" ")[1]
        jwt.verify(token, process.env.jwtkey, (err, user) => {
            if (err) res.status(403).json(`token not valid`)
            req.user = user
            next()

        })
    } else {
        res.status(401).json(`u are not authorized`)
    }
}


const verifyTokenAndAuthoriztion = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.id === req.params.id || req.user.isAdmin || req.user.isSeller) {
            next()
        } else {
            res.status(403).json(`you are not allowed`)
        }
    })
}


const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isAdmin) {
            next()
        } else {
            res.status(403).json(`you are not allowed`)
        }
    })
}

const verifyTokenAndSeller = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.isSeller) {
            next()
        } else {
            res.status(403).json(`you are not allowed`)
        }
    })
}

module.exports = { verifyToken, verifyTokenAndAuthoriztion, verifyTokenAndAdmin, verifyTokenAndSeller }










const jwt = require('jsonwebtoken');

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization
    if (authHeader) {
        const token = authHeader.split(" ")[1]
        jwt.verify(token, process.env.JWT_SEC, (err, user) => {
            if (err) res.json({ error: true, message: "Token không đúng!" })
            req.user = user
            next()
        });
    } else {
        return res.json({ error: true, message: "Bạn không có quyền truy cập!" })
    }
}

const verifyTokenAndAuthorization = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user) {
            next()
        } else {
            res.json({ error: true, message: "Bạn không có quyền truy cập!" })
        }
    });
}

const verifyTokenAndAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.role === 'admin') {
            next()
        } else {
            res.json({ error: true, message: "Bạn không có quyền truy cập!" })
        }
    });
}

const verifyTokenAndManager = (req, res, next) => {
    verifyToken(req, res, () => {
        if (req.user.role === 'manager') {
            next()
        } else {
            res.json({ error: true, message: "Bạn không có quyền truy cập!" })
        }
    })
}

module.exports = {
    verifyToken,
    verifyTokenAndAuthorization,
    verifyTokenAndAdmin,
    verifyTokenAndManager
}
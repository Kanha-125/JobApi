const { UnauthenticatedError } = require("../errors");
const jwt = require('jsonwebtoken')


const authMiddleware = async (req, res, next) => {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith("Bearer ")) {
        throw new UnauthenticatedError("no token provided")
    }
    const token = auth.split(" ")[1];
    try {
        const payload = jwt.verify(token, process.env.JWT_SECRET);
        req.user = {
            name: payload.name,
            userId: payload.userId
        }
        next()
    }
    catch (err) {
        throw new UnauthenticatedError("invalid token")
    }
}

module.exports = authMiddleware
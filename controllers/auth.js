const { BadRequestError, UnauthenticatedError } = require("../errors");
const User = require("../models/User")
const { StatusCodes } = require("http-status-codes")


const register = async (req, res) => {
    const user = await User.create({ ...req.body });
    const token = user.createJwt();
    res.status(StatusCodes.CREATED).json({ token, user: { userId: user._id, name: user.name } })
}

const login = async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        throw new BadRequestError("Please provide email and password")
    }

    const user = await User.findOne({ email })
    if (!user) {
        throw new UnauthenticatedError("Please regiser first")
    }
    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
        throw new UnauthenticatedError("Please provide valid password")
    }
    const token = user.createJwt();
    res.status(StatusCodes.OK).json({ token, user: { name: user.name } })
}

module.exports = { register, login }
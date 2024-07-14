const { StatusCodes } = require('http-status-codes')
const errorHandlerMiddleware = (err, req, res, next) => {

  let customError = {
    statusCode: err.StatusCodes || StatusCodes.INTERNAL_SERVER_ERROR,
    message: err.message || "something went wrong. please try again later"

  }

  if (err.name === "ValidationError") {
    customError.message = Object.values(err.errors).map((item) => item.message).join(',')
    customError.statusCode = StatusCodes.BAD_REQUEST
  }

  if (err.code && err.code === 11000) {
    customError.message = `Duplicate value entered for ${Object.keys(err.keyValue)}`;
    customError.statusCode = StatusCodes.BAD_REQUEST

  }

  if (err.name === "CastError") {
    customError.message = `No item found with : ${err.value}`
    customError.statusCode = 404
  }
  // return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({ err })
  return res.status(customError.statusCode).json({ msg: customError.message })
}

module.exports = errorHandlerMiddleware

import jwt from 'jsonwebtoken'
import createHttpError from 'http-errors'
import Users from '../services/users/schema.js'
import Devices from '../services/devices/schema.js'

//============== Generate JWT Token
const generateJWT = (userId) =>
  new Promise((resolve, reject) =>
    jwt.sign(userId, process.env.JWT_SECRET,
      { expiresIn: "30d" },
      (err, token) => {
        if (err) {
          reject(err);
        } else {
          resolve(token);
        }
      }
    )
  );

export const generateJWTToken = async (user) => {
  const accessToken = await generateJWT({ _id: user._id });
  return accessToken;
};

//=================== Verify JWT Token

export const verifyJWTToken = async (token) => {
  return new Promise((resolve, reject) =>
    jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
      if (err) {
        reject(err);
      } else {
        resolve(decodedToken);
      }
    })
  );
};

export const tokenMiddleware = async (req, res, next) => {
  try {
    if (!req.headers.cookie) {
      next(createHttpError(401, 'please provide credentials'))
    } else {
      const token = req.cookies.token;
      const decodedToken = await verifyJWTToken(token)
      const user = await Users.findById(decodedToken._id)
      if (user) {
        req.user = user
        next()
      } else {
        next(createHttpError(404, 'user not found'))
      }
    }
  } catch (error) {
    next(createHttpError(401, "Token not valid"))
  }
}

export const validTokenMiddleware  = async (req, res, next) => {
  try {
    const { token } = req.body
    const decodedToken = await verifyJWTToken(token)
    const user = await Users.findById(decodedToken._id)
    if (user) {
      req.user = user
      next()
    } else {
      next(createHttpError(404, 'user not found'))
    }
  } catch (error) {
    next(createHttpError(401, "Token not valid"))
  }
}


export const apiKeyMiddleware = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      next(createHttpError(401, 'Unauthorized!'))
    } else {
      const device = await Devices.findOne({ apiKey: req.headers.authorization })
      if (device) {
        req.device = device
        next()
      } else {
        next(createHttpError(401, 'API Key not valid!'))
      }
    }
  } catch (error) {
    next(createHttpError(401, "API Key not valid!"))
  }
}
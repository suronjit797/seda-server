import express from 'express'
import createHttpError from 'http-errors'
import multer from 'multer'
import { generateJWTToken, tokenMiddleware, validTokenMiddleware } from '../../utils/jwtAuth.js'
import Users from './schema.js'
import { saveToMedia, saveToUsers } from '../../utils/cloudinarySetup.js'
import roleCheck from '../../utils/roleCheckerMiddleware.js'
import sendEmail from '../../utils/sendEmail.js'
import forgotPassword from '../../emails/forgotPassword.js'


const usersRoute = express.Router()
const cookieAge = 30 * 24 * 60 * 60 * 1000 //30 days

//this will be used by super admin to get all users
usersRoute.get('/', tokenMiddleware, [roleCheck.isSuperAdmin], async (req, res, next) => {
    try {
        const users = await Users.find({ "role": { "$ne": 'superAdmin' } })
        res.status(200).send(users)
    } catch (error) {
        next(error)
        console.log(error)
    }
})

usersRoute.post('/', async (req, res, next) => {
    try {
        const user = await Users.findOne({ email: req.body.email })
        console.log(user)
        if (!user) {
            const newUser = new Users(req.body)
            const user = await newUser.save({ new: true })
            res.status(201).send(user)
        } else {
            next(createHttpError(401, "Email already used."))
        }
    } catch (error) {
        next(createHttpError(500, error))
        console.log(error)
    }
})

usersRoute.post('/register', async (req, res, next) => {
    try {
        const user = await Users.findOne({ email: req.body.email })
        if (!user) {
            const newUser = new Users(req.body)
            const user = await newUser.save({ new: true })
            const token = await generateJWTToken(user)
            res.cookie("token", token, {
                httpOnly: true,
                maxAge: cookieAge
            })
            res.status(201).send(token)
        } else {
            next(createHttpError(402, "Email already used."))
        }
    } catch (error) {
        next(error)
        console.log(error)
    }
})

usersRoute.post('/login', async (req, res, next) => {
    try {
        const { email, password } = req.body
        const user = await Users.checkCredentials(email, password)
        if (user) {
            const token = await generateJWTToken(user)
            res.cookie("token", token, {
                httpOnly: true,
                maxAge: cookieAge,
            })
            const updateUser = await Users.findByIdAndUpdate(user._id, { lastLogin: new Date() })
            res.status(200).send(token)
        } else {
            next(createHttpError(401, "Credentials information wrong!"))
        }
    } catch (error) {
        next(error)
        console.log(error)
    }
});

usersRoute.post('/forgot-password', async (req, res, next) => {
    try {
        const { email } = req.body
        const user = await Users.findOne({ email: email })
        if (user) {
            const token = await generateJWTToken(user)
            const link = `${process.env.FE_DEV_TRUST_BACKEND_URL}/reset-password/${token}`;
            const body = forgotPassword(user.name, link)
            await sendEmail(user?.email, "SEDA OEMCP System Password Reset", body);
            res.status(200).send("password reset link sent to your email account");
        } else {
            next(createHttpError(401, "Email address not found!"))
        }
    } catch (error) {
        next(error)
        console.log(error)
    }
});
usersRoute.post('/reset-password-token',validTokenMiddleware, async(req, res, next)=>{
    try {
        const {token} = req.body
        if(token){
            res.status(200).send("valid");
        }else{
            next(createHttpError(401, "Reset Link not valid!"))
        }
    } catch (error) {
        console.log(error)
    }
})
usersRoute.put('/reset-password',validTokenMiddleware, async(req, res, next)=>{
    try {
        console.log(req.user)
        const user= await Users.findByIdAndUpdate(req.user._id, req.body, { new: true })
        if(user){
            res.status(200).send(user);
        }else{
            next(createHttpError(401, "Reset Link not valid!"))
        }
    } catch (error) {
        console.log(error)
    }
})




//get current logged user data
usersRoute.get('/me', tokenMiddleware, async (req, res, next) => {
    try {
        const userMe = await Users.findById(req.user._id).populate('site')
        res.status(200).send(userMe)
    } catch (error) {
        next(error)
        console.log(error)
    }
});

//update current logged user data
usersRoute.put('/me', tokenMiddleware, async (req, res, next) => {
    try {
        const updateUser = await Users.findByIdAndUpdate(req.user._id, req.body, { new: true })
        res.status(200).send(updateUser)
    } catch (error) {
        next(error)
    }
});

usersRoute.post('/me/change-password', tokenMiddleware, async (req, res, next) => {
    try {
        const { currentPassword, password } = req.body
        const user = await Users.checkCredentials(req.user.email, currentPassword)
        if (user) {
            const updateUser = await Users.findByIdAndUpdate(req.user._id, req.body, { new: true })
            res.status(200).send(updateUser)
        } else {
            next(createHttpError(401, "Current password wrong!"))
        }
    } catch (error) {
        next(error)
    }
});

//update current logged user avatar
usersRoute.put('/me/avatarUpload', tokenMiddleware, multer({ storage: saveToUsers }).single("avatar"), async (req, res, next) => {
    try {
        const imageUrl = req.file.path;

        const updateUser = await Users.findByIdAndUpdate(
            req.user._id,
            { avatar: imageUrl },
            { new: true }
        )
        res.status(201).send(updateUser)
    } catch (error) {
        next(error)
    }
});

//logout route
usersRoute.get('/logout', (req, res) => {
    res.clearCookie('token').status(200).send();
});

//find a specific user
usersRoute.get('/:userId', tokenMiddleware, async (req, res, next) => {
    try {
        const users = await Users.findOne({ _id: req.params.userId }).populate('site')
        res.status(200).send(users)
    } catch (error) {
        next(error)
        console.log(error)
    }
})
usersRoute.put('/:userId', tokenMiddleware, async (req, res, next) => {
    try {
        const updateUser = await Users.findByIdAndUpdate(req.params.userId, req.body, { new: true })
        res.status(200).send(updateUser)
    } catch (error) {
        next(error)
    }
});

usersRoute.put('/:userId/avatarUpload', tokenMiddleware, [roleCheck.isSuperAdmin], multer({ storage: saveToUsers }).single("avatar"), async (req, res, next) => {
    try {
        const imageUrl = req.file.path;

        const updateUser = await Users.findByIdAndUpdate(
            req.params.userId,
            { avatar: imageUrl },
            { new: true }
        )
        res.status(201).send(updateUser)
    } catch (error) {
        next(error)
    }
});
usersRoute.put('/:userId/logoUpload', tokenMiddleware, [roleCheck.isSuperAdmin], multer({ storage: saveToMedia }).single("logo"), async (req, res, next) => {
    try {
        const imageUrl = req.file.path;
        const updateUser = await Users.findByIdAndUpdate(
            req.params.userId,
            { logo: imageUrl },
            { new: true }
        )
        res.status(201).send(updateUser)
    } catch (error) {
        next(error)
        console.log(error)
    }
});

//this will be used by super admin to get all users
usersRoute.get('/role/:role', tokenMiddleware, async (req, res, next) => {
    try {
        const users = await Users.find({ role: req.params.role }).populate('site')
        res.status(200).send(users)
    } catch (error) {
        next(error)
        console.log(error)
    }
})
//only super admin can delete a user
usersRoute.delete('/:userId', tokenMiddleware, [roleCheck.isSuperAdmin], async (req, res, next) => {
    try {
        const updateUser = await Users.findByIdAndDelete(req.params.userId)
        res.status(204).send('deleted')
    } catch (error) {
        next(error)
    }
});
export default usersRoute;
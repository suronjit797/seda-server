import express from 'express'
import { apiKeyMiddleware, tokenMiddleware } from '../../utils/jwtAuth.js'
import dashboardSchema from './dashboardSchema.js'
import userSchema from '../users/schema.js'

const DashboardSetting = express.Router()

DashboardSetting.get('/', tokenMiddleware, async (req, res, next) => {
    try {
        let data = await dashboardSchema.find()

        res.send(data)
    } catch (error) {
        next(error)
    }
})
DashboardSetting.put('/', tokenMiddleware, async (req, res, next) => {
    try {
        const data = req.body
        let result
        if (data.dashboardId) {
            result = await dashboardSchema.findByIdAndUpdate(data.dashboardId, data, { upsert: true })
        } else {
            let newData = new dashboardSchema(req.body)
            result = await newData.save()

            let user = await userSchema.findById(data.userId)
            user.dashboardSetting = result._id
            let userResult = await userSchema.findByIdAndUpdate(data.userId, user, { upsert: true })
            console.log(userResult)

        }
        return res.send(result)


    } catch (error) {
        next(error)
    }
})
DashboardSetting.delete('/', tokenMiddleware, async (req, res, next) => {
    try {

        let result = await dashboardSchema.deleteMany()
        console.log(result);
        res.send(result)
    } catch (error) {
        next(error)
    }
})

export default DashboardSetting
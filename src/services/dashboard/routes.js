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
        const data= req.body
        let result
        let userResult

        if (data.dashboardId) {
            result = await dashboardSchema.findByIdAndUpdate(data.dashboardId, data, { upsert: true })
            userResult = await userSchema.findById(data.userId).populate('dashboardSetting')
        } else {
            let newData = new dashboardSchema(req.body)
            result = await newData.save()
            let user = await userSchema.findById(data.userId)
            user.dashboardSetting = result._id
            userResult = await userSchema.findByIdAndUpdate(data.userId, user, { upsert: true }).populate('dashboardSetting')
            
        }
        return res.send({ result, userResult })

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
import express from 'express'
import { apiKeyMiddleware, tokenMiddleware } from '../../utils/jwtAuth.js'
import dashboardSchema from './dashboardSchema.js'
import userSchema from '../users/schema.js'

const DashboardSetting = express.Router()

//get all setting
DashboardSetting.get('/', tokenMiddleware, async (req, res, next) => {
    try {
        let data = await dashboardSchema.find()

        res.send(data)
    } catch (error) {
        next(error)
    }
})


DashboardSetting.put('/', tokenMiddleware, async (req, res, next) => {
    // try {
    const data = req.body
    let result
    let userResult

    console.log(data)

    if (data.dashboardId) {
        result = await dashboardSchema.findByIdAndUpdate(data.dashboardId, data, { upsert: true })
        userResult = await userSchema.findById(data.userId).populate('dashboardSetting')
    } else {
        let newData = new dashboardSchema(req.body)
        result = await newData.save()
        userResult = await userSchema.findByIdAndUpdate(data.userId, { dashboardSetting: result._id }, { upsert: true }).populate('dashboardSetting')
    }

    return res.send({ result, userResult })

    // } catch (error) {
    //     next(error)
    // }
})

// delete all setting
DashboardSetting.delete('/', tokenMiddleware, async (req, res, next) => {
    try {
        let result = await dashboardSchema.deleteMany()
        res.send(result)
    } catch (error) {
        next(error)
    }
})

// get single dashboard setting by id
DashboardSetting.get('/:dashboardSettingId', tokenMiddleware, async (req, res, next) => {
    let id = req.params.dashboardSettingId
    try {
        let data = await dashboardSchema.findById(id)

        res.status(200).send(data)
    } catch (error) {
        next(error)
    }
})


export default DashboardSetting
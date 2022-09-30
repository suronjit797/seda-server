import express from 'express'
import { tokenMiddleware } from '../../utils/jwtAuth.js'
import DeviceType from './schema.js'

const DeviceTypeRoute = express.Router()

DeviceTypeRoute.get('/', tokenMiddleware, async (req, res, next) => {
    try {
        const deviceTypes = await DeviceType.find()
        res.status(200).send(deviceTypes)
    } catch (error) {
        next(error)
        console.log(error)
    }
})

DeviceTypeRoute.post('/', tokenMiddleware, async (req, res, next) => {
    try {
        const newDeviceType = new DeviceType(req.body)
        const deviceType = await newDeviceType.save({ new: true })
        res.status(201).send(deviceType)
    } catch (error) {
        next(error)
        console.log(error)
    }
})

DeviceTypeRoute.put('/:deviceTypeId', tokenMiddleware, async (req, res, next) => {
    try {
        const updateDT = await DeviceType.findByIdAndUpdate(req.params.deviceTypeId, req.body, { new: true })
        res.status(200).send(updateDT)
    } catch (error) {
        next(error)
        console.log(error)
    }
})
DeviceTypeRoute.delete('/:deviceTypeId', tokenMiddleware, async (req, res, next) => {
    try {
        const updateType = await DeviceType.findByIdAndDelete(req.params.deviceTypeId)
        res.status(204).send('deleted')
    } catch (error) {
        next(error)
        console.log(error)
    }
})

export default DeviceTypeRoute;
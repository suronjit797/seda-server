import express from 'express'
import { apiKeyMiddleware, tokenMiddleware } from '../../utils/jwtAuth.js'
import Devices from './schema.js'
import DeviceData from './deviceDataSchema.js'

const DeviceRoute = express.Router()

DeviceRoute.get('/', tokenMiddleware, async (req, res, next) => {
    try {
        const devices = await Devices.find().populate('deviceType').populate({
            path: 'site',
            populate: [
                {
                    path: 'admin',
                    select: '-__v -_id',
                },
                {
                    path: 'installer',
                    select: '-__v -_id',
                },
            ],
        })
        res.status(200).send(devices)
    } catch (error) {
        next(error)
    }
})
DeviceRoute.post('/', tokenMiddleware, async (req, res, next) => {
    try {
        const newDevice = new Devices(req.body)
        const device = await newDevice.save({ new: true })
        res.status(201).send(device)
    } catch (error) {
        next(error)
    }
})
DeviceRoute.put('/:deviceId', tokenMiddleware, async (req, res, next) => {
    try {
        const updateDevice = await Devices.findByIdAndUpdate(req.params.deviceId, req.body, { new: true })
        res.status(200).send(updateDevice)
    } catch (error) {
        next(error)
    }
})
DeviceRoute.get('/:deviceId', tokenMiddleware, async (req, res, next) => {
    try {
        const device = await Devices.findOne({ _id: req.params.deviceId }).populate('deviceType').populate({
            path: 'site',
            populate: [
                {
                    path: 'admin',
                    select: '-__v -_id',
                },
                {
                    path: 'installer',
                    select: '-__v -_id',
                },
            ],
        })
        res.status(200).send(device)

    } catch (error) {
        next(error)
    }
})
DeviceRoute.delete('/:deviceId', tokenMiddleware, async (req, res, next) => {
    try {
        const device = await Devices.findByIdAndDelete(req.params.deviceId)
        res.status(204).send('deleted')
    } catch (error) {
        next(error)
    }
})

// routes for capture device data
DeviceRoute.post('/capture', apiKeyMiddleware, async (req, res, next) => {
    try {
        req.body.device = req.device._id
        let array = req.body
        let updateArray = array.map(obj => ({ ...obj, device: req.device._id }))
        await updateArray.map((item) => {
            const newDeviceData = new DeviceData(item)
            const deviceData = newDeviceData.save({ new: true })
        })
        res.status(201).send("Device data save successfully")
    } catch (error) {
        next(error)
        console.log(error)
    }
})

export default DeviceRoute;



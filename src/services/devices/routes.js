import express from 'express'
import { apiKeyMiddleware, tokenMiddleware } from '../../utils/jwtAuth.js'
import Devices from './schema.js'
import DeviceData from './deviceDataSchema.js'
import mongoose from 'mongoose'
import SiteLocation from "../siteLocation/schema.js"
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
DeviceRoute.get('/admin', tokenMiddleware, async (req, res, next) => {
    try {
        let deviceForAdmin = []
        const sites = await SiteLocation.find({ admin: req.user._id })

        const getDevices = async (sites) => {
            const devices = await Devices.find({ site: sites._id }).populate('deviceType').populate({
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
            if (devices) {
                deviceForAdmin.push(devices)
            }
        }
        await Promise.all(sites.map(async (site) => {
            await getDevices(site)
        }));
        res.status(200).send(deviceForAdmin)

    } catch (error) {
        console.log(error)
        next(error)
    }
})
DeviceRoute.get('/installer', tokenMiddleware, async (req, res, next) => {
    try {
        let deviceForInstaller = []
        const sites = await SiteLocation.find({ installer: req.user._id })

        const getDevices = async (sites) => {
            const devices = await Devices.find({ site: sites._id }).populate('deviceType').populate({
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
            if (devices) {
                deviceForInstaller.push(devices)
            }
        }
        await Promise.all(sites.map(async (site) => {
            await getDevices(site)
        }));
        res.status(200).send(deviceForInstaller)

    } catch (error) {
        console.log(error)
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
DeviceRoute.get('/site/:siteId', tokenMiddleware, async (req, res, next) => {
    try {
        const devices = await Devices.find({ site: req.params.siteId }).populate('deviceType').populate({
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
DeviceRoute.get('/device-data/:deviceId', async (req, res, next) => {
    try {
        const data = await DeviceData.find({ device: req.params.deviceId })
        res.status(201).send(data)
    } catch (error) {
        next(error)
        console.log(error)
    }
})
DeviceRoute.get('/device-parameters/:deviceId', tokenMiddleware, async (req, res, next) => {
    try {
        const parameters = await DeviceData.aggregate([
            {
                // only match documents that have this field
                // you can omit this stage if you don't have missing fieldX
                $match: { "device": new mongoose.Types.ObjectId(req.params.deviceId) }
            },
            {
                $group: {
                    "_id": "$name",
                    "device": { "$first": "$device" },  //$first accumulator
                    "count": { "$sum": 1 },  //$sum accumulator
                }
            }

        ])
        res.status(200).send(parameters)
    } catch (error) {
        console.log(error)
    }
})
export default DeviceRoute;



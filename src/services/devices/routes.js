import express from 'express'
import { apiKeyMiddleware, tokenMiddleware } from '../../utils/jwtAuth.js'
import Devices from './schema.js'
import DeviceData from './deviceDataSchema.js'
import mongoose from 'mongoose'
import SiteLocation from "../siteLocation/schema.js"
import createHttpError from 'http-errors'
import Formula from '../formulas/schema.js'

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
        const { apiKey } = req.body
        const devices = await Devices.find({ apiKey: apiKey })
        if (!devices.length > 0) {
            const newDevice = new Devices(req.body)
            const device = await newDevice.save({ new: true })
            res.status(201).send(device)
        } else {
            next(createHttpError(401, "API Key already Used."))
        }

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


        const formulas = await Formula.find({ device: req.device._id })
        formulas.map((item) => {
            let FormulaValue = 0;
            let data;
            let p1, p2, p3, p4, p5;
            switch (item.formulaParts.selectOne) {
                case "parameter":
                    let filter = updateArray.filter((data) => data.name === item.formulaParts.valueOne)
                    return console.log(filter)
                    p1 = parseFloat(filter[0].value).toFixed(2)   // value number asse na
                    break;
                default:
                    p1=0;
                    break;
            }
            switch (item.formulaParts.selectTwo) {
                case "parameter":
                    let filter = updateArray.filter((data) => data.name === item.formulaParts.valueTwo)
                    p2 = parseFloat(filter[0].value).toFixed(2);
                    break;
                case "operator":
                    switch (item.formulaParts.valueTwo) {
                        case "+": p2 = '+';
                            break;
                        case "-": p2 = '-';
                            break;
                        case "x": p2 = '*';
                            break;
                        case "/": p2 = '/';
                            break;
                    }
                    break;
                default:
                    p2=0;
                    break;
            }
            switch (item.formulaParts.selectThree) {
                case "parameter":
                    let filter = updateArray.filter((data) => data.name === item.formulaParts.valueThree)
                    p3 = parseFloat(filter[0].value).toFixed(2);
                    break;
                case "operator":
                    switch (item.formulaParts.valueThree) {
                        case "+": p3 = '+';
                            break;
                        case "-": p3 = '-';
                            break;
                        case "x": p3 = '*';
                            break;
                        case "/": p3 = '/';
                            break;
                    }
                    break;
                default:
                    p3=0;
                    break;
            }
            switch (item.formulaParts.selectFour) {
                case "parameter":
                    let filter = updateArray.filter((data) => data.name === item.formulaParts.valueFour)
                    p4 = parseFloat(filter[0].value).toFixed(2);
                    break;
                case "operator":
                    switch (item.formulaParts.valueFour) {
                        case "+": p4 = '+';
                            break;
                        case "-": p4 = '-';
                            break;
                        case "x": p4 = '*';
                            break;
                        case "/": p4 = '/';
                            break;
                    }
                    break;
                default:
                    p4=0;
                    break;
            }
            switch (item.formulaParts.selectFive) {
                case "parameter":
                    let filter = updateArray.filter((data) => data.name === item.formulaParts.valueFive)
                    p5 = parseFloat(filter[0].value).toFixed(2);
                    break;
                case "operator":
                    switch (item.formulaParts.valueFive) {
                        case "+": p5 = '+';
                            break;
                        case "-": p5 = '-';
                            break;
                        case "x": p5 = '*';
                            break;
                        case "/": p5 = '/';
                            break;
                    }
                    break;
                default:
                    p5=0;
                    break;
            }
            FormulaValue = eval(p1 + p2 + p3 + p4 + p5)
            data ={
                name: item.name,
                value: FormulaValue,
                date: new Date(),
                device: req.device._id
            }
            updateArray.push(data)
        })

        await updateArray.map((item) => {
            const newDeviceData = new DeviceData(item)
            console.log(newDeviceData)
            // const deviceData = newDeviceData.save({ new: true })
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



import express from 'express'
import deviceDataSchema from "../devices/deviceDataSchema.js"
import Devices from '../devices/schema.js'
import mongoose from 'mongoose'
import moment from 'moment'
import { tokenMiddleware } from '../../utils/jwtAuth.js'
const ObjectId = mongoose.Types.ObjectId;

const ChartRoute = express.Router()

ChartRoute.get('/byParameter/:deviceId/:parameter/:from/:to', tokenMiddleware, async (req, res, next) => {
    try {
        let { deviceId, parameter, from, to } = req.params
        let data = [];
        const deviceData = await deviceDataSchema.find({
            device: deviceId,
            name: parameter,
            date: {
                $gte: new Date(from),
                $lte: new Date(to)
            }
        })

        if (deviceData) {
            deviceData.forEach((item) => {
                data.push([item.createdAt, (Math.round(item.value * 100) / 100).toFixed(2), item.name])
            })
        }
        res.status(200).send(data)
    } catch (error) {
        next(error)
        console.log(error)
    }
})

ChartRoute.get('/monthlyKWH/:deviceId/:parameter/:from/:to', async (req, res, next) => {
    try {

        let { deviceId, parameter, from, to } = req.params
        let data = []
        const deviceData = await deviceDataSchema.aggregate([
            {
                $match: {
                    device: ObjectId(deviceId),
                    name: parameter,
                    date: {
                        $gte: new Date(from),
                        $lte: new Date(to)
                    }
                }
            },
            {
                $group: {
                    _id: {
                        month: {
                            $month: "$date"
                        },
                        name: "$name",
                    },
                    value: {
                        $sum: { $toDouble: '$value' }
                    },
                }
            },
            {
                $project: {
                    value: "$value",
                    monthNo: "$_id.month",
                    Month: {
                        $arrayElemAt: [
                            [
                                "",
                                "Jan",
                                "Feb",
                                "Mar",
                                "Apr",
                                "May",
                                "Jun",
                                "Jul",
                                "Aug",
                                "Sep",
                                "Oct",
                                "Nov",
                                "Dec"
                            ],
                            "$_id.month"
                        ]
                    },

                }
            }
        ])
        let i = 1
        for (i; i <= 12; i++) {
            let filterData = deviceData.filter(e => e.monthNo === i)
            if (filterData.length > 0) {
                data.push(Math.round(filterData[0].value))
            } else {
                data.push(0)
            }
        }

        console.log(data.length)
        res.status(200).send(data);
    } catch (error) {
        next(error)
        console.log(error)
    }
})

ChartRoute.get('/dailyConsumption/:deviceId/:parameter', async (req, res, next) => {
    try {

        // let date = moment('2022-12-06').format('YYYY-MM-DD');
        let date = moment().format('YYYY-MM-DD');
        let { deviceId, parameter } = req.params

        const data = await deviceDataSchema.aggregate([
            {
                $match: {
                    device: ObjectId(deviceId),
                    name: parameter,
                    date: {
                        $gte: new Date(`${date}T00:00:00`),
                        $lte: new Date(`${date}T23:59:59`)
                    }
                }
            },
            {
                $group: {
                    _id: {
                        date,
                        name: "$name",
                    },
                    value: {
                        $sum: { $toDouble: '$value' }
                    },
                }
            },
        ])
        res.status(200).send(data[0]);
    } catch (error) {
        next(error)
        console.log(error)
    }
})
ChartRoute.get('/buildingPower/:deviceId/:parameter', async (req, res, next) => {
    try {

        // let date = moment('2022-12-06').format('YYYY-MM-DD');
        let date = moment().format('YYYY-MM-DD');

        const data = await deviceDataSchema.aggregate([
            {
                $match: {
                    device: ObjectId(req.params.deviceId),
                    name: req.params.parameter,
                    date: {
                        $gte: new Date(`${date}T00:00:00`),
                        $lte: new Date(`${date}T23:59:59`)
                    }
                }
            },
            {
                $group: {
                    _id: {
                        date,
                        name: "$name",
                    },
                    value: {
                        $sum: { $toDouble: '$value' }
                    },
                }
            },
        ])
        res.status(200).send(data[0]);
    } catch (error) {
        next(error)
        console.log(error)
    }
})

// device chart
ChartRoute.post('/device', async (req, res, next) => {
    let { from, to, queryDevice } = req.body
    try {
        let deviceIds = []
        let data = []
        let devices
        if (queryDevice?.length > 0) {
            devices = await Devices.find({ name: queryDevice }).select('name')
        } else {
            devices = await Devices.find().select('name')
        }

        devices.forEach(device => deviceIds.push(device._id))
        const deviceData = await deviceDataSchema.aggregate([
            {
                $match: {
                    device: { "$in": deviceIds },
                    date: {
                        $gte: new Date(from),
                        $lte: new Date(to)
                    }
                }
            },
            {
                $group: {
                    _id: "$device",
                    value: {
                        $sum: { $toDouble: '$value' }
                    }
                }
            }
        ])
        deviceData.forEach(device => {
            let matchedDevice = devices.find(d => d._id.equals(device._id))
            let newObj = { ...device, value: Number(device.value.toFixed(2)), name: matchedDevice.name }
            data.push(newObj)
        })

        res.status(200).send(data);
    } catch (error) {
        next(error)
        console.log(error)
    }
})
// device chart
ChartRoute.get('/deviceData/:from/:to', async (req, res, next) => {
    let { from, to } = req.params
    console.log({ from, to })
    try {
        let data = await deviceDataSchema.aggregate([{
            $match: {
                date: {
                    $gte: new Date(from),
                    $lte: new Date(to)
                }
            }
        }])

        let d1 = data.populate('device')
        console.log(d1)

        // let data = await deviceDataSchema.find({
        //     date: {
        //         $gte: new Date(from),
        //         $lte: new Date(to)
        //     }
        // }).populate('device')

        res.status(200).send(data);
    } catch (error) {
        next(error)
        console.log(error)
    }
})



export default ChartRoute;
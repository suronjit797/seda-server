import express from 'express'
import deviceDataSchema from "../devices/deviceDataSchema.js"
import mongoose from 'mongoose'
const ObjectId = mongoose.Types.ObjectId;

const ChartRoute = express.Router()

ChartRoute.get('/byParameter/:deviceId/:parameter', async (req, res, next) => {
    try {
        let data = [];
        const deviceData = await deviceDataSchema.find({ device: req.params.deviceId, name: req.params.parameter })
        if (deviceData) {
            deviceData.forEach(async (item) => {
                data.push([item.createdAt, (Math.round(item.value * 100) / 100).toFixed(2)])
            })
            res.status(200).send(data)
        } else {
            res.status(200).send(data)
        }
    } catch (error) {
        next(error)
        console.log(error)
    }
})

ChartRoute.get('/monthlyKWH/:deviceId/:parameter', async (req, res, next) => {
    try {
        let year = new Date().getFullYear()
        let data = []
        const deviceData = await deviceDataSchema.aggregate([
            {
                $match: {
                    device: ObjectId(req.params.deviceId),
                    name: req.params.parameter,
                    // date: { $gt: new Date(`2022-01-01`) }
                    date: { $gt: new Date(`${year}-01-01`) }
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
        console.log(deviceData)
        let i = 1
        for (i; i <= 12; i++) {
            let filterData = deviceData.filter(e => e.monthNo === i)
            if (filterData.length > 0) {
                data.push(Math.round(filterData[0].value))
            } else {
                data.push(0)
            }
        }
        res.status(200).send(data);
    } catch (error) {
        next(error)
        console.log(error)
    }
})

export default ChartRoute;
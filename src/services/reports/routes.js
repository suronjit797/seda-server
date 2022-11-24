import express from 'express'
import deviceDataSchema from "../devices/deviceDataSchema.js"
import Devices from "../devices/schema.js"
import createHttpError from 'http-errors'
import mongoose from 'mongoose';
import { tokenMiddleware } from '../../utils/jwtAuth.js';

const ReportRoute = express.Router()

ReportRoute.post('/ParameterComparison', tokenMiddleware, async (req, res, next) => {
    const { interval, device, from, to, parameter } = req.body;
    try {
        let startDate = new Date(from)
        let endDate = new Date(to)
        let FinalResult = []
        let selectedParametersData = []

        const operations = [
            {
                $match: {
                    date: { $gte: startDate, $lt: endDate },
                    device: mongoose.Types.ObjectId(device)
                }
            },
            {
                $group: {
                    _id: {
                        $add: [
                            {
                                $subtract: [
                                    { $subtract: ["$date", new Date()] },
                                    {
                                        $mod: [
                                            { $subtract: ["$date", new Date()] },
                                            1000 * 60 * parseInt(interval)
                                        ]
                                    }
                                ]
                            }, new Date()]
                    },
                    name: { $first: "$name" },
                    first_close: { $first: "$value" },
                    last_close: { $last: "$value" },
                    value: { $max: "$value" },
                }
            },
            {
                $project: {
                    _id: 1,
                    name: '$name',
                    value: '$value',
                    average: ('$first_close' / '$last_close') * 100
                }
            },
            {
                $sort: {
                    _id: 1
                }
            }
        ];

        const data = await deviceDataSchema.aggregate(operations, function (err, results) { return results });
        parameter.forEach(element => {
            let value = []
            let date = []
            const single = data.filter(item => item.name === element.value)
            single.forEach(element => {
                selectedParametersData.push(element)
                value.push(parseInt(element.value))
                date.push(element._id)
            });
            FinalResult.push({ name: element.value, data: value, date: date })
        });
        res.status(200).send({ result: FinalResult, data: selectedParametersData })
    } catch (error) {
        next(createHttpError(401, error))
        console.log(error)
    }
})


ReportRoute.post('/DeviceComparison', tokenMiddleware, async (req, res, next) => {
    try {
        const { interval, from, to, device1, parameter1, device2, parameter2 } = req.body;
        let startDate = new Date(from)
        let endDate = new Date(to)
        let FinalResult=[]
        let tableData=[]

        //device 1
        const device = await Devices.findOne({ _id: device1 })
        const operations1 = [
            {
                $match: {
                    date: { $gte: startDate, $lt: endDate },
                    device: mongoose.Types.ObjectId(device1),
                    name: parameter1
                }
            },
            {
                $group: {
                    _id: {
                        $add: [
                            {
                                $subtract: [
                                    { $subtract: ["$date", new Date()] },
                                    {
                                        $mod: [
                                            { $subtract: ["$date", new Date()] },
                                            1000 * 60 * parseInt(interval)
                                        ]
                                    }
                                ]
                            }, new Date()]
                    },
                    name: { $first: "$name" },
                    first_close: { $first: "$value" },
                    last_close: { $last: "$value" },
                    value: { $max: "$value" },
                }
            },
            {
                $project: {
                    _id: 1,
                    name: { $concat : [ device?.name, " - ", "$name" ] },
                    value: '$value',
                    average: ('$first_close' / '$last_close') * 100
                }
            },
            {
                $sort: {
                    _id: 1
                }
            }
        ];
        const parameter1Data = await deviceDataSchema.aggregate(operations1, function (err, results) { return results });
        if(parameter1Data){
            let value = []
            let date = []
            parameter1Data.forEach(element => {
                tableData.push(element)
                value.push(parseInt(element.value))
                date.push(element._id)
            });
            FinalResult.push({ name: `${device?.name} - ${parameter1}`, data: value, date: date })
        }

        // device 2
        const device2data = await Devices.findOne({ _id: device2 })
        const operations2 = [
            {
                $match: {
                    date: { $gte: startDate, $lt: endDate },
                    device: mongoose.Types.ObjectId(device2),
                    name: parameter2
                }
            },
            {
                $group: {
                    _id: {
                        $add: [
                            {
                                $subtract: [
                                    { $subtract: ["$date", new Date()] },
                                    {
                                        $mod: [
                                            { $subtract: ["$date", new Date()] },
                                            1000 * 60 * parseInt(interval)
                                        ]
                                    }
                                ]
                            }, new Date()]
                    },
                    name: { $first: "$name" },
                    first_close: { $first: "$value" },
                    last_close: { $last: "$value" },
                    value: { $max: "$value" },
                }
            },
            {
                $project: {
                    _id: 1,
                    name: { $concat : [ device2data?.name, " - ", "$name" ] },
                    value: '$value',
                    average: ('$first_close' / '$last_close') * 100
                }
            },
            {
                $sort: {
                    _id: 1
                }
            }
        ];
        const parameter2Data = await deviceDataSchema.aggregate(operations2, function (err, results) { return results });
        if(parameter2Data){
            let value = []
            let date = []
            parameter2Data.forEach(element => {
                tableData.push(element)
                value.push(parseInt(element.value))
                date.push(element._id)
            });
            FinalResult.push({ name: `${device2data?.name} - ${parameter1}`, data: value, date: date })
        }
        res.status(200).send({ result: FinalResult, data: tableData })
    } catch (error) {
        console.log(error)
        next(error)
    }
})
export default ReportRoute;
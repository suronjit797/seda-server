import express from 'express'
import deviceDataSchema from "../devices/deviceDataSchema.js"
import createHttpError from 'http-errors'
import mongoose from 'mongoose';
const ReportRoute = express.Router()

ReportRoute.post('/ParameterComparison', async (req, res, next) => {
    const { interval, device, from, to, parameter } = req.body;
    try {
        let startDate = new Date(from)
        let endDate = new Date(to)
        let result = []
        let FinalResult = []
        let selectedParametersData=[]

        const operations = [
            {
                $match: {
                    createdAt: { $gte: startDate, $lt: endDate },
                    device: mongoose.Types.ObjectId(device)
                }
            },
            {
                $group: {
                    _id: {
                        $add: [
                            {
                                $subtract: [
                                    { $subtract: ["$createdAt", new Date()] },
                                    {
                                        $mod: [
                                            { $subtract: ["$createdAt", new Date()] },
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

        const data = await deviceDataSchema.aggregate(operations, function (err, results) {
            result.push(results)
        });
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

export default ReportRoute;
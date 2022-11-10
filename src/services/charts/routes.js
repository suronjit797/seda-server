import express from 'express'
import deviceDataSchema from "../devices/deviceDataSchema.js"

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

export default ChartRoute;
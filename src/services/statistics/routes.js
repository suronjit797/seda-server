import express from 'express'

import DeviceData from '../devices/deviceDataSchema.js'

const countRouter = express.Router()

countRouter.get('/dashboardOne/:deviceId', async(req, res, next)=>{
    try {
        let todayConsumption= 0;
        let todayEmission=0;
        let thisMonthConsumption=0;
        let thisMonthEmission=0;







    } catch (error) {
        
    }
})
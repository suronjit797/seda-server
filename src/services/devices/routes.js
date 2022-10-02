import express from 'express'
import { tokenMiddleware } from '../../utils/jwtAuth.js'
import Devices from './schema.js'

const DeviceRoute = express.Router()

DeviceRoute.get('/', tokenMiddleware, async(req, res, next)=>{
    try {
        const devices = await Devices.find()
        res.status(200).send(devices)
    } catch (error) {
        next(error)
    }
})
DeviceRoute.post('/', tokenMiddleware, async(req, res, next)=>{
    try {
        const newDevice = new Devices(req.body)
        const device = await newDevice.save({ new: true })
        res.status(201).send(device)
    } catch (error) {
        next(error)
    }
})
DeviceRoute.put('/:deviceId', tokenMiddleware, async(req, res, next)=>{
    try {
        const updateDevice = await Devices.findByIdAndUpdate(req.params.deviceId, req.body, { new: true })
        res.status(200).send(updateDevice)
    } catch (error) {
        next(error)
    }
})
DeviceRoute.get('/:deviceId', tokenMiddleware, async(req, res, next)=>{
    try {
        const device = await Devices.findOne({ _id: req.params.deviceId })
        res.status(200).send(device)
        
    } catch (error) {
        next(error)
    }
})
DeviceRoute.delete('/:deviceId', tokenMiddleware, async(req, res, next)=>{
    try {
        const device = await Devices.findByIdAndDelete(req.params.deviceId)
        res.status(204).send('deleted')
    } catch (error) {
        next(error)
    }
})
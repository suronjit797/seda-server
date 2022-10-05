import express from 'express'
import { tokenMiddleware } from '../../utils/jwtAuth.js'
import ElectricityTariff from './schema.js'

const ElectricityTariffRoute = express.Router()

ElectricityTariffRoute.get('/', tokenMiddleware, async (req, res, next) => {
    try {
        const electricityTariffs = await ElectricityTariff.find()
        res.status(200).send(electricityTariffs)
    } catch (error) {
        next(error)
        console.log(error)
    }
})

ElectricityTariffRoute.post('/', tokenMiddleware, async (req, res, next) => {
    try {
        const newElectricityTariff = new ElectricityTariff(req.body)
        const electricityTariff = await newElectricityTariff.save({ new: true })
        res.status(201).send(electricityTariff)
    } catch (error) {
        next(error)
        console.log(error)
    }
})

ElectricityTariffRoute.put('/:ElectricityTariffId', tokenMiddleware, async (req, res, next) => {
    try {
        const updatedElectricityTariff = await ElectricityTariff.findByIdAndUpdate(req.params.ElectricityTariffId, req.body, { new: true })
        res.status(200).send(updatedElectricityTariff)
    } catch (error) {
        next(error)
        console.log(error)
    }
})
ElectricityTariffRoute.delete('/:ElectricityTariffId', tokenMiddleware, async (req, res, next) => {
    try {
        const deletedElectricityTariff = await ElectricityTariff.findByIdAndDelete(req.params.ElectricityTariffId)
        res.status(204).send('deleted')
    } catch (error) {
        next(error)
        console.log(error)
    }
})

export default ElectricityTariffRoute;
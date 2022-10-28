import express from 'express'
import Parameters from './schema.js'

const ParameterRoute = express.Router()

ParameterRoute.get('/', async (req, res, next) => {
    try {
        const parameters = await Parameters.find()
        res.status(200).send(parameters)
    } catch (error) {
        next(error)
    }
})

ParameterRoute.post('/', async (req, res, next) => {
    try {
        const newParameter = new Parameters(req.body)
        const parameter = await newParameter.save({ new: true })
        res.status(201).send(parameter)
    } catch (error) {
        next(error)
    }
})

ParameterRoute.put('/:parameterId', async (req, res, next) => {
    try {
        const updatedParameter = await Parameters.findByIdAndUpdate(req.params.parameterId, req.body, { new: true })
        res.status(200).send(updatedParameter)
    } catch (error) {
        next(error)
    }
})

ParameterRoute.delete('/:parameterId', async (req, res, next) => {
    try {
        const parameterDeleted = await Parameters.findByIdAndDelete(req.params.parameterId)
        res.status(204).send('deleted')
    } catch (error) {
        next(error)
    }
})

export default ParameterRoute;
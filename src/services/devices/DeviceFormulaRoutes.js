import express from 'express'
import createHttpError from 'http-errors'
import DeviceFormula from './deviceFormulaSchema.js'

const DeviceFormulaRoute = express.Router()

DeviceFormulaRoute.post('/', async (req, res, next) => {
    try {
        const { device, formula } = req.body
        const assignedFormulas = await DeviceFormula.find({ device: device, formula: formula })
        console.log(assignedFormulas)
        if (!assignedFormulas.length > 0) {
            const newFormulaAssign = new DeviceFormula(req.body)
            const assignedFormula = await newFormulaAssign.save({ new: true })
            res.status(201).send(assignedFormula)
        }else{
            next(createHttpError(401, "Formula already assigned to this device!"))
        }
    } catch (error) {
        next(error)
        console.log(error)
    }
})

DeviceFormulaRoute.get('/:deviceId', async (req, res, next) => {
    try {
        const AllAssignedFormula = await DeviceFormula.find({ device: req.params.deviceId }).populate('formula')
        res.status(200).send(AllAssignedFormula)
    } catch (error) {
        next(error)
    }
})

DeviceFormulaRoute.delete('/:Id', async (req, res, next) => {
    try {
        const removeAssignedFormula = await DeviceFormula.findByIdAndDelete(req.params.Id)
        res.status(204).send('deleted')
    } catch (error) {
        next(error)
    }
})
export default DeviceFormulaRoute;
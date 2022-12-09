import express from 'express'
import { tokenMiddleware } from '../../utils/jwtAuth.js'
import Formula from './schema.js'

const FormulaRoute = express.Router()

FormulaRoute.get('/', tokenMiddleware, async (req, res, next) => {
    try {
        const formulas = await Formula.find()
        res.status(200).send(formulas)
    } catch (error) {
        next(error)
    }
})

FormulaRoute.get('/device/:deviceId', tokenMiddleware, async (req, res, next) => {
    try {
        const formulas = await Formula.find({device: req.params.deviceId})
        res.status(200).send(formulas)
    } catch (error) {
        next(error)
    }
})

FormulaRoute.post('/', tokenMiddleware, async (req, res, next) => {
    try {
        console.log(req.body)
        const newFormula = new Formula(req.body)
        const formula = await newFormula.save({ new: true })
        res.status(201).send(formula)
    } catch (error) {
        console.log(error)
        next(error)
    }
})

FormulaRoute.put('/:formulaId', tokenMiddleware, async (req, res, next) => {
    try {
        const updatedFormula = await Formula.findByIdAndUpdate(req.params.formulaId, req.body, { new: true })
        res.status(200).send(updatedFormula)
    } catch (error) {
        next(error)
    }
})

FormulaRoute.delete('/:formulaId', tokenMiddleware, async (req, res, next) => {
    try {
        const formulaDeleted = await Formula.findByIdAndDelete(req.params.formulaId)
        res.status(204).send('deleted')
    } catch (error) {
        next(error)
    }
})

export default FormulaRoute;
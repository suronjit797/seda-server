import express from 'express'
import moment from 'moment';
import mongoose from 'mongoose';
import { tokenMiddleware } from '../../utils/jwtAuth.js'
import deviceDataSchema from '../devices/deviceDataSchema.js'
import Formula from './schema.js'
const ObjectId = mongoose.Types.ObjectId;

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
        const formulas = await Formula.find({ device: req.params.deviceId })
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

FormulaRoute.post('/formulaResult', tokenMiddleware, async (req, res, next) => {
    try {
        const { formulaName, deviceId, from, to } = req.body
        const formula = await Formula.find()
        let dataValue
        let unit

        if (!formulaName || !deviceId || !from || !to) {
            return res.status(404).send({ message: 'Please send formulaName, deviceId, starting date and ending date ' })
        }

        if (req.user.role === 'superAdmin') {
            dataValue = await deviceDataSchema.aggregate([
                {
                    $match: {
                        date: {
                            $gte: new Date(from),
                            $lte: new Date(to)
                        }
                    }
                },
                {
                    $group: {
                        _id: "$name",
                        value: {
                            $sum: { $toDouble: '$value' }
                        },
                    }
                },
            ])
        } else {
            dataValue = await deviceDataSchema.aggregate([
                {
                    $match: {
                        device: ObjectId(deviceId),
                        date: {
                            $gte: new Date(from),
                            $lte: new Date(to)
                        }
                    }
                },
                {
                    $group: {
                        _id: "$name",
                        value: {
                            $sum: { $toDouble: '$value' }
                        },
                    }
                },
            ])
        }

        const selectFormula = nameStr => {
            let formulaItems = []
            let findF = {}
            let operator
            if (formula.length > 0) {
                findF = (formula.find(f => f.name.trim() === nameStr.trim()))
                if (findF.formula.includes('x')) {
                    operator = 'x'
                } else if (findF.formula.includes('+')) {
                    operator = '+'
                } else if (findF.formula.includes('-')) {
                    operator = '-'
                } else if (findF.formula.includes('/')) {
                    operator = '/'
                }
                let formulaBreak = findF.formula.split(operator);
                formulaBreak.map(value => {
                    if ((formula.find(f => f.name.trim() === value.trim()))) {
                        let result = selectFormula(value.trim())
                        formulaItems.push(result)
                    } else if (isNaN(Number(value))) {
                        let findValue = dataValue.find(data => data._id.trim() === value.trim())
                        formulaItems.push((findValue?.value || 0))
                    } else {
                        formulaItems.push(Number(value))
                    }
                })
                let operatorResult = {
                    '+': (arr) => arr.reduce((a, b) => a + b),
                    '-': (arr) => arr.reduce((a, b) => a - b),
                    'x': (arr) => arr.reduce((a, b) => {
                        if (a === 0 || b === 0) {
                            return 0
                        }
                        return a * b
                    }),
                    '/': (arr) => arr.reduce((a, b) => {
                        if (a === 0 || b === 0) {
                            return 0
                        }
                        return a / b
                    }),
                }
                unit = findF.unit
                if (operatorResult['+'](formulaItems) === 0) {
                    return 0
                } else {
                    return operatorResult[operator](formulaItems)
                }
            }
        }

        let result = selectFormula(formulaName)
        res.send({ result: result.toFixed(2), formula: formulaName, unit })
    } catch (error) {
        next(error)
    }
})

export default FormulaRoute;
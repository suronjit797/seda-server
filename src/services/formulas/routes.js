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

FormulaRoute.post('/formulaResult', async (req, res, next) => {
    let date = moment().format('YYYY-MM-DD');
    // let date = moment().format('YYYY-MM-DD');
    let year = new Date().getFullYear()
    let month = new Date().getMonth() + 1

    let lastDay = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]

    const { formulaName, isMonthly, deviceId } = req.body
    const formula = await Formula.find()

    if (!formulaName || !deviceId) {
        return res.status(404).send({ message: 'Please send formulaName, deviceId ' })
    }

    const dataValue = await deviceDataSchema.aggregate([
        {
            $match: {
                device: ObjectId(deviceId),
                date: !!isMonthly ? {
                    $gte: new Date(`${year}-${('00' + month).slice(-2)}-01`),
                    $lte: new Date(`${year}-${('00' + month).slice(-2)}-${lastDay[month - 1]}`)
                } : {
                    $gte: new Date(`${date}T00:00:00`),
                    $lte: new Date(`${date}T23:59:59`)
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

    const selectFormula = nameStr => {
        let formulaItems = []
        let findF = {}
        let operator
        if (formula.length > 0) {
            findF = (formula.find(f => f.name === nameStr))
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
                    a = a === 0 ? 1 : a
                    b = b === 0 ? 1 : b
                    return a * b
                }),
                '/': (arr) => arr.reduce((a, b) => {
                    a = a === 0 ? 1 : a
                    b = b === 0 ? 1 : b
                    return a / b
                }),
            }
            if (operatorResult['+'](formulaItems) === 0) {
                return 0
            } else {
                return operatorResult[operator](formulaItems)
            }
        }
    }

    let result = selectFormula(formulaName)
    res.send({ result, formula: formulaName })

})

export default FormulaRoute;
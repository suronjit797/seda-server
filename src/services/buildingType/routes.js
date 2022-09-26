import express from 'express'
import { tokenMiddleware } from '../../utils/jwtAuth.js'
import BuildingType from './schema.js'

const BuildingTypeRoute = express.Router()

BuildingTypeRoute.get('/',tokenMiddleware, async (req, res, next) => {
    try {
        const buildingTypes = await BuildingType.find()
        res.status(200).send(buildingTypes)
    } catch (error) {
        next(error)
        console.log(error)
    }
})

BuildingTypeRoute.post('/',tokenMiddleware, async (req, res, next) => {
    try {
        const newBuildingType = new BuildingType(req.body)
        const buildingType = await newBuildingType.save({ new: true })
        res.status(201).send(buildingType)
    } catch (error) {
        next(error)
        console.log(error)
    }
})

BuildingTypeRoute.put('/:btId',tokenMiddleware, async (req, res, next) => {
    try {
        const updateBT = await BuildingType.findByIdAndUpdate(req.params.btId, req.body, { new: true })
        res.status(200).send(updateBT)
    } catch (error) {
        next(error)
        console.log(error)
    }
})

BuildingTypeRoute.delete('/:typeId',tokenMiddleware, async (req, res, next) => {
    try {
        const updateType = await BuildingType.findByIdAndDelete(req.params.typeId)
        res.status(204).send('deleted')
    } catch (error) {
        next(error)
        console.log(error)
    }
})

export default BuildingTypeRoute;
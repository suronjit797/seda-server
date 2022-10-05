import express from 'express'
import { tokenMiddleware } from '../../utils/jwtAuth.js'
import SiteLocation from './schema.js'


const SiteLocationRoute = express.Router()

SiteLocationRoute.get('/', tokenMiddleware, async (req, res, next) => {
    try {
        const siteLocations = await SiteLocation.find().populate('admin').populate('buildingBackground').populate('installer').populate('tariffElectricity')
        res.status(200).send(siteLocations)
    } catch (error) {
        next(error)
        console.log(error)
    }
})
SiteLocationRoute.post('/', tokenMiddleware, async (req, res, next) => {
    try {
        const newSiteLocation = new SiteLocation(req.body)
        const siteLocation = await newSiteLocation.save({ new: true })
        res.status(201).send(siteLocation)
    } catch (error) {
        next(error)
        console.log(error)
    }
})
SiteLocationRoute.put('/:siteId', tokenMiddleware, async (req, res, next) => {
    try {
        const updatedSiteLocation = await SiteLocation.findByIdAndUpdate(req.params.siteId, req.body, { new: true })
        res.status(200).send(updatedSiteLocation)
    } catch (error) {
        next(error)
        console.log(error)
    }
})
SiteLocationRoute.get('/:siteId', tokenMiddleware, async (req, res, next) => {
    try {
        const siteLocation = await SiteLocation.findOne({ _id: req.params.siteId }).populate('admin').populate('buildingBackground').populate('installer').populate('tariffElectricity')
        res.status(200).send(siteLocation)
    } catch (error) {
        next(error)
        console.log(error)
    }
})
SiteLocationRoute.get('/admin-sites/:adminId', tokenMiddleware, async (req, res, next) => {
    try {
        const siteLocation = await SiteLocation.find({ admin: req.params.adminId }).populate('admin').populate('buildingBackground').populate('installer').populate('tariffElectricity')
        res.status(200).send(siteLocation)
    } catch (error) {
        next(error)
        console.log(error)
    }
})
SiteLocationRoute.get('/installer-sites/:installerId', tokenMiddleware, async (req, res, next) => {
    try {
        const siteLocation = await SiteLocation.find({ installer: req.params.installerId }).populate('admin').populate('buildingBackground').populate('installer').populate('tariffElectricity')
        res.status(200).send(siteLocation)
    } catch (error) {
        next(error)
        console.log(error)
    }
})
SiteLocationRoute.delete('/:siteId', tokenMiddleware, async (req, res, next) => {
    try {
        const siteLocation = await SiteLocation.findByIdAndDelete(req.params.siteId)
        res.status(204).send('deleted')
    } catch (error) {
        next(error)
        console.log(error)
    }
})

export default SiteLocationRoute;
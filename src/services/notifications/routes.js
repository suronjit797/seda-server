import express from 'express'
import Notifications from './schema.js'
import AssignAlarm from './assignAlarm.js'
import { tokenMiddleware } from '../../utils/jwtAuth.js'

const NotificationRoute = express.Router()

NotificationRoute.get('/', tokenMiddleware, async (req, res, next) => {
    try {
        const notifications = await Notifications.find().populate({
            path: 'site',
            populate: [
                {
                    path: 'admin',
                    select: '-__v -_id',
                },
                {
                    path: 'installer',
                    select: '-__v -_id',
                },
            ],
        }).populate({
            path: 'device',
            populate: [
                {
                    path: 'deviceType',
                    select: '-__v -_id',
                }
            ],
        })
        res.status(200).send(notifications)
    } catch (error) {
        next(error)
    }
})

NotificationRoute.get('/assign', tokenMiddleware, async (req, res, next) => {
    try {
        const assignedAlarm = await AssignAlarm.find().populate('site').populate('alarm')
        res.status(200).send(assignedAlarm)
    } catch (error) {
        next(error)
    }
})

NotificationRoute.post('/', tokenMiddleware, async (req, res, next) => {
    try {
        const newNotification = new Notifications(req.body)
        const notification = await newNotification.save({ new: true })
        res.status(201).send(notification)
    } catch (error) {
        next(error)
    }
})

NotificationRoute.post('/assign', tokenMiddleware, async (req, res, next) => {
    try {
        const newAlarmAssign = new AssignAlarm(req.body)
        const assignedAlarm = await newAlarmAssign.save({ new: true })
        res.status(201).send(assignedAlarm)
    } catch (error) {
        next(error)
    }
})

NotificationRoute.get('/site/:siteId', tokenMiddleware, async (req, res, next) => {
    try {
        const notifications = await Notifications.find({ site: req.params.siteId }).populate({
            path: 'site',
            populate: [
                {
                    path: 'admin',
                    select: '-__v -_id',
                },
                {
                    path: 'installer',
                    select: '-__v -_id',
                },
            ],
        }).populate({
            path: 'device',
            populate: [
                {
                    path: 'deviceType',
                    select: '-__v -_id',
                }
            ],
        })
        res.status(200).send(notifications)
    } catch (error) {
        next(error)
    }
})

NotificationRoute.get('/:id', tokenMiddleware, async (req, res, next) => {
    try {
        const notifications = await Notifications.findById(req.params.id).populate({
            path: 'site',
            populate: [
                {
                    path: 'admin',
                    select: '-__v -_id',
                },
                {
                    path: 'installer',
                    select: '-__v -_id',
                },
            ],
        }).populate({
            path: 'device',
            populate: [
                {
                    path: 'deviceType',
                    select: '-__v -_id',
                }
            ],
        })
        res.status(200).send(notifications)
    } catch (error) {
        next(error)
    }
})

NotificationRoute.put('/:id', tokenMiddleware, async (req, res, next) => {
    try {
        const updateNotification = await Notifications.findByIdAndUpdate(req.params.id, req.body, { new: true })
        res.status(200).send(updateNotification)
    } catch (error) {
        next(error)
    }
})

NotificationRoute.put('/assign/:id', tokenMiddleware, async (req, res, next) => {
    try {
        const updateNotification = await AssignAlarm.findByIdAndUpdate(req.params.id, req.body, { new: true })
        res.status(200).send(updateNotification)
    } catch (error) {
        next(error)
    }
})

NotificationRoute.delete('/:id', tokenMiddleware, async (req, res, next) => {
    try {
        const updateType = await Notifications.findByIdAndDelete(req.params.id)
        res.status(204).send('deleted')
    } catch (error) {
        next(error)
    }
})

NotificationRoute.delete('/assign/:id', tokenMiddleware, async (req, res, next) => {
    try {
        const updateType = await AssignAlarm.findByIdAndDelete(req.params.id)
        res.status(204).send('deleted')
    } catch (error) {
        next(error)
    }
})

export default NotificationRoute;
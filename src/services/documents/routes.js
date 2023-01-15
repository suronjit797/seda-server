import express from 'express'
import multer from 'multer'
import { saveToMedia } from '../../utils/cloudinarySetup.js'
import { tokenMiddleware } from '../../utils/jwtAuth.js'
import Documents from './schema.js'

const documentRoute = express.Router()


documentRoute.post('/', tokenMiddleware, async (req, res, next) => {
    try {
        req.body.uploadBy = req.user._id
        const newDocument = new Documents(req.body)
        const document = await newDocument.save({ new: true })
        res.status(201).send(document)
    } catch (error) {
        next(error)
    }

})



documentRoute.put('/:documentId', tokenMiddleware, multer({ storage: saveToMedia }).single("media"), async (req, res, next) => {
    try {
        const imageUrl = req.file.path;
        const updateDocument = await Documents.findByIdAndUpdate(
            req.params.documentId,
            { media: imageUrl },
            { new: true }
        )
        res.status(201).send(updateDocument)
    } catch (error) {
        next(error)
    }
})

documentRoute.get('/:siteId/:type', async (req, res, next) => {
    try {
        const documents = await Documents.find({ site: req.params.siteId, type: req.params.type }).populate('site').populate('uploadBy')
        res.status(200).send(documents)
    } catch (error) {
        next(error)
        console.log(error)
    }
})

documentRoute.delete('/:documentId', async (req, res, next) => {
    try {
        const documents = await Documents.findByIdAndDelete(req.params.documentId)
        res.status(200).send('deleted')
    } catch (error) {
        next(error)
        console.log(error)
    }
})

export default documentRoute;
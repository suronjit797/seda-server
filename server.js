import 'dotenv/config'
import express from "express"
import listEndpoints from "express-list-endpoints"
import mongoose from 'mongoose'
import cors from "cors"
import cookieParser from "cookie-parser"
import errors from './src/utils/errorHandlers.js'
import {port, corsConfig} from './src/utils/serverConfig.js'
import usersRoute from './src/services/users/routes.js'
import BuildingTypeRoute from './src/services/buildingType/routes.js'
import SiteLocationRoute from './src/services/siteLocation/routes.js'
import documentRoute from './src/services/documents/routes.js'

const server = express()

// ******************** MIDDLEWARES ******************
server.use(cors(corsConfig));
server.use(express.json())
server.use(cookieParser())
server.set('trust proxy', 1)

// ******************* Static Page ***********************
server.use(express.static('./', {index: 'index.html'}))

// ******************* ROUTES ***********************
server.use("/users", usersRoute)
server.use("/building-type",BuildingTypeRoute)
server.use("/site-location",SiteLocationRoute)
server.use("/documents", documentRoute)

// ******************* ERROR HANDLERS ******************
server.use(errors.notFound)
server.use(errors.badRequest)
server.use(errors.UnAuthorized)
server.use(errors.Forbidden)
server.use(errors.ServerError)

// ******************* Server Configure ******************
mongoose.connect(process.env.MONGO_DEV_URL)

mongoose.connection.on("connected", () => {
  console.log('Successfully connected to mongo!')
  server.listen(port, () => {
    console.table(listEndpoints(server))
    console.log("Server is running on port ", port)
  })
})

mongoose.connection.on("error", err => {
  console.log("MONGO ERROR: ", err)
})
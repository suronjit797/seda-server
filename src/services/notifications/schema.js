import mongoose from 'mongoose'

const { Schema, model } = mongoose

const notificationSchema = new Schema({
    name: { type: String, required: true },
    type: {type: String},
    site: {type: Schema.Types.ObjectId, ref: "SiteLocation", required: true},
    device: {type: Schema.Types.ObjectId, ref: "Devices", required: true},
    parameter: {type: String},
    option: {type: String},
    value: {type: String},
    interval: {type: String},
}, {
    timestamps: true
})

export default model("Notifications", notificationSchema)
import mongoose from 'mongoose'

const { Schema, model } = mongoose

const deviceSchema = new Schema({
    name: { type: String, required: true },
    deviceType: {type: Schema.Types.ObjectId, ref: "DeviceType", required: true},
    serial:{type: String},
    apiKey:{type: String, required: true, unique: true },
    site: {type: Schema.Types.ObjectId, ref: "SiteLocation", required: true},
}, {
    timestamps: true
})

export default model("Devices", deviceSchema)
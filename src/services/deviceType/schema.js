import mongoose from 'mongoose'

const { Schema, model } = mongoose

const deviceTypeSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String},
}, {
    timestamps: true
})

export default model("DeviceType", deviceTypeSchema) 
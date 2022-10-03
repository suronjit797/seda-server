import mongoose from 'mongoose'

const { Schema, model } = mongoose

const deviceDataSchema = new Schema({
    name: { type: String, required: true },
    value: { type: String, },
    date: { type: Date, default: Date },
    device: {type: Schema.Types.ObjectId, ref: "Devices", required: true},
}, {
    timestamps: true
})

export default model("DeviceData", deviceDataSchema)
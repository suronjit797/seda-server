import mongoose from 'mongoose'

const { Schema, model } = mongoose

const ParametersSchema = new Schema({
    name: { type: String, required: true },
    type: { type: String },
    value: { type: String },
}, {
    timestamps: true
})

export default model("Parameters", ParametersSchema) 
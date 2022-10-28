import mongoose from 'mongoose'

const { Schema, model } = mongoose

const formulaSchema = new Schema({
    name: { type: String, required: true },
    unit: { type: String},
    formula: { type: String},
}, {
    timestamps: true
})

export default model("formula", formulaSchema) 
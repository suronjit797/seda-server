import mongoose from 'mongoose'

const { Schema, model } = mongoose

const deviceFormulaSchema = new Schema({
    device: {type: String},
    formula: {type: String, ref: "formula", required: true},
}, {
    timestamps: true
})

export default model("deviceFormula", deviceFormulaSchema)
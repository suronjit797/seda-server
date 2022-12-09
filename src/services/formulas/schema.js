import mongoose from 'mongoose'

const { Schema, model } = mongoose
const formulaPartSchema = new Schema({
    selectOne: { type: String },
    valueOne: { type: String },
    selectTwo: { type: String },
    valueTwo: { type: String },
    selectThree: { type: String },
    valueThree: { type: String },
    selectFour: { type: String },
    valueFour: { type: String },
    selectFive: { type: String },
    valueFive: { type: String },
});

const formulaSchema = new Schema({
    name: { type: String, required: true },
    unit: { type: String },
    formula: { type: String },
    device: {type: Schema.Types.ObjectId, ref: "Devices"},
    type: { type: String, required: true, enum: ["system", "device"], default: "system" },
    formulaParts: formulaPartSchema,
}, {
    timestamps: true
})

export default model("formula", formulaSchema) 
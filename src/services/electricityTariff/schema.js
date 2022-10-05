import mongoose from 'mongoose'

const { Schema, model } = mongoose

const electricityTariffSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String},
}, {
    timestamps: true
})

export default model("ElectricityTariff", electricityTariffSchema) 
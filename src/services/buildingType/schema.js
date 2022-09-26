import mongoose from 'mongoose'

const { Schema, model } = mongoose

const buildingTypeSchema = new Schema({
    name: { type: String, required: true },
}, {
    timestamps: true
})

export default model("BuildingType", buildingTypeSchema) 
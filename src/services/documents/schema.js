import mongoose from 'mongoose'

const { Schema, model } = mongoose

const documentSchema = new Schema({
    name: { type: String, required: true },
    location: { type: String },
    media: { type: String },
    type: { type: String, enum: ["SchematicDiagram", "ElectricBill"], default:"ElectricBill" },
    site: {type: Schema.Types.ObjectId, ref: "SiteLocation", required: true},
    uploadBy: { type: Schema.Types.ObjectId, ref: "Users", required: true },
}, {
    timestamps: true
})

export default model("Documents", documentSchema) 
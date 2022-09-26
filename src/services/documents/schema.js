import mongoose from 'mongoose'

const { Schema, model } = mongoose

const documentSchema = new Schema({
    name: { type: String, required: true },
    media: { type: String, required: true },
    type: { type: String, enum: ["SchematicDiagram", "ElectricBill"], default:"ElectricBill" },
    user: {type: Schema.Types.ObjectId, ref: "Users", required: true},
    uploadBy: { type: Schema.Types.ObjectId, ref: "Users", required: true },
}, {
    timestamps: true
})

export default model("Documents", documentSchema) 
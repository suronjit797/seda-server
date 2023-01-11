import mongoose from 'mongoose'

const { Schema, model } = mongoose

const dashboardSettingSchema = new Schema({
    name: { type: 'string', required: true, default: "Dashboard 1" },
    userId: { type: Schema.Types.ObjectId, ref: "Users" },
    counter: { type: Array, required: true },
    graphs: { type: Object, required: true },
    dashboardType: { type: Number, default: 1 }
}, {
    timestamps: true
})

export default model("DashboardSettingSchema", dashboardSettingSchema)
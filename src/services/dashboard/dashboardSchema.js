import mongoose from 'mongoose'

const { Schema, model } = mongoose

const dashboardSettingSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "Users" },
    dashboardType: { type: Number, default: 1 },
    dashboard1: {
        type: Object,
        name: { type: 'string', required: true, default: "Dashboard 1" },
        counter: { type: Array, required: true },
        graphs: { type: Object, required: true },
    },
    dashboard2: {
        type: Object,
        name: { type: 'string', required: true, default: "Dashboard 1" },
        counter: { type: Array, required: true },
        graphs: { type: Object, required: true },
    },
    dashboard3: {
        type: Object,
        name: { type: 'string', required: true, default: "Dashboard 1" },
        counter: { type: Array, required: true },
        graphs: { type: Object, required: true },
    }
}, {
    timestamps: true
})

export default model("DashboardSettingSchema", dashboardSettingSchema)
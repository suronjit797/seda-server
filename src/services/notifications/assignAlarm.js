import mongoose from 'mongoose'

const { Schema, model } = mongoose

const AssignAlarmSchema = new Schema({
    name: {type: String},
    email: {type: String, match: /.+\@.+\..+/},
    role: { type: String, required: true, enum: ["installer", "admin", "user", "public", "external"], default: "external" },
    site:{type: Schema.Types.ObjectId, ref: "SiteLocation", required: true},
    alarm: {type: Schema.Types.ObjectId, ref: "Notifications", required: true},
    isActive: { type: Boolean, default: true },
}, {
    timestamps: true
})

export default model("AssignAlarm", AssignAlarmSchema)
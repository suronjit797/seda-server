import mongoose from 'mongoose'

const { Schema, model } = mongoose

const AssignAlarmSchema = new Schema({
    name: {type: String},
    email: {type: String, match: /.+\@.+\..+/},
    user: {type: Schema.Types.ObjectId, ref: "Users", required: true},
    alarm: {type: Schema.Types.ObjectId, ref: "Notifications", required: true},
    type: { type: String, required: true, enum: ["existing", "external"], default: "existing" },
    isActive: { type: Boolean, default: true },
}, {
    timestamps: true
})

export default model("AssignAlarm", AssignAlarmSchema)
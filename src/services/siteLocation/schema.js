import mongoose from 'mongoose'
const { Schema, model } = mongoose

const siteLocationSchema = new Schema({
    name: { type: String, required: true },
    buildingName: { type: String },
    buildingType: { type: String },
    buildingAddress1: { type: String },
    buildingAddress2: { type: String },
    buildingPostalCode: { type: String },
    buildingOwnerName: { type: String },
    buildingOwnerEmail: { type: String },
    contactPersonName: { type: String },
    contactPersonPhone: { type: String },
    localAuthority:{ type: String },
    netFloorArea: { type: String },
    tariffElectricity: {type: Schema.Types.ObjectId, ref: "ElectricityTariff"},
    remark: { type: String },
    installer: {type: Schema.Types.ObjectId, ref: "Users", required: true},
    admin: {type: Schema.Types.ObjectId, ref: "Users", required: true},
    buildingBackground:{type: Schema.Types.ObjectId, ref: "BuildingType"},
}, {
    timestamps: true
})

export default model("SiteLocation", siteLocationSchema) 
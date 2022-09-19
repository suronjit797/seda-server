import mongoose from 'mongoose'
import bcrypt from 'bcrypt'
const { Schema, model } = mongoose

const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, match: /.+\@.+\..+/, required: true },
    password: { type: String, required: true },
    companyName: { type: String },
    buildingName: { type: String },
    buildingType: { type: String },
    phone: { type: String },
    address: { type: String },
    netFloorArea: { type: String },
    tariffElectricity: { type: String },
    referenceDocument: [{
        name: { type: String },
        file: { type: String }
    }],
    remark: { type: String },
    role: { type: String, required: true, enum: ["superAdmin", "installer", "admin", "user", "public", "clientUser", "clientOperatorUser"], default: "admin" },
    parent: { type: String },
    isActive: { type: Boolean, default: true },
    logo: { type: String },
    avatar: { type: String },
}, {
    timestamps: true
})

userSchema.pre("save", async function (next) {
    if (this.avatar) {

    } else {
        this.avatar = `https://ui-avatars.com/api/?name=${this.name}`;
    }
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 12);
    }
    next();
});

userSchema.statics.checkCredentials = async function (email, userPassword) {
    const findUser = await this.findOne({ email });
    if (await bcrypt.compare(userPassword, findUser.password)) {
        return findUser;
    } else {
        return null;
    }
};

// hash password when update
userSchema.pre('findOneAndUpdate', async function () {
    const update = this.getUpdate();
    const { password: plainPwd } = update

    if (plainPwd) {
        const password = await bcrypt.hash(plainPwd, 12)
        this.setUpdate({ ...update, password })
    }
});

// This will omit information from the Doc for every operation
userSchema.methods.toJSON = function () {
    const userDocument = this
    const userObject = userDocument.toObject()

    delete userObject.password
    delete userObject.__v

    return userObject
}

mongoose.models = {}
export default model("Users", userSchema)
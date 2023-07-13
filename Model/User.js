const mongoose = require("mongoose")

const userSchema = mongoose.Schema({
    username: { type: String },
    email: { type: String, unique: true, required: true },
    password: { type: String },
    mobile: { type: Number },
    otp: { type: Number },
    otpTimeStamp: { type: Number },
    otpVerify: { type: Boolean, default: false }
})

const Users = mongoose.model('Users', userSchema)

module.exports = Users;
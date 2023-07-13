
const Users = require("../Model/User");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const sendmail = require("../SendMail");

const CreateUser = async (req, res) => {

    const CheckEmail = await Users.find({
        email: req.body.email
    })
    if (CheckEmail.length > 0) {
        res.json({
            status: 0, message: "email already taken"
        })
        return
    }
    const { password } = req.body  //req.body.password = password
    console.log(req.body)
    const hashPassword = await bcrypt.hash(password, 10)
    const createNew = await Users.create({ ...req.body, password: hashPassword })

    if (!createNew) {
        res.json({ status: 0, message: "User Not created" })
        return
    }

    res.json({ status: 1, message: "Created Successfully" })

};

const getAllUser = async (req, res) => {
    const UserList = await Users.find()
    if (!UserList) {
        res.json({ status: 0, message: "user is not found" })
        return
    }
    res.json({ status: 1, response: UserList })

}


const login = async (req, res) => {
    const { email, password } = req.body
    const checkUser = await Users.findOne({ email: email })
    if (checkUser) {
        const checkPassword = await bcrypt.compare(password, checkUser.password)
        if (checkPassword) {
            let token = jwt.sign({ username: checkUser.username, userId: checkUser._id }, "abcd", { expiresIn: "1hr" })
            res.json({ status: 1, message: "login Success", token: token })
        } else {
            res.json({ status: 0, message: "Invalid Password" })
        }
    } else {
        res.json({ status: 0, message: "User not found" })
    }
}

const forgotPassword = async (req, res) => {
    const { email } = req.body
    const checkUser = await Users.findOne({ email: email })
    if (!checkUser) {
        res.json({ status: 0, message: "user not found" })
        return
    }
    let otp = Math.floor(1000 + Math.random() * 9000); //4 digit
    let otpTimeStamp = Date.now() + 360000;// 6mins
    let data = {
        otp: otp,
        otpTimeStamp: otpTimeStamp,
    }

    const updateUser = await Users.updateOne({ _id: checkUser._id }, data)
    let content = `Hi ${checkUser.username} \n Your OTP : ${otp} \n This will valid upto 6mins.`
    sendmail(email, "OTP for ForgotPassword", content)
    res.json({ status: 1, mesage: `OTP sent ur mail` })

}

const verifyOtp = async (req, res) => {
    const { email, otp } = req.body
    const checkUser = await Users.findOne({ email: email })
    if (!checkUser) {
        res.json({ status: 0, message: "user not found" })
        return
    }
    if (parseInt(otp) === checkUser.otp) {
        if (checkUser.otpTimeStamp > Date.now()) {
            const update = await Users.updateOne({ _id: checkUser._id }, { otpVerify: true })
            if (update) {
                res.json({ status: 1, message: "OTP Validtion success" })
            }
        } else {
            res.json({ status: 0, message: "OTP expired" })
        }
    } else {
        res.json({ status: 0, message: "OTP invalid" })

    }
}

const resetPassword = async (req, res) => {
    const { email, newPassword, confirmPassword } = req.body
    const checkUser = await Users.findOne({ email: email })
    if (!checkUser) {
        res.json({ status: 0, message: "user not found" })
        return
    }
    if (checkUser.otpVerify) {
        if (newPassword === confirmPassword) {
            const hashPassword = await bcrypt.hash(newPassword, 10)
            const update = await Users.updateOne({ _id: checkUser._id }, { password: hashPassword, otpVerify: false })
            if (update) {
                res.json({ status: 1, message: "Password Reset Successfully" })
            }
        } else {
            res.json({ status: 0, message: "Password not match" })
        }
    } else {
        res.json({ status: 0, message: "OTP validation Required" })
    }
}

const addfield=async()=>{
    query=[]
    query.push({
        $addFields:{
            totalHomework: { $sum: "$homework" } ,
            totalQuiz: { $sum: "$quiz" }
        }
    })

    const aggregate =await Users.aggregate(query)
}

module.exports = { CreateUser, getAllUser, login, forgotPassword, verifyOtp, resetPassword };
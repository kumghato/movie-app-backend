const nodemailer = require('nodemailer')

const sendmail = async (email, subject, text) => {
    try {
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com",
            service: "gmail",
            port: 587,
            secure: true,
            auth: {
                user: "kumghatokhala11@gmail.com",
                pass: "hadkqiuvvtahlimt"
            }
        })

        await transporter.sendMail({
            from: "kumghatokhala11@gmail.com",
            to: email,
            subject: subject,
            text: text,
        })
        console.log("Email sent Successfully")
    } catch (error) {
        console.log(error)
    }
}

module.exports = sendmail
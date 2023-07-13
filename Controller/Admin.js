const Admin = require('../Model/Admin')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const createAdmin = async (req, res) => {
    const createNew = await Admin.create({ ...req.body })
}

const login = async (req, res) => {
    const { email, password } = req.body
    const checkUser = await Admin.findOne({ email: email })
    if (checkUser) {
        const checkPassword = await bcrypt.compare(password, checkPassword.password)
    }
}

module.exports = { createAdmin, login }
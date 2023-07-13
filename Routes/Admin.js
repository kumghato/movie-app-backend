const express = require('express')
const { createAdmin, login } = require('../Controller/Admin')


const routes = express.Router()

routes.route("/create/admin").post(createAdmin)
routes.route("/login/admin").post(login)

module.exports = routes
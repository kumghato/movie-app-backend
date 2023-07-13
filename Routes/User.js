const express = require("express")
const { CreateUser, getAllUser, login, forgotPassword, verifyOtp, resetPassword } = require("../Controller/User")


const routes = express.Router()
routes.route("/create/user").post(CreateUser)
routes.route("/get/all/user").get(getAllUser)
routes.route("/login").post(login)
routes.route("/forgot/password").post(forgotPassword)
routes.route('/verify/otp').post(verifyOtp)
routes.route('/reset/password').post(resetPassword)
// routes.route("/get/movie/:id").get(CreateMovie.getMovieById)
// routes.route("/update/movie/:id").put(CreateMovie.updateMovieById)
// routes.route("/delete/movie/:id").delete(CreateMovie.deleteMoviebyId)
module.exports = routes 
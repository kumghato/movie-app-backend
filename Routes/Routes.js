const express = require("express")
const CreateMovie = require("../Controller/CreateMovie")
const authentication = require("../MiddleWare/Auth")

const routes = express.Router()
routes.route("/create/movies").post(authentication, CreateMovie.CreateMovie)
routes.route("/get/all/movies").get(authentication, CreateMovie.getAllMovie)
routes.route("/get/movie/:id").get(authentication, CreateMovie.getMovieById)
routes.route("/update/movie/:id").put(authentication, CreateMovie.updateMovieById)
routes.route("/delete/movie/:id").delete(authentication, CreateMovie.deleteMoviebyId)
routes.route('/aggregate/movie').post(CreateMovie.aggregateMovie)

module.exports = routes 
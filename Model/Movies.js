const mongoose = require("mongoose")

const movieSchema = mongoose.Schema({
    name: { type: String },
    producer: { type: String },
    director: { type: String },
    releaseDate: { type: String },
    image: { type: String },
    createdBy: { type: mongoose.Schema.Types.ObjectId }
})

const Movies = mongoose.model('Movies', movieSchema)

module.exports = Movies;
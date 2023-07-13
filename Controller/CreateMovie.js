const { query } = require("express");
const Movies = require("../Model/Movies");
const multer = require("multer")

const fileStorage = multer.diskStorage({
    destination: (req, res, cb) => { //cb=callback
        cb(null, "./Uploads")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + "" + file.originalname)
    }
})

const upload = multer({
    storage: fileStorage
}).single("image")

const CreateMovie = async (req, res) => {

    upload(req, res, async (err) => {
        if (err) {
            console.log(err)
        } else {
            let image;
            if (req.file) {
                console.log(req.file)

                image = req.file.path.replace(/\\/g, "/")
            }
            console.log(req.body)
            const createNewMovie = await Movies.create({ ...req.body, createdBy: req.userId, image: image })

            if (!createNewMovie) {
                res.json({ status: 0, message: "Movie Not created" })
                return
            }

            res.json({ status: 1, message: "Created Successfully" })

        }
    })

};

const getAllMovie = async (req, res) => {
    const movieList = await Movies.find()

    if (!movieList) {
        res.json({ status: 0, message: "Movie is not found" })
        return
    }
    res.json({ status: 1, response: movieList })

}
const getMovieById = async (req, res) => {
    const getMovie = await Movies.findById(req.params.id)
    if (!getMovie) {
        res.json({ status: 0, message: "Movie is not found" })
        return
    }
    res.json({ status: 1, response: getMovie })
}

const updateMovieById = async (req, res) => {
    const updateMovie = await Movies.findByIdAndUpdate(req.params.id, req.body)
    if (!updateMovie) {
        res.json({ status: 0, message: "Movie is not updated" })
        return
    }
    res.json({ status: 1, message: "updated" })
}
const deleteMoviebyId = async (req, res) => {
    const deleteMovie = await Movies.findByIdAndDelete(req.params.id)
    if (!deleteMovie) {
        res.json({ status: 0, message: "Movie is not deleted" })
        return
    }
    res.json({ status: 1, message: "successfully deleted" })
}

const aggregateMoie = async (req, res) => {
    const { search, limit, skip } = req.body
    let query = []

    if (search !== "") {
        query.push({
            $match: {
                $or: [
                    {
                        name: {
                            $regex: search + '.*',
                        }
                    },
                    {
                        director: {
                            $regex: search + '.*',
                        }
                    },
                    {
                        producer: {
                            $regex: search + '.*',
                        }
                    }
                ]
            }
        })
    }

    const withoutLimit = Object.assign([], query)
    withoutLimit.push({ $count: 'count' })

    query.push(
        { $skip: parseInt(skip) },
        { $limit: parseInt(limit) },
        {
            $project: {
                name: 1,
                director: 1,
                producer: 1,
                releaseDate: 1
            }
        }
    )

    const finalquery = [
        {
            $facet: {
                overall: withoutLimit,
                documentdata: query
            }
        }
    ]

    const getMovies = await Movies.aggregate(finalquery)
    let data = getMovies[0].documentdata
    let fullcount = getMovies[0]?.overall[0]?.count

    if (data && data.length > 0) {
        res.json({
            status: 1,
            response: {
                result: data,
                fullcount: fullcount,
                length: data.length
            }
        })
    } else {
        res.json({
            status: 0,
            response: {
                result: [],
                fullcount: fullcount,
                length: data.length
            }
        })
    }
}



module.exports = { CreateMovie, getAllMovie, getMovieById, updateMovieById, deleteMoviebyId, aggregateMoie };
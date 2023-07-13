const express = require('express');
const { default: mongoose } = require('mongoose');
const cors = require("cors");
const routes = require('./Routes/Routes');
const user = require('./Routes/User');
const Admin = require('./Routes/Admin');
const path = require('path')


const PORT = 7000;

const app = express();

app.use(cors())

app.use(express.json())

app.use('/', routes)
app.use('/', user)
app.use('/', Admin)
app.use('/Uploads', express.static(path.join(__dirname, '/Uploads')))

const URI = "mongodb+srv://kumghatokhala:kumghatokhala@cluster0.y5n88nm.mongodb.net/"

mongoose.connect(URI).then(() => {
    app.listen(PORT, () => {
        console.log(`Connected at port ${PORT}`)
    })

}).catch((error) => {
    console.log(error)
})

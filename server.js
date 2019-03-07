var express = require("express")
var cors = require("cors")
var bodyParser = require("body-parser")
var app = express()
var mongoose = require("mongoose")
var port = process.env.PORT || 5000

app.use(bodyParser.json())
app.use(cors())
app.use(
    bodyParser.urlencoded({
        extended: false
    })
)

const mongoURI = 'mongodb://localhost:27017/mernloginreg'

mongoose
    .connect(mongoURI, { useNewUrlParser: true })
    .then(() => console.log("MongoDB connected"))
    .catch(err => console.log(err))

var Users = require('./routes/Users')
var Teachers = require('./routes/Teachers')
var Courses = require('./routes/Courses')
app.use('/users', Users)
app.use('/teachers', Teachers)
app.use('/courses', Courses)

// serve statuc assets
if( process.env.NODE_ENV ==="production" ) {
    // set static folder
    app.use( express.static('client/build'))

    app.get( '*', (req, res) => {
        res.sendFile( path.resolve( __dirname, 'client', 'build', 'index.html' ));
    })
}

app.listen(port, () => {
    console.log("Server is running on port: " + port)
})
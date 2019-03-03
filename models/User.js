const mongoose = require("mongoose")
const Schema = mongoose.Schema

const UserSchema = new Schema({
    accountType: {
        type: String, 
    },
    courses: {
        type: Array
    },
    registrator: {
        type:String
    },
    registratorType: {
        type: String,

    },
    students: {
        type: Array
    },
    parents: {
        type: Array
    },
    teachers: {
        type: Array
    },
    username: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = User = mongoose.model('users', UserSchema)
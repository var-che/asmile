const mongoose = require("mongoose")
const Schema = mongoose.Schema

const TeacherSchema = new Schema({
    accountType: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    courses: {
      type: Array,
      required: false
    },
    students: {
      type: Array,
      required: false
    },
    date: {
        type: Date,
        default: Date.now
    }
})

module.exports = Teacher = mongoose.model('teachers', TeacherSchema)
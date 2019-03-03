const mongoose = require("mongoose")
const Schema = mongoose.Schema

const CourseSchema = new Schema({
    name: {
        type: Object,
        required: true
    }
})

module.exports = Course = mongoose.model('courses', CourseSchema)
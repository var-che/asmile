const express = require("express")
const teachers = express.Router()
const cors = require("cors")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const Teacher = require("../models/Teacher")
teachers.use(cors())

process.env.SECRET_KEY = 'secret'

teachers.post('/register', (req, res) => {
  const today = new Date()
  const TeacherData = {
    accountType: 'teacher',
    username: req.body.username,
    email: req.body.email,
    password: req.body.password,
    created: today
  }
  
  Teacher.findOne({
      email: req.body.email
    })
    .then(teacher => {
      
      if (!teacher) {
        bcrypt.hash(req.body.password, 10, (err, hash) => {
          TeacherData.password = hash
          Teacher.create(TeacherData)
            .then( teacher => {
              
              res.json({
                status: teacher.email + ' registered!'
              })
            })
            .catch(err => {
              res.send('error: ' + err)
            })
        })
      } else {
        res.json({
          error: 'Teacher already exists'
        })
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})

teachers.post('/login', (req, res) => {
  Teacher.findOne({
      email: req.body.email
    })
    .then(Teacher => {
      if (Teacher) {
        if (bcrypt.compareSync(req.body.password, Teacher.password)) {
          const payload = {
            _id: Teacher._id,
            username: Teacher.username,
            email: Teacher.email,
            accountType: Teacher.accountType,
            students: Teacher.students
          }
          let token = jwt.sign(payload, process.env.SECRET_KEY, {
            expiresIn: 1440
          })
          res.send(payload)
        } else {
          res.json({
            error: "Teacher does not exist"
          })
        }
      } else {
        res.json({
          error: "Teacher does not exist"
        })
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})

teachers.get('/profile', (req, res) => {
  var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)

  Teacher.findOne({
      _id: decoded._id
    })
    .then(Teacher => {
      if (Teacher) {
        res.json(Teacher)
      } else {
        res.send("Teacher does not exist")
      }
    })
    .catch(err => {
      res.send('error: ' + err)
    })
})

module.exports = teachers
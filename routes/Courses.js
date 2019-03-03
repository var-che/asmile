const express = require("express")
const courses = express.Router()
const cors = require("cors")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const Course = require("../models/Course")
const User = require("../models/User")
// const {teacherCreatesStudent} = require("./UsersUTIL")

courses.use(cors())

process.env.SECRET_KEY = 'secret'


courses.post('/create', (req, res) => {
  const today = new Date()

  const courseData = {
    name: req.body.name,
    date: today
  }
  
  Course.findOne({
    name: req.body.name
  })
  .then( course => {
    if( !course ) {
      Course.create( courseData )
      .then( course => {
        res.json({
          error: "",
          message: "Course created.."
        })
      })
      
    }else {
      res.json({
        error: "There is already a course"
      })
    }				
  })
	
})

courses.post('/session', (req, res) => {
  // stopped, running
  let user = {
    username: req.body.username,
    courseName: req.body.courseName,
    affection: JSON.parse(req.body.affection),
    status: 'running'
  }

  async function createSession() {
    let sessionTemplate = {
      active: true,
      affection: [],
      URL : "URLMARK"
    }
    await User.updateOne({username : user.username , "courses.name":user.courseName} , 
    {$push: {"courses.$.data": sessionTemplate}})
    .then( result => {
      res.json({
        error: "",
        message: "First Session pushed.",
        data: user
      })
    })
  }
  async function updateSession() {
    const { active, affection, URL } = user.affection
    
    await User.updateOne({
      "username" : user.username,
      "courses.data.active" : true
    },  
    { $set: { "courses.$[t].data.$[].URL": URL },
      $set: { "courses.$[t].data.$[e].active": active }, 
      $push: { "courses.$[t].data.$[e].affection" : affection } 
    },
    { arrayFilters: [ { "t.name": user.courseName }, { "e.active" : true } ] } )
    .then( result => {
      if( result ) {
        res.json({
          status: true,
          message: `${user.courseName} updated.`,
        })
      } else {
        res.json({
          status: false,
          message: `${user.courseName} had trouble updating.`,
        })
      }
      
    })
  }
  User.findOne({username : user.username , "courses.name":user.courseName} , function(e, user2){
    
    user2.courses.forEach((element, i) => {
      
      if( element.name === user.courseName ) {
        if ( element.data.length < 1 /**|| element.data[element.data.length -1].status === false **/ ) {
          
          console.log( 'You should create new session' )
          createSession()
        }
        else if( element.data[element.data.length -1].active === true ){
          console.log( 'Updating the session' )
          updateSession()
          
        } else if(element.data[element.data.length -1].active === false){
          console.log('other one.')
          createSession()
        } else {
          console.log( 'End of the line.', element.data[element.data.length -1] )
          // updateSession()
        }
      }
    });
    
  } )

})

courses.post('/assign', (req, res) => {
  const today = new Date()
  console.log(req.body)
  const courseData = {
    username: req.body.username,
    courseName: req.body.courseName,
    assignersName: req.body.assigner,
  }
  
  const course = {
    name: courseData.courseName,
    data: []
  }
  User.findOne({
    username: req.body.username
  })
  .then( user => {
    if( user.accountType === 'student' ) {
      User.updateOne({
        username: courseData.username
      }, { $push: { courses: course } })
      .then( () => {
        res.json({
          status: true,
          message: "Student update with a new course."
        })
      })
    } else if( user.accountType === 'teacher' ) {
      User.updateOne({
        username: courseData.username
      }, { $push: { courses:  req.body.courseName} })
      .then( () => {
        res.json({
          status: true,
          message: "Teacher update with a new course."
        })
      })
    }
    else {
      res.json({
        status: false,
        message: "No user found on updating the courses page."
      })
    }				
  })
	
})
module.exports = courses
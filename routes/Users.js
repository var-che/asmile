const express = require("express")
const users = express.Router()
const cors = require("cors")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt")

const User = require("../models/User")
const Course = require("../models/Course")
// const {teacherCreatesStudent} = require("./UsersUTIL")

users.use(cors())

process.env.SECRET_KEY = 'secret'

users.post('/register', (req, res) => {
	const today = new Date()
	const userData = {
		accountType: req.body.accountType,
		registrator: req.body.registrator,
		registratorType: req.body.registratorType,
		username: req.body.username,
		email: req.body.email,
		password: req.body.password,
		created: today
	}

	function teacherCreatesStudent(userData) {

		console.log( userData )
		// Update student
		User.updateOne({
			username: userData.username
		}, { $push: { teachers: userData.registrator } })
		.then( student => {
			console.log( 'Updated student')
			updateTeacher()
		})
		// Update teacher 
		function updateTeacher() {
			User.updateOne({
				username: userData.registrator
			}, { $push: { students: userData.username } })
			.then( teacher => {
				console.log( 'Updated teacher')
			})
		}
	}
	User.findOne({
			email: req.body.email
		})
		.then(user => {
			if (!user) {
				bcrypt.hash(req.body.password, 10, (err, hash) => {
					userData.password = hash
					User.create(userData)
						.then(user => {
							res.json({
								status: true,
								message: user.email + ' registered!'
							})
							if(user.registratorType === 'teacher') {
								teacherCreatesStudent(user)
								
							}
						})
						.catch(err => {
							res.json({
								status: false,
								message: 'error: ' + err
							})
						})
				})
			} else {
				res.json({
					error: 'User already exists'
				})
			}
		})
		.catch(err => {
			res.send('error: ' + err)
		})
})

users.post('/login', (req, res) => {
	User.findOne({
			email: req.body.email
		})
		.then(user => {
			if (user) {
				if (bcrypt.compareSync(req.body.password, user.password)) {
					const payload = {
						_id: user._id,
						user: user,
						
					}
					let token = jwt.sign(payload, process.env.SECRET_KEY, {
						expiresIn: 1440
					})
					res.send(token)
				} else {
					res.json({
						error: "User does not exist"
					})
				}
			} else {
				res.json({
					error: "User does not exist"
				})
			}
		})
		.catch(err => {
			res.send('error: ' + err)
		})
})

users.post('/profile', (req, res) => {
	// var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY)
	console.log('r',req.body)
	User.findOne({
			username: req.body.username
		})
		.then(user => {
			
			if (user) {
				res.json(user)
			} else {
				res.send("User does not exist")
			}
		})
		.catch(err => {
			res.send('error: ' + err)
		})
})

module.exports = users
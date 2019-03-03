module.exports =  function teacherCreatesStudent(userData) {

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
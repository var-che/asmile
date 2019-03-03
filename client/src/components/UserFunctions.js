import axios from 'axios'

export const register = newUser => {
    return axios
        .post('users/register', {
            first_name: newUser.first_name,
            last_name: newUser.last_name,
            email: newUser.email,
            password: newUser.password,
        })
        .then(res => {
            console.log('Registered!')
        })
}

export const login = user => {
    return axios
        .post('users/login', {
            email: user.email,
            password: user.password
        })
        .then(res => {
            localStorage.setItem('usertoken', res.data)
            return res.data
        })
        .catch(err => {
            console.log(err)
        })
}
export const get_profile = username => {
    
    return axios
        .post('http://localhost:5000/users/profile', {
            username : username,
        })
        .then(res => {
            
            return res.data
        })
        .catch(err => {
            console.log(err)
        })
}
export const register_user = newUser => {
    return axios
        .post('users/register', {
            username: newUser.username,
            email: newUser.email,
            password: newUser.password,
            accountType: newUser.accountType,
            registrator: newUser.registrator,
            registratorType: newUser.registratorType
        })
        .then(res => {
            return res.data
        })
}
export const attach_course = newCourse => {
    return axios
        .post('http://localhost:5000/courses/assign', {
            username: newCourse.username,
            courseName: newCourse.courseName,
            assignersName: newCourse.assignersName,
        })
        .then(res => {
            return res.data
        })
}

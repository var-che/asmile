import React, { Component } from 'react'
import jwt_decode from 'jwt-decode'
import Students from './sections/Students'
import { get_profile } from './UserFunctions'
import  { Redirect } from 'react-router-dom'

class Profile extends Component {
    constructor() {
        super()
        this.state = {
            username: '',
            accountType: null
        }
    } 

    componentDidMount () {
        const token = localStorage.usertoken
        const decoded = jwt_decode(token)
        console.log( decoded.user.username )
        get_profile(decoded.user.username).then(res => {
          if (res) {
            // return <Redirect to='/profile'  />
              
          }
        })
    }

    render () {
        return (
            <div className="container">
              <ul className="nav nav-tabs" id="myTab" role="tablist">
                <li className="nav-item">
                  <a className="nav-link active" id="student-tab" data-toggle="tab" href="#student" role="tab" aria-controls="student" aria-selected="true">Students</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" id="profile-tab" data-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="false">Profile</a>
                </li>
                <li className="nav-item">
                  <a className="nav-link" id="contact-tab" data-toggle="tab" href="#contact" role="tab" aria-controls="contact" aria-selected="false">Contact</a>
                </li>
              </ul>
              <div className="tab-content" id="myTabContent">
                <div className="tab-pane fade show active" id="student" role="tabpanel" aria-labelledby="student-tab">
                  <Students />
                </div>
                <div className="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">...</div>
                <div className="tab-pane fade" id="contact" role="tabpanel" aria-labelledby="contact-tab">...</div>
              </div>
            </div>
        )
    }
}



export default Profile
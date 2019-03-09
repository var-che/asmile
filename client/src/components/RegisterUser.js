import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import React , { Component } from 'react'
import jwt_decode from 'jwt-decode'

import {Typography, TextField, Grid, Button, Dialog, DialogTitle,DialogContent, DialogContentText } from '@material-ui/core'
import { register_user } from './UserFunctions'

const styles = theme => ({
  container: {
    width: '400px'
  },
  
});

class RegisterUser extends Component {
  state = {
    username: '',
    email: '',
    password: '',
    me: null,
    popup: false,
    popupMessage: ''
  }
  componentDidMount() {
    const token = localStorage.usertoken
    const decoded = jwt_decode(token)
    
    this.setState({
      me: decoded.user
    })
  }
  handleChange = name => event => {
    this.setState({ [name]: event.target.value });
  };
  submitUser = () => event => {
    let newUser = {
      username: this.state.username,
      email: this.state.email,
      password: this.state.password,
      registrator: this.state.me.username,
      registratorType: 'teacher',
      accountType: 'student'
    }
    
    register_user( newUser ).then( res => {
      this.setState({
        popupMessage : res,
        popup: true
      }, () => {
        if (res.status) {
          setTimeout(()=>{
            window.location.reload();
          }, 2500)
        }
      })
    })
  };
  handleClose = () => {
    this.setState({ popup: false });
  };
  render() {
    const { classes } = this.props;

    return (
      <div  >
        <Dialog
          open={this.state.popup}
          onClose={this.handleClose}
        >
          <DialogTitle id="alert-dialog-title">
            {(this.state.popupMessage.status)? 'User registered' : 'User did not registered'}
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              {this.state.popupMessage.message}
            </DialogContentText>
          </DialogContent>
        </Dialog>
        <Grid
          container
          direction="column"
          justify="space-between"
          alignItems="stretch"
        >
          < Grid item>
            <Typography component="div" style={{ padding: 8 * 3 }}>
              Register the user
            </Typography>
          </Grid>
          <Grid item >
            <TextField
              fullWidth
              id="standard-name"
              label="username"
              value={this.state.name}
              onChange={this.handleChange('username')}
              margin="normal"
            />
          </Grid>
          <Grid item >
            <TextField
              fullWidth
              id="standard-name"
              label="email"
              value={this.state.email}
              onChange={this.handleChange('email')}
              margin="normal"
            />
          </Grid>
          <Grid item >
            <TextField
              fullWidth
              type="password"
              id="standard-name"
              label="password"
              value={this.state.password}
              onChange={this.handleChange('password')}
              margin="normal"
            />
          </Grid>
          <Button onClick={this.submitUser()}  fullWidth variant="contained" color="primary" >
              Submit
          </Button>
        </Grid>
        
      </div>
    )
  }
}

export default withStyles(styles)(RegisterUser);
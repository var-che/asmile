import classNames from 'classnames';
import { withStyles } from '@material-ui/core/styles';
import React , { Component } from 'react'
import jwt_decode from 'jwt-decode'
import { get_profile, attach_course } from '../UserFunctions'
import PersonPinIcon from '@material-ui/icons/PersonPin';
import CloseIcon from '@material-ui/icons/Close';

import {Snackbar, IconButton,  FormControl, InputLabel, Select, MenuItem, CircularProgress, AppBar, Tab, Tabs, Typography, TextField, Grid, Button, Dialog, DialogTitle,DialogContent, DialogContentText } from '@material-ui/core'
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
} from 'recharts';

// CSS
import '../css/RecButton.css'

function CourseGraph(props) {
  
  return (
    <Grid
    style={{ margin: 20 }}
    container
    direction="row"
    justify="center"
    alignItems="center">
      <Grid item  >
        {props.course.active ? <div className="Rec" > </div> : null}
        <Typography variant="caption" gutterBottom align="center">
          Session is: {props.course.active ? 'LIVE' : 'OVER'}
        </Typography> 
        <Typography variant="caption" gutterBottom align="center">
          {`URL: ${props.course.URL}` }
        </Typography>
        
      </Grid>
      <Grid item  >
        
        <LineChart
          width={500}
          height={150}
          data={props.course.affection}
          
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="point" stroke="#8884d8" activeDot={{ r: 8 }} />
        </LineChart>
      </Grid>
      <Grid item>
         
      </Grid>
    </Grid>
  );
}

class CourseContainer2 extends Component {
  state = {
    user: null,
    course: null,
    course_result: null
  }
  filter_courses( courses ) {
    
    courses.forEach( course => {
      if( course.name === this.state.course) {
        this.setState({
          course_result: course
        }, ()=> {console.log(this.state.course_result)})
      }
    })
  }
  componentDidMount() {
    this.setState({
      user: this.props.user,
      course: this.props.course,
      
    }, () => {
      this.setState({
        course_result: this.filter_courses( this.props.user.courses )
      })
    })
    this.courses_initial = setInterval( function () {
      
    	get_profile(this.state.user.username).then( res => {
        
        this.filter_courses( res.courses )
      }).catch(err => {
        console.log( err )
      })

    }.bind(this), 2000);
  }
  componentWillUnmount () {
    clearInterval(this.courses_initial);
    this.courses_initial = false;
  }

  render() {
    
    return(
      <div>
        
        {(this.state.course_result) ? 
          
          <div>
            {this.state.course_result.data.reverse().map( (course, i) => {
              return (
                <div>
                  <CourseGraph key={i} course={course} />
                  
                </div>
              )
            })}
          </div>
          : 
          <Grid
            style={{ margin: 20 }}
            container
            direction="row"
            justify="center"
            alignItems="center">

            <CircularProgress  />

          </Grid>
          }
      </div>
    )
  }
}

const styles = theme => ({
  root: {
    flexGrow: 1,
    width: '100%',
    backgroundColor: theme.palette.background.paper,
  },
})
class SelectedUser extends Component {
  state = {
    user: null,
    value: 0,
    teacher: null
  }
  componentWillMount() {
    this.setState({ user: this.props.user, teacher : this.props.teacher })
  }
  componentWillReceiveProps(nextProps) {
    // You don't have to do this check first, but it can help prevent an unneeded render
    if (nextProps.user !== this.state.user) {
      this.setState({ user: nextProps.user });
    }
  }
  concatCourses = () => {
    let res = []
    this.state.user.courses.forEach( course => {
      res.push( course.name )
    })
    return 'courses available: ' + res.join()
  }
  tabChange = (event, value) => {
    this.setState({ value });
  };
  render() {
    const { classes } = this.props;
    const { value } = this.state;

    return (
      <div  >
        <Grid
          
          container
          direction="column"
          justify="center"
          alignItems="flex-start"
        >
          <Grid item >
            <Typography component="div" style={{ padding: 8 * 3 }}>
              {`Username: ${this.state.user.username}`}
            </Typography>
            
          </Grid>
          <div className={classes.root}>
          <Grid item >
          
        <AppBar position="static" color="default">
          <Tabs
            value={value}
            onChange={this.tabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="Modify" icon={<PersonPinIcon />} />
            {this.state.user.courses.map( course => {
              
              return <Tab key={course.name} label={course.name} />
            })}
            
          </Tabs>
        </AppBar>
          { value === 0 && <EditCourseContainer user={this.state.user}  teacher={this.state.teacher}></EditCourseContainer>}

          {this.state.user.courses.map( (course, i) => {
                
            return value === i+1 && <CourseContainer2 user={this.state.user} course={course.name} key={i}></CourseContainer2>
          })}
              
          </Grid>
          </div>
        </Grid>
        
      </div>
    )
  }
}
class EditCourseContainer extends Component {
  state = {
    selected_course: '',
    name: 'hai',
    labelWidth: 0,
    courses: [],
    notification: false,
    notification_message: {}
  };
  componentDidMount() {
    // a method to difference the items in the lists
    Array.prototype.diff = function(a) {
      return this.filter(function(i) {return a.indexOf(i) < 0;});
    };
    // difference between two courses lists
    let teacher = this.props.teacher
    let user = this.props.user
    let user_courses_new = user.courses.map( course => {
      return course.name
    })
    
    let diff = teacher.courses.diff( user_courses_new )
    // save to the state
    this.setState({
      courses: diff
    })
  }
  handleChange = event => {
    this.setState({ [event.target.name]: event.target.value });
  };
  attachCourseToStudent(){
    let attach_course_e = {
      username: this.props.user.username,
      courseName: this.state.selected_course,
      assignersName: this.props.teacher.username
    }
    
    attach_course( attach_course_e ).then( res => {
      // save response message in state
      this.setState({
        notification_message: res,
        notification: true
      }, () => {
        // If we succesfully addedd the course, reload page
        if( res.status ) {
          setTimeout(()=>{
            window.location.reload();
          }, 4000)
        }
        
      })
      
    })
  }
  render() {
    const { courses } = this.state
    return(
      <div>
        
        <Grid
          container
          direction="column"
          justify="space-between"
          alignItems="center"
        >
        <Grid item>
            <Typography component="div" style={{ padding: 8 * 3 }}>
              Select a course to attach to a user
            </Typography>
          </Grid>
          <Grid 
            item
          >
            <FormControl style={{ minWidth: 420 }}>
              <InputLabel htmlFor="selected_course-simple">Attach course to user</InputLabel>
              <Select
                value={this.state.selected_course}
                onChange={this.handleChange}
                inputProps={{
                  name: 'selected_course',
                  id: 'selected_course-simple',
                }}
              >
                <MenuItem value="">
                  <em>None</em>
                </MenuItem>
                { courses.map( course => {
                  return <MenuItem key={course} value={course}>{course}</MenuItem>
                })}

              </Select>
              <Button onClick={ () => {this.attachCourseToStudent()} } style={{margin: "10px 0 10px 0"}} fullWidth variant="contained" color="primary" >
                add course
              </Button>
            </FormControl>
          </Grid>
          <Grid item>
            
          </Grid>
        </Grid>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={this.state.notification}
          autoHideDuration={5000}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">{`${this.state.notification_message.message} Please wait a moment.`}</span>}
          
        />
      </div>
    )
  }
  
}
export default withStyles(styles)(SelectedUser);
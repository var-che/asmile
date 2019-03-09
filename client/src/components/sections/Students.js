import React, {
  Component
} from 'react'
import jwt_decode from 'jwt-decode'
import {Typography,Grid, Paper, Button, List, ListItem, ListItemText, ListItemSecondaryAction} from '@material-ui/core'
// import {DeleteIcon, IconButton} from '@material-ui/icons/';
import RegisterUser from '../RegisterUser'
import SelectedUser from './SelectedUser'
import { get_profile } from '../UserFunctions'

class Students extends Component {
  constructor() {
    super()
    this.state = {
      students: [],
      selected: null,
      teacher: null
    }
  }

  componentDidMount() {
    const token = localStorage.usertoken
    const decoded = jwt_decode(token)

    get_profile(decoded.user.username).then(res => {
      if (res) {
        // save teacher 
        this.setState({
          teacher: res
        })
        // extract each student and append it into the list
        let students = res.students
        students.forEach(student => {
          get_profile( student ).then( res => {
            this.setState({
              students: [...this.state.students, res]
            })
          })
        });
      }
    })
  }
  handleListItemClick = (event, index) => {
    this.setState({ selected: index });
  };

  render() {
    return ( 
      <div className = "" >

        <div className="row">
          <div className="col-sm-4">
          <List dense={true}>
            <Button onClick={event => this.handleListItemClick(event, 'register')} fullWidth variant="contained" color="primary" >
              create new student
            </Button>
            {this.state.students.map( (element, i) => {
              return(
                <ListItem onClick={event => this.handleListItemClick(event, element)} button key={i}>
                    <ListItemText
                      primary={`Username: ${element.username}`}
                      secondary={`Account type: ${element.accountType}`}
                    />
                    <ListItemSecondaryAction>
                      {/* <IconButton aria-label="Delete">
                        <DeleteIcon />
                      </IconButton> */}
                    </ListItemSecondaryAction>
                  </ListItem>
              )
            })}
          </List>
          </div>
          <div className="col-sm-8">
            <Paper>
{this.state.selected === 'register' ? <RegisterUser /> : (!this.state.selected) ? <SelectAction /> : <SelectedUser teacher={this.state.teacher} user={this.state.selected} />}

            </Paper>
            
          </div>
        </div>
      </div>
    )
  }
}
class SelectAction extends Component {

  render(){
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
              Select activity on the left panel
            </Typography>
          </Grid>
        </Grid>
      </div>
    )
  }
}
export default Students
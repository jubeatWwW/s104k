import React, { PropTypes } from 'react';
import FontIcon from 'material-ui/FontIcon';
import Avatar from 'material-ui/Avatar';
import {blue500, red500, greenA200} from 'material-ui/styles/colors';
import Divider from 'material-ui/Divider';
import {List, ListItem} from 'material-ui/List';
import Paper from 'material-ui/Paper';

class UserView extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { profile } = this.props;
    return (
      <div style={{textAlign: "center"}}>
        <Avatar size={150} style={{marginTop: '50px'}}V>T</Avatar>
        <Paper style={{width: "80%", marginTop: '50px', 
            position: 'relative', left: '50%', transform: 'translate(-50%)'}}>
            <ListItem primaryText={`account: ${profile.account}`} />
            <Divider />
            <ListItem primaryText={`name: ${profile.name}`} />
            <Divider />
            <ListItem primaryText={`identity: ${profile.identity}`} />
            <Divider />
            <ListItem primaryText={`score: ${profile.score}`} />
        </Paper>
      </div>
    );
  }
}

export default UserView;

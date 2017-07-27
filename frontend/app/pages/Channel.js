import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import { push } from 'react-router-redux';

import Paper from 'material-ui/Paper';
import {List, ListItem} from 'material-ui/List';
import ActionInfo from 'material-ui/svg-icons/action/info';

import ChatRoom from '../components/ChatRoom';

class Channel extends React.Component {
  static contextTypes = {
    store: PropTypes.object.isRequired
  };
  constructor(props) {
    super(props);
  }
  render() {
    const { store } = this.context;
    return (
      <Paper style={{display: 'flex', position: 'relative'}}>
        <List style={{width: 300, minHeight: '100%', borderRight: '1px solid #ccc'}}>
          <ListItem
            primaryText="OO資訊科技"
            secondaryText="軟體工程師"
            innerDivStyle={{backgroundColor: 'rgba(128,128,128,.1)'}}
            rightIcon={<Link to='/job/3/edit'><ActionInfo /></Link>}
            onTouchTap={() => {store.dispatch(push('/channel/1'))}}
            />
          <ListItem
            primaryText="XX資訊科技"
            secondaryText="專案管理"
            rightIcon={<Link to='/job/4/edit'><ActionInfo /></Link>}
            onTouchTap={() => {store.dispatch(push('/channel/2'))}}
            />
          <ListItem
            primaryText="7-11"
            secondaryText="工讀生"
            rightIcon={<Link to='/job/5/edit'><ActionInfo /></Link>}
            onTouchTap={() => {store.dispatch(push('/channel/3'))}}
            />
          <ListItem
            primaryText="OX餐廳"
            secondaryText="特級廚師"
            rightIcon={<Link to='/job/6/edit'><ActionInfo /></Link>}
            onTouchTap={() => {store.dispatch(push('/channel/4'))}}
            />
        </List>
        <div style={{flex: 1}}>
          <ChatRoom room={this.props.params.cid} />
        </div>
      </Paper>
    );
  }
}

export default Channel;

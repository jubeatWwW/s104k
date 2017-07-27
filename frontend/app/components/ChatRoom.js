import React, { PropTypes } from 'react';
import socket from 'socket.io-client';

import Avatar from 'material-ui/Avatar';
import FlatButton from 'material-ui/FlatButton';
import TextField from 'material-ui/TextField';
import {List, ListItem} from 'material-ui/List';
import { darkBlack } from 'material-ui/styles/colors';

class ChatMessages extends React.Component {
  constructor(props) {
    super(props);
  }
  shouldComponentUpdate(nextProps, nextState) {
    const messages1 = this.props.messages;
    const messages2 = nextProps.messages;
    if (messages1.length != messages2.length) return true;
    for(let i in messages1) {
      if (messages1[i].time != messages2[i].time)
        return true;
    }
    return false;
  }
  render() {
    const { messages, ...props } = this.props;
    return (
      <List {...props}>
        { messages.map(({account, message, time}, idx) => (
          <ListItem
            id={idx}
            leftAvatar={<Avatar size={30}>{account[0]}</Avatar>}
            primaryText={message}
            secondaryText={
              <p>
                {`${account} 於 ${time}`}
              </p>
            }
            secondaryTextLines={2}
          />
        )) }
      </List>
    );
  }
}

class ChatInput extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { props: {onSubmit, value, ...props} } = this;
    return (
      <div style={{ display: 'flex' }}>
        <TextField fullWidth={true} value={value} hintText="留言..." {...props} />
        <FlatButton disabled={!value} label="送出" primary={true} onTouchTap={onSubmit} />
      </div>
    );
  }
}

class ChatRoom extends React.Component {
  static contextTypes = {
    user: PropTypes.object
  };
  constructor(props) {
    super(props);
    this.state = { messages: [] };
    this.onTextChange = this.onTextChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);

    const io = socket('http://s104k.nctu.me:8787');
    this.io = io;
    const { room } = props;
    io.on('connect', () => {
      const { user } = this.context;
      io.emit('join room', { room, account: user.name });
    });
    io.on('load msg', (data) => {
      this.setState({ messages: data });
    });
    io.on('broadcast msg', (data) => {
      this.setState({ messages: [...this.state.messages, data] });
    });
  }
  componentWillUpdate(nextProps, nextState) {
    if (this.props.room!=nextProps.room) {
      const { user } = this.context;
      this.io.emit('leave room', { room: this.props.room });
      this.io.emit('join room', { room: nextProps.room, account: user.name });
    }
  }
  componentWillUnmount() {
    this.io.emit('leave room', { room: this.props.room });
  }
  onTextChange(e) {
    this.setState({ text: e.target.value });
  }
  onSubmit(e) {
    const { user } = this.context;
    this.io.emit('send msg', {
      room: this.props.room,
      account: user.name,
      message: this.state.text
    });
    this.setState({ text: "" });
  }

  render() {
    const { cid } = this.props;
    return (
      <div>
        <ChatMessages
          ref="msgs"
          messages={this.state.messages}
          style={{
            height: 'calc(100vh - 48px - 64px - 16px)',
            overflow: 'auto',
            boxShadow: '-3px -6px 10px rgba(0, 0, 0, .4) inset',
          }} />
        <ChatInput value={this.state.text} onChange={this.onTextChange} onSubmit={this.onSubmit} />
      </div>
    );
  }
}

export default ChatRoom;

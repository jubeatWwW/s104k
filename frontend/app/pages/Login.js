import React, { PropTypes } from 'react';
import { push } from 'react-router-redux';

import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';

import LoginForm from '../components/LoginForm';

class Login extends React.Component {
  constructor(props, context) {
    super(props);
    this.onLogin = this.onLogin.bind(this);
  }
  onLogin() {
    this.context.store.dispatch(push('/channel/1'));
  }
  render() {
    const { props } = this;
    return (
      <div
        style={{
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
        }}
      >
        <LoginForm onLogin={this.onLogin} />
      </div>
    );
  }
}

Login.contextTypes = {
  store: PropTypes.object.isRequired
};

export default Login;

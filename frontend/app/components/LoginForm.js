import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import update from 'react-addons-update';

import { Avatar, TextField, FlatButton, RaisedButton } from 'material-ui';

import { sendAjax } from '../actions/api';

class LoginForm extends React.Component {
  constructor(props) {
    super(props);
    this.login = this.login.bind(this);
    this.loadProfile = this.loadProfile.bind(this);
    this.state = {
      inputData: { },
      errorText: { }
    };
  }
  _checkEmpty(key, e, onFulfilled, onRejected) {
    let errorText2 = {}, inputData2 = {};

    if( e ) {
      inputData2[key] = e.target.value;
      inputData2 = update(this.state.inputData, {$merge: inputData2});
    } else {
      inputData2 = this.state.inputData;
    }

    errorText2[key] = inputData2[key] ? '' : '不可為空白',
    errorText2 = update(this.state.errorText, {$merge: errorText2});

    this.setState({
      errorText: errorText2,
      inputData: inputData2,
      noEmptyInput: !!inputData2.username && !!inputData2.password
    }, () => {
      if( this.state.noEmptyInput ) {
        if (typeof onFulfilled === 'function') {
          onFulfilled();
        }
      } else {
        if (typeof onRejected === 'function') {
          onRejected();
        }
      }
    });
  }
  login() {
    let check = (field) =>
      new Promise((resolve, reject) => {
        this._checkEmpty(field, null, resolve, reject);
      })
    ;
    let { onLogin } = this.props;
    const { store } = this.context;
    check('username')
      .then(() => check('password'), () => check('password'))
      .then(() => {
        let data = {
          account: this.state.inputData.username,
          password: this.state.inputData.password
        };
        store.dispatch(sendAjax({
          method: 'post',
          path: '/login',
          body: data,
          sendingType: 'LOGIN',
        })).then(({body}) => {
          store.dispatch({
            type: 'LOGIN_SUCCEED',
            response: body
          });
          this.loadProfile(body.token, onLogin);
        }).catch(error => {
          store.dispatch({
            type: 'LOGIN_FAILED',
            response: error
          });
        });
      }, () => {
      })
      ;
  }
  loadProfile(token, cb) {
    const { store } =  this.context;
    store.dispatch(sendAjax({
      method: 'get',
      path: '/user',
      withToken: true,
      sendingType: 'GET_USER'
    })).then(({body}) => {
      store.dispatch({
        type: 'GET_USER_SUCCEED',
        response: body
      });
      if (!!cb) cb();
    }).catch(error => {
    });
  }
  render() {
    const styles = {
      width: 400
    };
    return (
      <div style={{
        display: 'flex',
        flexDirection: 'column'
      }}
      >
        <Avatar size={70} style={{alignSelf: 'center'}}>L</Avatar>
        <TextField
          floatingLabelText="Username"
          style={styles}
          errorText={this.state.errorText.username||""}
          onChange={this._checkEmpty.bind(this, 'username')}
        />
        <TextField
          floatingLabelText="Password"
          type="password"
          style={styles}
          errorText={this.state.errorText.password||""}
          onChange={this._checkEmpty.bind(this, 'password')}
        />
        <div style={{marginTop: 24, textAlign: 'center'}}>
          <FlatButton label="Login" primary={true} onTouchTap={this.login} />
          <Link to='/register'><RaisedButton label="Register" primary={true} /></Link>
        </div>
      </div>
    );
  }
}

LoginForm.contextTypes = {
  store: PropTypes.object.isRequired
};

export default LoginForm;

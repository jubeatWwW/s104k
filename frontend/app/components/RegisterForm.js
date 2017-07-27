import React, { PropTypes } from 'react';
import update from 'react-addons-update';
import { Link } from 'react-router';
import { push } from 'react-router-redux';

import { Avatar, TextField, FlatButton, RaisedButton } from 'material-ui';
import { RadioButton, RadioButtonGroup } from 'material-ui/RadioButton';

import { sendAjax } from '../actions/api';

class RegisterForm extends React.Component {
  static contextTypes = {
    store: PropTypes.object.isRequired
  };
  constructor(props) {
    super(props);
    this.login = this.login.bind(this);
    this.state = {
      inputData: { },
      errorText: { }
    };
  }
  _checkEmpty(key, e, onFulfilled, onRejected) {
    console.log(key);
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
    const { store } = this.context;
    check('username')
      .then(() => check('password'))
      .then(() => check('name'))
      .then(() => check('identity'))
      .then(() => {
        let data = {
          account: this.state.inputData.username,
          password: this.state.inputData.password,
          name: this.state.inputData.name,
          identity: this.state.inputData.identity
        };
        store.dispatch(sendAjax({
          method: 'post',
          path: '/register',
          body: data,
          sendingType: 'REGISTER',
        })).then(({body}) => {
          console.log("~");
          store.dispatch({
            type: 'REGISTER_SUCCEED',
            response: body
          });
          store.dispatch(push('/login'));
        }).catch(error => {
          store.dispatch({
            type: 'REGISTER_FAILED',
            response: error
          });
        });
      }, () => {
      })
      ;
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
        <Avatar size={70} style={{alignSelf: 'center'}}>R</Avatar>
        <RadioButtonGroup
          name="identity"
          style={{ display: 'flex', marginTop: 20 }}
          onChange={this._checkEmpty.bind(this, 'identity')}
          >
          <RadioButton
            value="employee"
            label="找工作"
            style={{ flex: 1 }}
          />
          <RadioButton
            value="employer"
            label="找員工"
            style={{ flex: 1 }}
          />
        </RadioButtonGroup>
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
        <TextField
          floatingLabelText="Name"
          style={styles}
          errorText={this.state.errorText.name||""}
          onChange={this._checkEmpty.bind(this, 'name')}
        />
        <div style={{marginTop: 24, textAlign: 'center'}}>
          <RaisedButton label="Register" primary={true} onTouchTap={this.login} />
          <Link to='/login'><FlatButton label="Login" primary={true} /></Link>
        </div>
      </div>
    );
  }
}

export default RegisterForm;


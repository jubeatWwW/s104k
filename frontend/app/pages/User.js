import React, { PropTypes } from 'react';

import Paper from 'material-ui/Paper';

import UserView from '../components/UserView';

import { sendAjax } from '../actions/api';

class User extends React.Component {
  static contextTypes = {
    profile: PropTypes.object,
    store: PropTypes.object.isRequired
  };

  constructor(props, context) {
    super(props, context);

    const { store } = context;
    const { uid } = props.params;
    store.dispatch(sendAjax({
      method: 'get',
      path: `/user/${uid}`,
      withToken: true,
      sendingType: 'GET_PROFILE'
    })).then(({body}) => {
      store.dispatch({
        type: 'GET_PROFILE_SUCCEED',
        response: body
      });
    }).catch(error => {
    });
  }
  render() {
    const { profile } = this.context;
    return (
      <UserView profile={profile} />
    );
  }
}

export default User;

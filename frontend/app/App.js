/* libraries */
import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import prefix from 'superagent-prefix';
import { push } from 'react-router-redux';

/* material-ui */
import { AppBar } from 'material-ui';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import { orange600, grey600 } from 'material-ui/styles/colors';

/* custom components */
import * as config from './config';

import { sendAjax } from './actions/api';
import * as actions from './actions';

const muiTheme = getMuiTheme({
  palette: {
    primary1Color: orange600,
    accent1Color: grey600
  },
});

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.login = this.login.bind(this);
    this.postLogin = this.postLogin.bind(this);
  }
  getChildContext() {
    const { props: { token, user, profile, job }, login, postLogin } = this;
    return {
      token,
      user,
      profile,
      job,
      login,
      postLogin,
      config,
      server: prefix(config.SERVER_HOST),
    };
  }
  login() {
    const { store } = this.context;
    store.dispatch(push('/login'));
  }
  postLogin() {
    const { store } = this.context;
    store.dispatch(push('/'));
  }
  render() {
    return (
      <MuiThemeProvider muiTheme={muiTheme}>
        <div style={{width: '100vw', height: '100vh', position: 'absolute'}}>
          <AppBar
            style={{ position: 'fixed', top: 0 }}
            showMenuIconButton={false}
            title="S104k - 人力銀行"
            iconElementRight={this.props.appbarElementRight}
          />
          <div
            style={{
              position: 'absolute',
              top: 64,
              height: 'calc(100% - 64px)',
              width: '100%',
              overflow: 'auto'
            }}
          >
            {this.props.children}
          </div>
        </div>
      </MuiThemeProvider>
    );
  }
}

App.contextTypes = {
  router: PropTypes.object.isRequired,
  store: PropTypes.object.isRequired
};

App.childContextTypes = {
  login: PropTypes.func.isRequired,
  postLogin: PropTypes.func.isRequired,
  config: PropTypes.object,
  token: PropTypes.string,
  user: PropTypes.object,
  profile: PropTypes.object,
  job: PropTypes.object,
  server: PropTypes.func.isRequired,
};

const mapStateToProps = (state, props) => ({
  token: state.auth.token,
  user: state.user.data,
  profile: state.profile.data,
  job: state.job,
});

const mapDispatchToProps = dispatch => ({
});

export default connect(mapStateToProps, mapDispatchToProps)(App);

import React, { PropTypes } from 'react';
import { Link } from 'react-router';
import update from 'react-addons-update';
import { push } from 'react-router-redux';
import {
  Checkbox,
  RaisedButton,
  Divider,
  Dialog,
  FlatButton,
  Paper,
  List, ListItem,
  SelectField,
  MenuItem,
  TextField
} from 'material-ui';
import Toggle from 'material-ui/Toggle';
import IconButton from 'material-ui/IconButton';
import EditIcon from 'material-ui/svg-icons/editor/mode-edit';
import { grey100, grey700 } from 'material-ui/styles/colors';
import deepEqual from 'deep-equal';

import { sendAjax } from '../actions/api';

const formDataKeys = ['name', 'description', 'request', 'occupation', 'location'];

const errorMessage = {
  cantBeEmpty: "不可為空白"
};

const strings = {
  job: {
    name: '標題',
    description: '描述',
    request: 'request',
    occupation: 'occupation',
    location: '地點',
  }
};

const editorStyle = {
  maxWidth: 600,
  margin: 'auto'
};

const viewerStyle = {
  maxWidth: 600,
  margin: 'auto'
}

class JobEdit extends React.Component {
  constructor(props, context) {
    super(props);
    this.state = { formData: {tag: []}, errorText: {}, modified: false };

    this.handleTextChange = this.handleTextChange.bind(this);
    this.submit = this.submit.bind(this);

    this.textInputProps = {
      onChange: this.handleTextChange,
      underlineShow: false,
      style: {
        width: 'calc(100% - 140px)',
        marginLeft: 20,
      },
    };
  }
  validate(keys, onSuccess, onFailure) {
    const { formData } = this.state;
    let errorText = {};
    if (!Array.isArray(keys)) {
      this.validate([keys]);
      return;
    }
    let failure = false;
    keys.forEach(key => {
      switch(key) {
        case 'student_name':
          errorText[key] = !!formData[key] ? "" : errorMessage.cantBeEmpty;
          failure = failure || !!errorText[key];
      }
    });
    errorText = update(this.state.errorText, {$merge: errorText});
    this.setState({ errorText }, failure ? onFailure : onSuccess);
  }
  submit() {
    const { store, dispatch, job } = this.context;
    let data = {...job.data, ...this.state.formData};
    this.setState({ formData: data, modified: true }, () => {
      this.validate(formDataKeys, () => {
        const formData = {...this.state.formData};
        store.dispatch(sendAjax({
          method: 'post',
          path: '/jobs',
          withToken: true,
          body: formData,
          sendingType: 'SEND_JOB',
        })).then((data) => {
          store.dispatch({
            type: 'GET_JOB_SUCCEED',
            response: data
          });
          console.log(data);
          //store.dispatch(push('/user/myinfo'));
        }).catch(error => {
          store.dispatch({
            type: 'GET_JOB_ERROR',
            response: error
          });
        });
      })
    });
  }
  handleTextChange(e) {
    const { name: key, value } = e.target;
    let formData = this.state.formData;
    if (!this.state.modified) {
      formData = update(this.state.formData, {$merge: this.context.job.data});
    }
    formData = {...formData, [key]: value};
    this.setState({ formData, modified: true }, () => this.validate(key));
  }
  shouldComponentUpdate(nextProps, nextState, nextContext) {
    const { formData, errorText } = this.state;
    const { formData: formData2, errorText: errorText2 } = nextState;
    return !deepEqual(formData, formData2)
        || !deepEqual(errorText, errorText2)
        || this.context.job.sending != nextContext.job.sending;
  }
  render() {
    const { job } = this.context;
    let { formData, errorText, modified } = this.state;
    let ret;
    if (!modified) {
      formData = job.data;
    }
    const textFields = formDataKeys
      .map(key => {
        const props = {
          ...this.textInputProps,
          key,
          value: formData[key],
          errorText: errorText[key],
          name: key,
          floatingLabelText: strings.job[key],
          hintText: strings.job[key]
        };
        switch (key) {
          case 'detail':
            ret = <TextField {...props} multiLine={true} rows={2} />;
            break;
          default:
            ret = <TextField {...props} />;
        }
        return (
          <div key={`row-${key}`} style={{position: 'relative', display: 'flex', alignItems: 'center'}}>
            {ret}
          </div>
        );
      })
      .reduce((prev, curr, index) => (
        !!prev ? [...prev, <Divider key={`divider-${index}`} />, curr] : [curr]
      ), null);
    return (
      <Paper className={this.props.className} style={{...editorStyle, ...this.props.style}} loading={job.sending}>
        <div>
          { textFields }
          <Divider />
          <div style={{ textAlign: 'center', padding: '20px 0' }}>
            <RaisedButton disabled={job.sending} secondary={true} label="儲存" onTouchTap={this.submit} />
          </div>
        </div>
      </Paper>
    );
  }
}

JobEdit.contextTypes = {
  store: PropTypes.object.isRequired,
  job: PropTypes.object,
};

export default JobEdit;

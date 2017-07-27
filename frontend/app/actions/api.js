import request from 'superagent';
import prefix from 'superagent-prefix';

import { SERVER_HOST } from '../config';

const server = prefix(SERVER_HOST);

export const sendAjax = ({withToken = false, ...options}) => (dispatch, getState) => {
  const { method, path, query = {}, body = {}, sendingType } = options;

  dispatch({ type: sendingType });

  let req = request[method](path)
    .use(server)
    .query(query);

  if (withToken) {
    let token = getState().auth.token;
    req.set('Authorization', `Bearer ${token}`);
  }

  req = req.send(body).set('Content-Type', 'application/json');

  return req;
};

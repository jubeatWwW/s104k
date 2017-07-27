const initialState = { data: {} };
const userReducer = (state = initialState, action) => {
  switch(action.type) {
    case 'GET_USER':
      return state;
    case 'GET_USER_SUCCEED':
      return {
        sending: false,
        data: action.response,
        error: null,
      };
    case 'GET_USER_FAILED':
      return {
        sending: false,
        data: {},
        error: action.response,
      };
    default:
      return state;
  }
};

export default userReducer;


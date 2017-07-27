const initialState = { data: {} };
const profileReducer = (state = initialState, action) => {
  switch(action.type) {
    case 'GET_PROFILE':
      return state;
    case 'GET_PROFILE_SUCCEED':
      return {
        sending: false,
        data: action.response,
        error: null,
      };
    case 'GET_PROFILE_FAILED':
      return {
        sending: false,
        data: {},
        error: action.response,
      };
    default:
      return state;
  }
};

export default profileReducer;


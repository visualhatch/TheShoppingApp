import { AUTHENTICATE, LOGOUT } from "../actions/auth";

const inititalState = {
    token: null,
    userId: null
};

export default (state = inititalState, action) => {
  switch (action.type) {
      case AUTHENTICATE:
          return {
              token: action.token,
              userId: action.userId
          };
      case LOGOUT:
          return {
              inititalState
          };

      // case SIGNUP:
      //     return {
      //         token: action.token,
      //         userId: action.userId
      //     };

      default:
          return state;
  }
};
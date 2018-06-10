import update from 'immutability-helper';

import { ActionTypes } from '../actions/userAction';

const initialState = {
  displayName: '',
  isLogin: false,
};

// may move to user
export function authenticatingWithFirebase(state = true, action = {}) {
  switch (action.type) {
    case ActionTypes.USER_DATA:
      return false;
    case ActionTypes.LOGIN_SUCCESS:
      // this Action means users tried to login FB and succeeded,
      // show loading... (authenticating: true)
      // then auth+data callback should be triggerd later (authenticating: false)
      return true;
    default:
      return state;
  }
}

export function users(state = {}, action = {}) {
  switch (action.type) {
    case ActionTypes.OWNER_DATA: {
      const newState = update(state, {
        [action.payload.userID]: { $set: action.payload.userInfo },
      });

      return newState;
    }
    default:
      return state;
  }
}

export function currentUser(state = initialState, action = {}) {
  switch (action.type) {
    case ActionTypes.USER_DATA:
      return {
        ...state,
        isLogin: action.payload.result,
        ...action.payload.userData,
      };

    // case ActionTypes.LOGIN_SUCCESS:
    //   return {
    //     ...state,
    //     isLogin: true,
    //   };
    case ActionTypes.LOGOUT:
      return initialState;
    default:
      return state;
  }
}

export function registerStatus(state = '', action) {
  switch (action.type) {
    case ActionTypes.INVALID_REGISTERID:
      return 'invalid KID';
    case ActionTypes.EXISTING_REGISTERID:
      return 'used KID';
    case ActionTypes.LOGOUT:
      return '';
    default:
      return state;
  }
}

export const userRoot = {
  users, currentUser, authenticatingWithFirebase, registerStatus,
};

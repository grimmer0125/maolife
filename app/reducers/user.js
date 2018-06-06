
import { ActionTypes } from '../actions/userAction';
import { combineReducers } from 'redux';

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
      return 'existing KID';
    case ActionTypes.LOGOUT:
      return '';
    default:
      return state;
  }
}

export const userRoot = {
  currentUser, authenticatingWithFirebase, registerStatus,
};

import update from 'immutability-helper';

import { ActionTypes } from '../actions/userActions';
import { ActionTypes as PetActionTypes } from '../actions/petActions';

const initialState = {
  email: '',
  displayName: '',
  isLoggedInWithData: false,
};

export function authenticatingWithFirebase(state = true, action = {}) {
  switch (action.type) {
    case ActionTypes.USER_DATA:
      return false;
    case ActionTypes.START_SIGNIN:
      // this Action means users tried to login FB and succeeded,
      // show loading... (authenticating: true)
      // then auth+data callback should be triggerd later (authenticating: false)
      return true;
    case ActionTypes.LOGIN_FAIL:
      // this Action means users tried to login FB and succeeded,
      // show loading... (authenticating: true)
      // then auth+data callback should be triggerd later (authenticating: false)
      return false;
    default:
      return state;
  }
}

export function users(state = {}, action = {}) {
  switch (action.type) {
    case PetActionTypes.OWNER_DATA: {
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
        isLoggedInWithData: action.payload.result,
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


import { ActionTypes } from '../actions/userAction';
import { combineReducers } from 'redux';

const initialState = {
  KID: null,
  displayName: 'bb8',
  isLogin: false,
};

// may move to user
export function userChecking(state = true, action = {}) {
  switch (action.type) {
    case ActionTypes.USER_DATA:
      return false;
    default:
      return state;
  }
}

// KID
export function registerStatus(state = '', action) {
  switch (action.type) {
    case ActionTypes.INVALID_REGISTERID:
      return 'invalid id';
    case ActionTypes.EXISTING_REGISTERID:
      return 'existing id';
    case ActionTypes.LOGOUT:
      return '';
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
    case ActionTypes.LOGIN_SUCCESS:
      // console.log("reducer user1:", action.payload.displayName);
      return {
        ...state,
        isLogin: true,
        // displayName: action.payload.displayName //就算成功第二次也不會show name,
        // use 1. set/update to firebase 2. get user_data value change (the below action)
      };
    case ActionTypes.LOGOUT:
      // console.log("got logout action in reducer")
      return initialState;
    default:
      return state;
  }
}

export function selectedCat(state = null, action) {
  switch (action.type) {
    case ActionTypes.NAVI_TO_CAT:
      return { id: action.payload.catID };
    default:
      return state;
  }
}

// export default combineReducers({
//   user,
//   userChecking
// });

export const userRoot = {
  currentUser, userChecking, registerStatus,
};

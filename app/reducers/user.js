
import { ActionTypes } from '../actions/userAction';
import { combineReducers } from 'redux';

const initialState = {
  maoID: null,
  displayName: "bb8",
};


export function userChecking(state = true, action ={}) {
    // return false;
  switch (action.type) {
    case ActionTypes.LOGIN_DATA:
      return false;
    default:
      return state;
    }
}

export function user(state = null, action = {}) {
  switch (action.type) {
    case ActionTypes.LOGIN_DATA:
      return {
        ...state,
        isLogin:action.payload.result,
        maoID: action.payload.maoID,
      };
    case ActionTypes.LOGIN_SUCCESS:
      console.log("reducer user1:", action.payload.displayName);
      return {
        ...state,
        isLogin:true,
        displayName: action.payload.displayName //就算成功第二次也不會show name
      };
    default:
      return state;
    }
}
// export default combineReducers({
//   user,
//   userChecking
// });

export const userRoot = {
  user, userChecking,
}

// export default userRoot;

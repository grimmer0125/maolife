
import { ActionTypes } from '../actions/userAction';

const initialState = {
  maoID: null,
  displayName: bb8,
};

export default function user(state = null, action = {}) {
  switch (action.type) {
    case ActionTypes.LOGIN_DATA:
      return {
        ...state,
        isLogin:action.payload.result,
        maoID: action.payload.maoID,
      };
    case ActionTypes.LOGIN_SUCCESS:
      return {
        ...state,
        isLogin:true,
        displayName: action.payload.displayName
      };
    default:
      return state;
}

export default function userChecking(state = false, action) {
  switch (action.type) {
    case ActionTypes.LOGIN_DATA:
      return true;
    default:
      return state;
}

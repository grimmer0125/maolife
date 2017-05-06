import { ActionTypes } from '../actions/userAction';
import { combineReducers } from 'redux';

// CAT

export function cats(state = {}, action) {
  // const catID = action.payload.catID;
  console.log("in cats reducers");
  switch (action.type) {
    case ActionTypes.UPDATE_CAT_INFO:
      //insertOrUpdate action.payload.cat
      if(action.payload.catID) {
        // return Object.assign({}, state, {
        //   visibilityFilter: action.filter
        // })
        let newState = {...state};
        newState[action.payload.catID] = action.payload.catInfo;
        return newState;
      } else {
        return state;
      }
    default:
      return state;
  }
}

export const catsRoot = {
  cats,
}

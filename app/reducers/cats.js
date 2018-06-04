import { ActionTypes } from '../actions/userAction';
import { combineReducers } from 'redux';
import _ from 'lodash';

export function cats(state = {}, action) {
  switch (action.type) {
    case ActionTypes.REMOVE_CAT:
      if (action.payload.catID) {
        const newState = _.cloneDeep(state);
        delete newState[action.payload.catID];
        return newState;
      }
      return state;
    case ActionTypes.UPDATE_CAT_INFO:
      if (action.payload.catID) {
        const newState = _.cloneDeep(state);
        newState[action.payload.catID] = action.payload.catInfo;

        return newState;
      }
      return state;
    default:
      return state;
  }
}

// http://redux.js.org/docs/faq/Reducers.html#reducers-share-state
// export function selectedCat(state = null, action) {
//   switch (action.type) {
//     case ActionTypes.NAVI_TO_CAT:
//       console.log("grimmer reducer, navi to cat");
//       return {id: action.payload.catID};
//     // case "Navigation/NAVIGATE":
//     //   if (action.routeName == "List") {
//     //     console.log("grimmer reducer, navi to cat back");
//     //     return null;
//     //   }
//     //   break;
//     default:
//       return state;
//   }
// }

export const catsRoot = {
  cats,
};

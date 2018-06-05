import { ActionTypes } from '../actions/userAction';
import { combineReducers } from 'redux';
import _ from 'lodash';

export function pets(state = {}, action) {
  switch (action.type) {
    case ActionTypes.REMOVE_CAT:
      if (action.payload.petID) {
        const newState = _.cloneDeep(state);
        delete newState[action.payload.petID];
        return newState;
      }
      return state;
    case ActionTypes.UPDATE_CAT_INFO:
      if (action.payload.petID) {
        const newState = _.cloneDeep(state);
        newState[action.payload.petID] = action.payload.petInfo;

        return newState;
      }
      return state;
    default:
      return state;
  }
}

// http://redux.js.org/docs/faq/Reducers.html#reducers-share-state
// export function selectedPet(state = null, action) {
//   switch (action.type) {
//     case ActionTypes.NAVI_TO_CAT:
//       console.log("grimmer reducer, navi to pet");
//       return {id: action.payload.petID};
//     // case "Navigation/NAVIGATE":
//     //   if (action.routeName == "List") {
//     //     console.log("grimmer reducer, navi to pet back");
//     //     return null;
//     //   }
//     //   break;
//     default:
//       return state;
//   }
// }

export const petsRoot = {
  pets,
};

import { ActionTypes } from '../actions/userAction';
import { combineReducers } from 'redux';
import _ from 'lodash';

// array way, now we use dict/object for cats
// function updateCats(oldState, action){
//   let newState = _.cloneDeep(oldState);
//   let match = false;
//   for (let cat of newState) {
//     if (cat.catID == action.payload.catID) {
//       cat.catInfo = action.payload.catInfo;
//       match = true;
//       break;
//     }
//   }
//
//   if (!match) {
//     newState.push({catID:action.payload.catID, ...action.payload.catInfo});
//   }
//
//   return newState;
// }

export function cats(state = {}, action) {
  switch (action.type) {
    case ActionTypes.UPDATE_CAT_INFO:
      if (action.payload.catID) {
        // return Object.assign({}, state, {
        //   visibilityFilter: action.filter
        // })
        // assgin:one level shallow copy, so can not use

        let newState = _.cloneDeep(state);
        newState[action.payload.catID] = action.payload.catInfo;

        return newState;//updateCats(state, action);
      } else {
        return state;
      }
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
}

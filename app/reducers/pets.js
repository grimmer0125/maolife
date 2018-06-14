import update from 'immutability-helper';

import { ActionTypes } from '../actions/userAction';

export function pets(state = {}, action) {
  switch (action.type) {
    case ActionTypes.LOGOUT:
      return {};
    case ActionTypes.UPDATE_PET:
      if (action.payload.petID) {
        const newState = update(state, {
          $unset: [action.payload.petID],
        });
        return newState;
      }
      return state;
    case ActionTypes.UPDATE_PET_INFO:
      if (action.payload.petID) {
        const newState = update(state, {
          [action.payload.petID]: { $set: action.payload.petInfo },
        });

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
//     case ActionTypes.NAVI_TO_PET:
//       return {id: action.payload.petID};
//     // case "Navigation/NAVIGATE":
//     //   if (action.routeName == "List") {
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

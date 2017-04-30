import { combineReducers } from 'redux';
//import robot from './robot';

import {userRoot} from './user';

// import { default as cart, getQuantity, getAddedIds } from './cart'


// import someting
// 1. import * as reducers from '../reducers'; combineReducers(reducers);
// 2. import A, then combineReducers({A})
// 3. const rootReducer = combineReducers({ ...devicesReducers,

const rootReducer = combineReducers({
  ...userRoot
});

export default rootReducer;

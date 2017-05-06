import { combineReducers } from 'redux';

import {userRoot} from './user';
import {catsRoot} from './cats';

// import reducers, differnt ways
// 1. import * as reducers from '../reducers'; combineReducers(reducers);
// 2. import A, then combineReducers({A})
// 3. const rootReducer = combineReducers({ ...devicesReducers,
// 4. import { default as cart, getQuantity, getAddedIds } from './cart'


const rootReducer = combineReducers({
  ...userRoot,
  ...catsRoot
});

export default rootReducer;

import { combineReducers } from 'redux';
import robot from './robot';
// import someting
// 1. import * as reducers from '../reducers'; combineReducers(reducers);
// 2. import A, then combineReducers({A})
// 3. const rootReducer = combineReducers({ ...devicesReducers,

const rootReducer = combineReducers({
  robot
});

export default rootReducer;

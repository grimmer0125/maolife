import { combineReducers } from 'redux';

import { userRoot } from './user';
import { catsRoot } from './cats';

import { ListPage } from '../ListPage';

// import reducers, differnt ways
// 1. import * as reducers from '../reducers'; combineReducers(reducers);
// 2. import A, then combineReducers({A})
// 3. const rootReducer = combineReducers({ ...devicesReducers,
// 4. import { default as cart, getQuantity, getAddedIds } from './cart'

// redux + react navigation 1
//   login: () => dispatch(NavigationActions.navigate({ routeName: 'Login' })),
// https://reactnavigation.org/docs/navigators/navigation-actions
// this.props.dispatch or this.props.navigation.dispatch

// redux + react navigation 2, 看起來是有連動的. 不是只有存資料在redux, reducer也會改變那一頁
// https://github.com/react-community/react-navigation/blob/master/examples/ReduxExample/src/reducers/index.js

// const initialNavState = {
//   index: 1,
//   routes: [
//     { key: 'InitA', routeName: 'Main' },
//     { key: 'InitB', routeName: 'Login' },
//   ],
// };
//
//

const initialState = ListPage.router.getStateForAction(ListPage.router.getActionForPathAndParams('List'));
const listNav = (state = initialState, action) => {
  console.log('nav action:', action);
  let nextState;
  switch (action.type) {
    // 也可以外面發一般的action, 這裡再轉
    // case 'Login':
    //   nextState = AppNavigator.router.getStateForAction(NavigationActions.back(), state);
    //   break;
    // case 'Logout':
    //   nextState = AppNavigator.router.getStateForAction(NavigationActions.navigate({ routeName: 'Login' }), state);
    //   break;
    default:
      nextState = ListPage.router.getStateForAction(action, state);
      break;
  }

  // Simply return the original `state` if `nextState` is null or undefined.
  return nextState || state;
};

const rootReducer = combineReducers({
  listNav,
  ...userRoot,
  ...catsRoot,
});

export default rootReducer;

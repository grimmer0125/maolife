import { combineReducers } from 'redux';

import { userRoot } from './user';
import { catsRoot } from './cats';
import { ListPage } from '../ListPage';

// redux + react navigation 1
// https://reactnavigation.org/docs/navigators/navigation-actions
//   login: () => dispatch(NavigationActions.navigate({ routeName: 'Login' })),
//   this.props.dispatch or this.props.navigation.dispatch

// redux + react navigation 2, dispatch action will trigger navigation
// https://github.com/react-community/react-navigation/blob/master/examples/ReduxExample/src/reducers/index.js
// this example does not use react-navigation-redux-helpers which is mentioned in react-navigation's
// redux integration section
const initialState = ListPage.router.getStateForAction(ListPage.router.getActionForPathAndParams('List'));
const listNav = (state = initialState, action) => {
  console.log('nav action:', action);
  let nextState;
  switch (action.type) {
    // we can trigger navigation here !!! example:
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

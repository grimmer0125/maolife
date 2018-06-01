
import { Platform } from 'react-native';
import devTools from 'remote-redux-devtools';

import { createStore, applyMiddleware, compose } from 'redux';
// import createSagaMiddleware from 'redux-saga';
import thunk from 'redux-thunk';


import rootReducer from '../reducers';

// import rootSaga from '../sagas';
//
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function configureStore(initialState) {
  // const sagaMiddleware = createSagaMiddleware();

  const middleware = applyMiddleware(thunk);

  const enhancer = composeEnhancers(
    middleware,
  );

  //TODO change to use if (__DEV__) {  later

  const store = createStore(
    rootReducer,
    initialState,
    enhancer
    // compose(
    //   // applyMiddleware(sagaMiddleware, thunk)
    //   applyMiddleware(thunk),
    //   devTools({
    //     name: Platform.OS,
    //     hostname: 'localhost',
    //     port: 8000
    //   })
    //   // ,window.devToolsExtension ? window.devToolsExtension() : f => f
    // )
  );

  // sagaMiddleware.run(rootSaga);

  return store;
}

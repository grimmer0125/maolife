import { createStore, applyMiddleware, compose } from 'redux';
// import createSagaMiddleware from 'redux-saga';
import thunk from 'redux-thunk';


import rootReducer from '../reducers';

// import rootSaga from '../sagas';

export default function configureStore(initialState) {
  // const sagaMiddleware = createSagaMiddleware();

  //TODO change to use if (__DEV__) {  later

  const store = createStore(
    rootReducer,
    initialState,
    compose(
      // applyMiddleware(sagaMiddleware, thunk)
      applyMiddleware(thunk)
      // ,window.devToolsExtension ? window.devToolsExtension() : f => f
    )
  );

  // sagaMiddleware.run(rootSaga);

  return store;
}

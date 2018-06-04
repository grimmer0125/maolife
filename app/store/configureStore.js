import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from '../reducers';

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

export default function configureStore(initialState) {
  const middleware = applyMiddleware(thunk);

  const enhancer = composeEnhancers(middleware);

  const store = createStore(
    rootReducer,
    initialState,
    enhancer,
  );

  return store;
}

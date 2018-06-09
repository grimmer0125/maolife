import React from 'react';

import { Provider } from 'react-redux';
import configureStore from './store/configureStore';

import Home from './Home';

const store = configureStore();

export default () => (
  <Provider store={store}>
    <Home />
  </Provider>
);

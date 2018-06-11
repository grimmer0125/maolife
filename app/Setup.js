import React from 'react';

import { Provider } from 'react-redux';
import configureStore from './store/configureStore';

import App from './App';

const store = configureStore();

// NOTE: nativebase's StyleProvider can be applied here
const Setup = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

export default Setup;

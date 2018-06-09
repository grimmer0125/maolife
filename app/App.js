import React from 'react';

import { Provider } from 'react-redux';
import configureStore from './store/configureStore';

import Home from './Home';

const store = configureStore();

const App = () => (
  <Provider store={store}>
    <Home />
  </Provider>
);

export default App;

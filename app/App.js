

import React, { Component } from 'react';

import { Provider } from 'react-redux';
import configureStore from './store/configureStore.js';

import Home from './Home';

const store = configureStore();

// can not directly use redux-store on App itself, should provide root compoent, now it is Home
export default class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Home />
      </Provider>
    );
  }
}

// export default App;
// AppRegistry.registerComponent('maolife', () => HelloFacebook);

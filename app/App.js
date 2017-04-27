
'use strict';

import React, { Component } from 'react';

import { createStore } from 'redux'
import { Provider } from 'react-redux';
import { connect } from 'react-redux';

import reducer from './reducers'

import Home from './Home'
// const reducer = combineReducers(reducers);
// const store = createStoreWithMiddleware(reducer);

const store = createStore(reducer)

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

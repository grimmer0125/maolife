import React from 'react';

import { Provider } from 'react-redux';
import { StyleProvider } from 'native-base';
import * as firebase from 'firebase';

import configureStore from './store/configureStore';

import App from './App';
import getTheme from '../native-base-theme/components';
import variables from '../native-base-theme/variables/commonColor';
import firebaseConfig from '../firebaseConfig';
// import material from '../native-base-theme/variables/material';

const store = configureStore();

console.log('start init firebase');

firebase.initializeApp(firebaseConfig);

const Setup = () => (
  <Provider store={store}>
    <StyleProvider style={getTheme(variables)}>
      <App />
    </StyleProvider>
  </Provider>
);

export default Setup;

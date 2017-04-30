/* @flow */

// 1. login in FB
// 2. At least people need to register a unique ID for sharing cats.

// Tab:
// 1. List
// 2. Wall
// 3. Record

// Ref:
// https://github.com/facebook/react-native-fbsdk/blob/master/sample/HelloFacebook/index.ios.js
// For Testing FB login
'use strict';

const FBSDK = require('react-native-fbsdk');

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
const {
  LoginButton,
  // AccessToken,
} = FBSDK;

// import { createStore } from 'redux'
// import { Provider } from 'react-redux';
import { connect } from 'react-redux';

import { handleFBLogin } from './actions/userAction';


// import reducer from './reducers'
// const reducer = combineReducers(reducers);
// const store = createStoreWithMiddleware(reducer);
// const store = createStore(reducer)

// import * as firebase from 'firebase';
// import firebaseConfig from '../firebaseConfig';
// const firebaseApp = firebase.initializeApp(firebaseConfig);

//https://github.com/SolidStateGroup/react-native-firebase-auth/blob/master/index.js
// firebase.auth().onAuthStateChanged((user)=> {
//   console.log("got user:", user);
// });

// let test1 = firebaseApp.database().ref().child('items');
// console.log("test1:", test1);

// 這樣寫login後不會得到, 但下次launch 就得到, 且不會明顯的login process+facebookToFirebase
// 可能firebase那邊有token cache跟我這裡送給firebase的比對, 又加上login button下次就變logout
// 所以fb sdk api, firebase api 可能都有偷偷存token
// test1.on('value', (snap) => {
//
//     const t2 = snap.val();
//     console.log("t2:", t2);
//
// });




class Login extends Component {
  constructor(props) {
    super(props);

    // const shareLinkContent = {
    //   contentType: 'link',
    //   contentUrl: 'https://www.facebook.com/',
    // };
    //
    // this.state = {
    //   shareLinkContent: shareLinkContent,
    // };

    this.handleFBLoginResult = this.handleFBLoginResult.bind(this);
  }

  handleFBLoginResult(error, result) {

    this.props.dispatch(handleFBLogi(error, result));
  }

//EAAEfFlGaTZBUBAKYMHyPZCZBKBsAqetF3ML6ZAMUMyk1VZAY9…H1FPHeyiqr1NmI2sy9eGKQIe3G8vF86CRWpyKHlvGQbD42RnY
  render() {
    // const name = this.props.name;
    const {user} = this.props;

    return (
        <View style={styles.container}>
          <Text style={styles.welcome}>
            {user.displayName}
          </Text>
          <LoginButton
            onLoginFinished={this.handleFBLoginResult}
          />
          {/* <TouchableHighlight style={styles.share}
            onPress={this.shareLinkWithShareDialog.bind(this)}>
            <Text style={styles.shareText}>Share link with ShareDialog</Text>
          </TouchableHighlight> */}
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  shareText: {
    fontSize: 20,
    margin: 10,
  },
});



const mapStateToProps = (state) => ({
    // devices: getVisibleItems(state.devices.items),
  user: state.user,
});

export default connect(mapStateToProps)(Login);

// export default App;

// AppRegistry.registerComponent('maolife', () => HelloFacebook);

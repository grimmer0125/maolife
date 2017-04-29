// Ref:
// https://github.com/facebook/react-native-fbsdk/blob/master/sample/HelloFacebook/index.ios.js
// For Testing FB login
'use strict';

const FBSDK = require('react-native-fbsdk');

import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  Text,
  TouchableHighlight,
  View,
} from 'react-native';
const {
  LoginButton,
  ShareDialog,
  AccessToken,
} = FBSDK;

import { createStore } from 'redux'
import { Provider } from 'react-redux';
import { connect } from 'react-redux';

import reducer from './reducers'
// const reducer = combineReducers(reducers);
// const store = createStoreWithMiddleware(reducer);

const store = createStore(reducer)

import * as firebase from 'firebase';
import firebaseConfig from '../firebaseConfig';
const firebaseApp = firebase.initializeApp(firebaseConfig);

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

//TODO: 

function facebookToFirebase(token){

  // https://firebase.google.com/docs/auth/web/custom-auth??
    firebase.auth().signInWithCredential(firebase.auth.FacebookAuthProvider.credential(token))
    .then(result=>{
      console.log("grimmer login result:", result);
      console.log("grimmer result property:", result.displayName,";",result.email,";",result.uid  );

      if(result.displayName){
        alert("welcome! " + result.displayName);
      }

      //null, null, KdyxdxZjvhuUFo4VLBm4U1m1iy2
      // but U.displayName: "Teng-Chieh Kang"

      //u or xe/displayName "Teng-Chieh Kang
      //uid:SKdyxdxZjvhuUFo4VLBm4U1m1iy2" ???

      let itmes = firebaseApp.database().ref().child('items');
      console.log("itmes:", itmes);

      // ok了
      itmes.on('value', (snap) => {

          const itmes2 = snap.val();
          console.log("itmes2:", itmes2);

      });

    }).catch(function(error) {
      console.log("grimmer error:", error);
    });

    // https://github.com/fullstackreact/react-native-firestack, ios/android firebase wrapper, not node.js
    //firestack.auth.signInWithProvider('facebook', data.accessToken, '') // facebook will need only access token.
//     .then((user)=>{
//       console.log("Inside ");
//       console.log(user); 
//     })

    //firebase.auth().signInWithCustomToken(token)
}

class Home extends Component {
  constructor(props) {
    super(props);
    const shareLinkContent = {
      contentType: 'link',
      contentUrl: 'https://www.facebook.com/',
    };

    this.state = {
      shareLinkContent: shareLinkContent,
    };
  }

  shareLinkWithShareDialog() {
    var tmp = this;
    ShareDialog.canShow(this.state.shareLinkContent).then(
      function(canShow) {
        if (canShow) {
          return ShareDialog.show(tmp.state.shareLinkContent);
        }
      }
    ).then(
      function(result) {
        if (result.isCancelled) {
          alert('Share cancelled');
        } else {
          alert('Share success with postId: '
            + result.postId);
        }
      },
      function(error) {
        alert('Share fail with error: ' + error);
      }
    );
  }

//EAAEfFlGaTZBUBAKYMHyPZCZBKBsAqetF3ML6ZAMUMyk1VZAY9…H1FPHeyiqr1NmI2sy9eGKQIe3G8vF86CRWpyKHlvGQbD42RnY
  render() {
    const name = this.props.name;
    return (
      <Provider store={store}>
        <View style={styles.container}>
          <Text style={styles.welcome}>
            {name}
          </Text>
          <LoginButton
            onLoginFinished={
              (error, result) => {
                if (error) {
                  alert("login has error: " + result.error);
                } else if (result.isCancelled) {
                  alert("login is cancelled.");
                } else {
                  console.log("grimmer login ok, result:", result);//not much info
                  AccessToken.getCurrentAccessToken().then(
                    (data) => {
                      console.log("grimmer access token data:", data);
                      //userID 10208940635412999"
                      facebookToFirebase(data.accessToken.toString());
                      // alert(data.accessToken.toString());
                    }
                  )
                }
              }
            }
          />
          <TouchableHighlight style={styles.share}
            onPress={this.shareLinkWithShareDialog.bind(this)}>
            <Text style={styles.shareText}>Share link with ShareDialog</Text>
          </TouchableHighlight>
        </View>
      </Provider>
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

const mapStateToProps = (state) => (
  {
    // devices: getVisibleItems(state.devices.items),
    name: state.robot.name,
  }
);

// const App2 =
export default connect(mapStateToProps)(Home);
// export default App;

// AppRegistry.registerComponent('maolife', () => HelloFacebook);

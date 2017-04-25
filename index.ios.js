/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

// import {
//   AppRegistry,
// } from 'react-native';
// import App from './js/App';
//
// AppRegistry.registerComponent('maolife', () => App);

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

import * as firebase from 'firebase';
import firebaseConfig from './firebaseConfig';
const firebaseApp = firebase.initializeApp(firebaseConfig);

//https://github.com/SolidStateGroup/react-native-firebase-auth/blob/master/index.js
// firebase.auth().onAuthStateChanged((user)=> {
//   console.log("got user:", user);
// });

// let test1 = firebaseApp.database().ref().child('items');
// console.log("test1:", test1);
//
// test1.on('value', (snap) => {
//
//     const t2 = snap.val();
//     console.log("t2:", t2);
//
// });

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

class HelloFacebook extends Component {
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
    return (
      <View style={styles.container}>
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
  shareText: {
    fontSize: 20,
    margin: 10,
  },
});

AppRegistry.registerComponent('maolife', () => HelloFacebook);

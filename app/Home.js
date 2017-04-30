import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { connect } from 'react-redux';

import { initLoginChecker } from './actions/userAction';

import Login from 'Login';
import MainScreen from 'MainScreen';


//** test Firebase ** //
// import * as firebase from 'firebase';
// import firebaseConfig from '../firebaseConfig';
// console.log("grimmer test firebase");

// Initialize Firebase
// const firebaseApp = firebase.initializeApp(firebaseConfig);
// // this.itemsRef = firebaseApp.database().ref();
//
// let test1 = firebaseApp.database().ref().child('items');
// console.log("test1:", test1);
//
// test1.on('value', (snap) => {
//
//     const t2 = snap.val();
//     console.log("t2:", t2); //now snap is object {title:grimmer}, not
//
//     // get children as an array
//     let tmp_items = [];
//
// //     snap.forEach((child) => {
// //   items.push({
// //     title: child.val().title,
// //     _key: child.key
// //   });
// // });
//
//     // if snap is array,
//     // snap.forEach((child) => {
//     //     tmp_items.push({title: child.val().title, _key: child.key});
//     // });
//
//     console.log("grimmer data:", tmp_items);
//     // this.setState({dataSource: this.state.dataSource.cloneWithRows(items)});
//
// });

// getRef() {
//   return firebaseApp.database().ref();
// }
//** test Firebase **//





// 0. 看來理論上有token只要檢查有沒有過期就好? <-firebase可能會做
// x fb server應該會手動存fb id, token要手動存嗎??不用, 直接用firebase sdk就好,它內部有自己存firebase id
//
// 1. login page -> 未登入成功 or 登入中
// 2. register page -> token登入成功. 但未有id, 所以db要存(xfb id/token) + maoID
// 檢查有無mao id, 沒有就要到page2, 所以應該會有個indicator中間態
// 3. home, firebase id ok +有maoid,fb/firebase有token, 自己要存嗎?
//
// https://github.com/sitepoint-editors/rn-firebase-auth/blob/master/src/pages/login.js
// 是用存的token 每次都檢查+登入firebase的說.
//
// fb應該是不需要再重新登入, 只是firebase自己的呢?

// const App2 =
// export default connect(mapStateToProps)(MainScreen);

export default class Home extends Component {

  constructor(props) {
     super(props);

     this.props.dispatch(initLoginChecker());
     //bind action
     //map dispatch
     // directly use dispatch
    //  Actually, the rule is: If your initialization depends upon the DOM, use componentDidMount, otherwise use constructor.

  }

  render() {
    const {userChecking, user} = this.props;
    if (userChecking) {
      return (
        <View>
          <Text>
            Loading...
          </Text>
        </View>
      );
    }

    if (user && user.maoID){
      return MainScreen;
    } else {
      return Login;
    }

  }
}


const mapStateToProps = (state) => ({
    // devices: getVisibleItems(state.devices.items),
  user: state.user,
  userChecking: state.userChecking,
});

export default connect(mapStateToProps)(Home);

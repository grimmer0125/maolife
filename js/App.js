// import React, { Component } from 'react';
// import {
//   AppRegistry,
//   StyleSheet,
//   ListView,
//   Alert,
//   Button,
//   Text,
//   View,
//   ScrollView,
// } from 'react-native';
//
// import * as firebase from 'firebase';
// import firebaseConfig from '../firebaseConfig';
//
// console.log("grimmer test firebase");
//
// // Initialize Firebase
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
//
// import {
//   StackNavigator,
//   TabNavigator,
// } from 'react-navigation';
// import Ionicons from 'react-native-vector-icons/Ionicons';
//
// const onButtonPress = () => {
//   Alert.alert('Button has been pressed!');
// };
//
// class MyHomeScreen extends Component {
//
//   // Initialize the hardcoded data
//   constructor(props) {
//     super(props);
//     console.log("grimmer init MyHomeScreen");
//     const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
//     this.state = {
//       dataSource: ds.cloneWithRows([
//         'John', 'Joel', 'James', 'Jimmy', 'Jackson', 'Jillian', 'Julie', 'Devin'
//       ])
//     };
//   }
//
//   getRef() {
//     return firebaseApp.database().ref();
//   }
//
//   render() {
//     return (
//       <View style={{flex: 1, paddingTop: 22}}>
//         <ListView
//           dataSource={this.state.dataSource}
//           renderRow={(rowData) => {
//             return (
//               <View>
//                 <Text>{rowData}</Text>
//                 <Button
//                   onPress={onButtonPress}
//                   title="Press Me"
//                   accessibilityLabel="See an informative alert"
//                 />
//               </View>
//             )
//             }
//           }
//         />
//       </View>
//     );
//   }
// }
//
// class MyNotificationsScreen extends React.Component {
//   // static navigationOptions = {
//   //   tabBarLabel: 'Notifications',
//   //   tabBarIcon: ({ tintColor }) => (
//   //     <Image
//   //       source={require('./notif-icon.png')}
//   //       style={[styles.icon, {tintColor: tintColor}]}
//   //     />
//   //   ),
//   // };
//
//   render() {
//     return (
//       <Button
//         onPress={() => this.props.navigation.goBack()}
//         title="Go back home"
//       />
//     );
//   }
// }
//
// /* <MyNavScreen
//   banner="Settings"
//   navigation={navigation}
// /> */
// const MySettingsScreen = ({ navigation }) => (
//     <ScrollView>
//       <Button
//         onPress={() => navigation.navigate('NotifSettings')}
//         title="Go to notification settings"
//       />
//       <Button
//         onPress={() => navigation.goBack(null)}
//         title="In Setting, Go back"
//       />
//     </ScrollView>
// );
//
// const SettingsTab = StackNavigator({
//   Settings: {
//     screen: MySettingsScreen,
//     // path: '/',
//     // wired, is function, not {}
//     navigationOptions: () => ({
//       title: 'Settings',
//     }),
//   },
//   NotifSettings: {
//     screen: MyNotificationsScreen,
//     navigationOptions: {
//       title: 'Notification Settings',
//     },
//   },
// });
//
//
// const App = TabNavigator({
//   Home: {
//     screen: MyHomeScreen,
//     navigationOptions: {
//       tabBarLabel: 'Home',
//       tabBarIcon: ({ tintColor, focused }) => (
//         <Ionicons
//         name={focused ? 'ios-home' : 'ios-home-outline'}
//         size={26}
//         style={{ color: tintColor }}
//         />
//       ),
//     },
//   },
//   SettingsTab: {
//     screen: SettingsTab,
//     navigationOptions: {
//       tabBarLabel: 'Settings',
//       tabBarIcon: ({ tintColor, focused }) => (
//         <Ionicons
//           name={focused ? 'ios-settings' : 'ios-settings-outline'}
//           size={26}
//           style={{ color: tintColor }}
//         />
//       ),
//     },
//   },
// }, {
//   tabBarOptions: {
//     activeTintColor: '#e91e63',
//   },
//   //   tabBarPosition: 'bottom',
//   //   animationEnabled: false,
//   //   swipeEnabled: false,
// });
//
// export default App;



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

class App extends Component {
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

export default App;

// AppRegistry.registerComponent('maolife', () => HelloFacebook);

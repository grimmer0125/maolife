import { createAction } from 'redux-actions';

const FBSDK = require('react-native-fbsdk');
const {
  AccessToken,
} = FBSDK;

import * as firebase from 'firebase';
import firebaseConfig from '../../firebaseConfig';

const LOGIN_DATA = 'LOGIN_DATA';
const USER_DATA = 'USER_DATA';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_FAIL = 'LOGIN_SUCCESS';
const LOGOUT = 'LOGOUT';

export const ActionTypes = {
  LOGIN_DATA,
  LOGIN_SUCCESS,
  USER_DATA,
  LOGOUT,
};


// may use https://github.com/acdlite/redux-actions
export function fetchUserData(result, userData) {
  return {
    type: USER_DATA,
    payload: {
      result,
      userData,
    }
  };
}

export const LogoutAction = createAction(LOGOUT);

export function LoginSuccess(displayName) {
  return {
    type: LOGIN_SUCCESS,
    payload:{
      displayName,
    }
  };
}

export function handleFBLogout(error, result) {

  return (dispatch) => {
    //https://firebase.google.com/docs/reference/node/firebase.auth.Auth#signOut
    firebase.auth().signOut()
    .then(()=>{
      console.log("firebase logout");
      dispatch(LogoutAction());
    });
  };
}

export function handleFBLogin(error, result) {

  return (dispatch) => {

    if (error) {
      //TODO handle FB login error
      alert("login has error: " + result.error);
    } else if (result.isCancelled) {
      alert("login is cancelled.");
    } else {
      console.log("grimmer login ok, result:", result);//not much info
      AccessToken.getCurrentAccessToken()
      .then(data => {

        console.log("grimmer access token data:", data);
        //userID 10208940635412999"

        const token = data.accessToken.toString();

        // third payty: https://github.com/fullstackreact/react-native-firestack
        // now use official https://firebase.google.com/docs/auth/web/custom-auth
        return firebase.auth().signInWithCredential(
          firebase.auth.FacebookAuthProvider.credential(token))
          // alert(data.accessToken.toString());
      }).then(result=>{
        console.log("grimmer login FB from Firebae result:", result);
        console.log("grimmer result property:", result.displayName,";",result.email,";",result.uid  );

        if(result.displayName){
          console.log("welcome! " + result.displayName);
          // alert("welcome! " + result.displayName);

          const dataPath = "/user/" + result.uid;

          // https://firebase.google.com/docs/reference/js/firebase.database.Reference#update
          // oncomplete: use callback or promise
          firebase.database().ref(dataPath).update({
            displayName: result.displayName
          });

        }

        // but U.displayName: "Teng-Chieh Kang"
        //uid:SKdyxdxZjvhuUFo4VLBm4U1m1iy2" ???

        dispatch(LoginSuccess(result.displayName));
        // 寫入uid/某狀態值v/state.user?,
        // 然後user.uid會影響到這個 input id 可不可以寫or show input txt之類的

      }).catch(function(error) {
        //TODO handle FB + firebase login fail or
        // getCurrentAccessToken fail
        console.log("use fb's token to login firebase error:", error);

      });
    }
  };
}

export function connectDBtoCheckUser() {
  return (dispatch) => {

    console.log("init checker");

    firebase.initializeApp(firebaseConfig);

    // https://github.com/SolidStateGroup/react-native-firebase-auth/blob/master/index.js
    // https://github.com/JamesMarino/Firebase-ReactNative/blob/master/index.ios.js
    firebase.auth().onAuthStateChanged((authUser)=> {
      console.log("got auth user change in DB:", authUser);

      if (authUser) {

        // user.
        const dataPath = "/user/" + authUser.uid;// +"/maoID";

//        let maoID  = firebaseApp.database().ref(dataPath).child('items');
        // let userData  = firebaseApp.database().ref(dataPath);

        // value
        // child_added
        // child_changed
        // child_removed
        // child_moved
        firebase.database().ref(dataPath).on('value', (snap) => {

          console.log("userdata from firebase:", snap);
          const userValue = snap.val();

          console.log("userdata from firebase2:", userValue);

          if (userValue && userValue.maoID) {
            console.log("maoID for:", authUser.uid, ";maoid:", userValue.maoID);
          } else {
            console.log("no maoID for:", authUser.uid);
          }

          dispatch(fetchUserData(true, userValue));
        });

        // let userData = await firebase.auth().currentUser;
        // user.uid
        // let userMobilePath = "/user/" + userId + "/details";

        // login
        // 檢查 database裡的值
        //  a. 已login 但無maoid
        //    b. 已login 有id

      } else {
        // userChecking=false, 直接回到login 第一頁

        dispatch(fetchUserData(false, null));
      }
    });
  };
}

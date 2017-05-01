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
const INVALID_REGISTERID = 'INVALID_REGISTERID';

export const ActionTypes = {
  LOGIN_DATA,
  LOGIN_SUCCESS,
  USER_DATA,
  LOGOUT,
};

export const invalidRegisterIDAction = createAction(INVALID_REGISTERID);

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

export function registerMaoID(registerID) {

  return (dispatch) => {
    console.log("grimmer !!");
    if (!registerID || registerID.indexOf(' ') >= 0) {
      console.log("GG invalid id:", registerID);
      invalidRegisterIDAction();
    } else {
      console.log("GG try registring id:", registerID);

      // const dataPath = "/user/" + result.uid;
      //
      // const usersRef = new Firebase(USERS_LOCATION);
      // usersRef.child(userId).once('value', function(snapshot) {
      //   var exists = (snapshot.val() !== null);
      //   userExistsCallback(userId, exists);
      // });

      const query = firebase.database().ref().child('users').orderByChild("maoID").equalTo(registerID);
      query.once("value", function(snapshot) {
        const userData = snapshot.val();
        if (userData){
          console.log("exists!", registerID);
        } else {
          const dataPath = "/users/" + firebase.auth().currentUser.uid;
          console.log("current user:", dataPath);
          firebase.database().ref(dataPath).update({
            maoID: registerID,
            likeNumber: [1,3,7],
          }).then(()=>{
            console.log("register maoID ok !!!:", registerID);
          });
        }
      });

      // firebase.database().ref(dataPath).update({
      //   displayName: result.displayName
      // });
      //
      // ref.child('users').orderByChild('name').equalTo('Alex').on('child_added',  ...)
      // query.on("value", function(snapshot) {


      // if (snapshot.hasChildren()) {
      //
      //     console
      // .log("Yes the object with the key exists !");
      // var thisVerificationVarisSetToTrueIndicatingThatTheObjectExists = true ;
      //
      //
      // }


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
          console.log("try saving displayName " + result.displayName);
          // alert("welcome! " + result.displayName);

          const dataPath = "/users/" + result.uid;

          // https://firebase.google.com/docs/reference/js/firebase.database.Reference#update
          // oncomplete: use callback or promise
          firebase.database().ref(dataPath).update({
            displayName: result.displayName
          }).then(()=>{
            console.log("register displayName ok",)
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
        const dataPath = "/users/" + authUser.uid;// +"/maoID";

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

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
const EXISTING_REGISTERID = 'EXISTING_REGISTERID';
const UPDATE_CAT_INFO = 'UPDATE_CAT_INFO';

export const ActionTypes = {
  LOGIN_DATA,
  LOGIN_SUCCESS,
  USER_DATA,
  LOGOUT,
  INVALID_REGISTERID,
  EXISTING_REGISTERID,
  UPDATE_CAT_INFO,
};

export const invalidRegisterIDAction = createAction(INVALID_REGISTERID);
export const registerExistingIDAction = createAction(EXISTING_REGISTERID);

export function updateCatInfo(catID, catInfo) {
  return {
    type: UPDATE_CAT_INFO,
    payload: {
      catID,
      catInfo,
    }
  }
}

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
      dispatch(invalidRegisterIDAction());
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
          console.log("exists!!!", registerID);
          dispatch(registerExistingIDAction());
        } else {
          const dataPath = "/users/" + firebase.auth().currentUser.uid;
          console.log("current user:", dataPath);
          firebase.database().ref(dataPath).update({
            maoID: registerID,
            // likeNumber: [1,3,7],
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
            console.log("register displayName ok");
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

export function fetchOwnCats() {
  return (dispatch) => {
    // const dataPath = "/users/" + authUser.uid;// +"/maoID";

    const dataPath = "/users/" + firebase.auth().currentUser.uid;

    firebase.database().ref(dataPath).child("catids").on('value', (snapshot) => {

      //array

    // console.log("grimmer array1:", snapshot);
    //
    //  const data = snapshot.val();
    //  const values = Object.values(data);
    //
    //  for (var i = 0; i < values.length; i++) {
    //    const value = values[i];
    //    console.log("grimmer array2:", value); //hello, kitty
    //   //  firebase.database().ref('groups/' + keys[i]).on(...)
    //  }

      console.log("grimmer get catids");

     //TODO 刪到沒owner時, ui要提示
      snapshot.forEach(function(item) {
        const catID = item.val();

        console.log("grimmer each cat id:", catID);

        // query.once("value", function(snapshot) {

        firebase.database().ref('cats').child(catID).once('value', (snapshot) => {

          const catInfo = snapshot.val();
          //owners: firebase not real array already ->JS realy array
          console.log("grimmer cat info:", catInfo);

          console.log("grimmer cat catid:", catID);

          dispatch(updateCatInfo(catID, catInfo));
          //udpateSingleCatInfo

        });

              //yes, heloo, kitty too, 但應該其實是要改成用unique id, 不是name
              // keys.push(itemVal);
              // 但有可能不同手機上改貓名字, 所以還是要listen 貓的變化 .
              // 這樣不就沒有必要去把catids放在user下, 不不一樣,
              // 一個是listen 特定貓的變化 +撈貓貓的資料. <-還是先用這個好了˙
              // 一個是去找出 那些貓貓的owner有我, 再show其資訊. ->listen這個很奇怪
              //
      });

          // for (i=0; i < keys.length; i++) {
          //     counts.push(keys[i].wordcount);
          // }


    });
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

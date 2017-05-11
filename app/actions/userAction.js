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
const NAVI_TO_CAT = 'NAVI_TO_CAT';
const LEAVE_CAT_DETAIL = `LEAVE_CAT_DETAIL`;

export const ActionTypes = {
  LOGIN_DATA,
  LOGIN_SUCCESS,
  USER_DATA,
  LOGOUT,
  INVALID_REGISTERID,
  EXISTING_REGISTERID,
  UPDATE_CAT_INFO,
  NAVI_TO_CAT,
  LEAVE_CAT_DETAIL,
};

export const invalidRegisterIDAction = createAction(INVALID_REGISTERID);
export const registerExistingIDAction = createAction(EXISTING_REGISTERID);
export const leaveCatDetail = createAction(LEAVE_CAT_DETAIL);

export function addNewOwner(ownerMaoID) {

  return (dispatch, getState) => {

    console.log("start to add owner:", ownerMaoID);

    const state = getState();
    const catID = state.selectedCat.id;

    const dataPath = "cats/" + catID;
    // http://stackoverflow.com/questions/38317248/how-to-chain-multiple-promises-into-a-single-transaction-in-firebase


    // selectedCat.id
    //1. 新增到那隻貓的owners裡
    //2. 新增到那個人的catids裡

    //TODO: 好像也可以從redux裡撈耶 !!!!!!!
    firebase.database().ref(dataPath).child("owners").once('value', (snapshot)=>{

      let data = snapshot.val();
      let owners = Object.values(data);
      owners.push(ownerMaoID);

      firebase.database().ref(dataPath).child("owners").set(owners)
      .then(()=>{
        console.log("add ownerMaoID into owners ok !!!");

        //要maoID -> ownerID !!!

        const query = firebase.database().ref().child('users').orderByChild("maoID").equalTo(ownerMaoID);
        query.once("value", function(snapshot) {
          const userID = snapshot.key;
          if (userID){
            const userPath = "users/" + ownerID;
            firebase.database().ref(userPath).child("catids").once('value', (snapshot)=>{
               let data = snapshot.val();
               let catids = Object.values(data);
               addCatToUserFireBaseData(catids, catID, userPath);
            });
          }
        });


        // });
        //add to that owner's catids

      })

    });


  };
}

function addCatToUserFireBaseData(catids, newCatId, ownerPath) {
  catids.push(newCatId);
  console.log("in new page, catids:", catids)

  firebase.database().ref(ownerPath).child("catids").set(catids).then(()=>{
      console.log("reset catids ok !!!:");
   });
}

export function addNewCat(name, age) {

  return (dispatch, getState) => {

    // As a result, all writes to the database will trigger local events immediately,
    // before any data has even been written to the database.

    //還要加上owner:[selfid]

    const state = getState();
    const sefMaoID = state.user.maoID;

    const newCatRef = firebase.database().ref('cats').push();
    const newCatId = newCatRef.key;
    console.log("newCat:", newCatId)

    // firebase.database().ref('cats').child(catID).on('value', (snapshot) => {
    newCatRef.set({
      name,
      age,
      owners:[sefMaoID],
    })
    .then(function() {
      console.log('set add cat succeeded');

      const userPath = "/users/" + firebase.auth().currentUser.uid;
      //TODO: 應該也可以改成直接撈redux-state裡的 !!!catids, 應該比較好,
      // 也可以上面set->update, 然後update用chain的方式
      // http://stackoverflow.com/questions/38317248/how-to-chain-multiple-promises-into-a-single-transaction-in-firebase
      firebase.database().ref(userPath).child("catids").once('value', (snapshot)=>{
         let data = snapshot.val();
         let catids = Object.values(data);
         addCatToUserFireBaseData(catids, newCatId, userPath);

        //  catids.push(newCatId);
        //  console.log("in new page, catids:", catids)
         //
        //  firebase.database().ref(dataPath).child("catids").set(catids).then(()=>{
        //      console.log("reset catids ok !!!:");
        //   });
      });

      // console.log("grimmer array1:", snapshot);
      //
      //  const data = snapshot.val();
      //  const values = Object.values(data);

      // firebase.database().ref('cats').child(catID).on('value', (snapshot) => {

      // const dataPath = "/users/" + firebase.auth().currentUser.uid;
      // firebase.database().ref(dataPath).child("catids").update({
      //   maoID: registerID,
      //   // likeNumber: [1,3,7],
      // }).then(()=>{
      //   console.log("register maoID ok !!!:", registerID);
      // });


    })
    .catch(function(error) {
      console.log('set add cat failed');
    });
    // postsRef.push().set({
    //   author: "alanisawesome",
    //   title: "The Turing Machine"
    // });
  };
}

export function naviToCat(catID) {
  return {
    type: NAVI_TO_CAT,
    payload: {
      catID,
    }
  }
}

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

    // 加上其他的off

    // 可能也會收到, 阿都沒收到, 是因為現在設定成登入才可以有firebase data
    // firebase.database().ref(dataPath).child("catids").on('value', (snapshot) => {
    //
    // // 可能也會收到
    // firebase.database().ref('cats').child(catID).on('value', (snapshot) => {
    //
    // const dataPath = "/users/" + authUser.uid;// +"/maoID";
    // firebase.database().ref(dataPath).on('value', (snap) => { //可能會收到


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

        firebase.database().ref('cats').child(catID).on('value', (snapshot) => {

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

        console.log("auth becomes non null");
        // user.
        const dataPath = "/users/" + authUser.uid;// +"/maoID";

//        let maoID  = firebaseApp.database().ref(dataPath).child('items');
        // let userData  = firebaseApp.database().ref(dataPath);

        // value
        // child_added
        // child_changed
        // child_removed
        // child_moved

        // will not trigger two times !!! if on(xx) two times
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

        console.log("auth becomes null");

        // userChecking=false, 直接回到login 第一頁

        dispatch(fetchUserData(false, null));
      }
    });
  };
}

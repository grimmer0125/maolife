import { createAction } from 'redux-actions';

import * as firebase from 'firebase';
import firebaseConfig from '../../firebaseConfig';

const FBSDK = require('react-native-fbsdk');

const {
  AccessToken,
} = FBSDK;

const LOGIN_DATA = 'LOGIN_DATA';
const USER_DATA = 'USER_DATA';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const LOGIN_FAIL = 'LOGIN_FAIL';
const LOGOUT = 'LOGOUT';
const INVALID_REGISTERID = 'INVALID_REGISTERID';
const EXISTING_REGISTERID = 'EXISTING_REGISTERID';
const UPDATE_CAT_INFO = 'UPDATE_CAT_INFO';
const NAVI_TO_CAT = 'NAVI_TO_CAT';
const LEAVE_CAT_DETAIL = 'LEAVE_CAT_DETAIL';

export const ActionTypes = {
  LOGIN_DATA,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  USER_DATA,
  LOGOUT,
  INVALID_REGISTERID,
  EXISTING_REGISTERID,
  UPDATE_CAT_INFO,
  NAVI_TO_CAT,
  LEAVE_CAT_DETAIL,
};

function addCatToUserFireBaseData(catids, newCatId, ownerPath) {
  catids.push(newCatId);
  console.log('in new page, catids:', catids, ';ownerPath:', ownerPath);

  firebase.database().ref(ownerPath).child('catids').set(catids)
    .then(() => {
      console.log('reset catids ok !!!:');
    });
}

export const invalidRegisterIDAction = createAction(INVALID_REGISTERID);
export const registerExistingIDAction = createAction(EXISTING_REGISTERID);
export const leaveCatDetail = createAction(LEAVE_CAT_DETAIL);
export const LogoutAction = createAction(LOGOUT);

// 1. 新增到那隻貓的owners裡
// 2. 新增到那個人的catids裡
export function addNewOwner(catID, ownerKID) {
  return (dispatch, getState) => {
    console.log('start to add owner:', ownerKID, ';for cat:', catID);

    const query = firebase.database().ref().child('users').orderByChild('KID')
      .equalTo(ownerKID);
    query.once('value', (snapshot) => {
      const matchIDs = snapshot.val();
      if (matchIDs) {
        const matchIDKeys = Object.keys(matchIDs); // or use snapshot.foreach
        const matchID = matchIDKeys[0];

        console.log('get match KID, userID:', matchID);

        const state = getState();

        // let data = //snapshot.val();
        const owners = Object.values(state.cats[catID].owners);
        owners.push(matchID);

        const catPath = `cats/${catID}`;

        firebase.database().ref(catPath).child('owners').set(owners)
          .then(() => {
            console.log('add ownerID into owners ok !!!');

            const userPath = `users/${matchID}`;
            firebase.database().ref(userPath).child('catids').once('value', (snapshot) => {
              const data = snapshot.val();

              let catids = [];
              if (data) {
                catids = Object.values(data);
              }

              // TODO avoid duplicate catids
              addCatToUserFireBaseData(catids, catID, userPath);
            });
          });
      }
    });
  };
}

export function naviToCat(catID) {
  return {
    type: NAVI_TO_CAT,
    payload: {
      catID,
    },
  };
}

export function addNewCat(name, age) {
  return (dispatch, getState) => {
    const state = getState();
    // const sefKID = state.user.KID;

    const newCatRef = firebase.database().ref('cats').push();
    const newCatId = newCatRef.key;
    console.log('newCat:', newCatId);

    newCatRef.set({
      name,
      age,
      owners: [firebase.auth().currentUser.uid],
    })
      .then(() => {
        console.log('set add cat succeeded');

        const userPath = `/users/${firebase.auth().currentUser.uid}`;

        // xTODO: 應該也可以改成直接撈redux-state裡的 !!!catids, 應該比較好,
        // 也可以上面set->update, 然後update用chain的方式
        // firebase.database().ref(userPath).child("catids").once('value', (snapshot)=>{
        //  let data = snapshot.val();
        const catids = state.user.catids;// Object.values(data);
        addCatToUserFireBaseData(catids, newCatId, userPath);
      // });
      })
      .catch((error) => {
        console.log('add cat failed');
      });
  };
}

export function updateCatInfo(catID, catInfo) {
  return {
    type: UPDATE_CAT_INFO,
    payload: {
      catID,
      catInfo,
    },
  };
}

// 但有可能不同手機上改貓名字, 所以還是要listen 貓的變化 .
// 這樣不就沒有必要去把catids放在user下, 不, 不一樣,
// 一個是listen 特定貓的變化 +撈貓貓的資料. <-還是先用這個好了˙
// 一個是去找出 那些貓貓的owner有我, 再show其資訊. ->listen這個很奇怪, 且找不太到, orderByChild應該是只能針對單一的value,
//
export function fetchOwnCats() {
  return (dispatch) => {
    const dataPath = `/users/${firebase.auth().currentUser.uid}`;

    firebase.database().ref(dataPath).child('catids').on('value', (snapshot) => {
      // array
    //  const data = snapshot.val();
    //  const values = Object.values(data);
    //
    //  for (var i = 0; i < values.length; i++) {
    //    const value = values[i];
    //    console.log("grimmer array2:", value); //hello, kitty
    //   //  firebase.database().ref('groups/' + keys[i]).on(...)
    //  }

      snapshot.forEach((item) => {
        const catID = item.val();

        // console.log("grimmer each cat id:", catID);

        firebase.database().ref('cats').child(catID).on('value', (snapshot) => {
          const catInfo = snapshot.val();
          // owners: firebase not real array already ->JS realy array
          // console.log("grimmer cat info:", catInfo);

          dispatch(updateCatInfo(catID, catInfo));
        });
      });
    });
  };
}

export function registerKID(registerID) {
  return (dispatch) => {
    if (!registerID || registerID.indexOf(' ') >= 0) {
      console.log('invalid register id:', registerID);
      dispatch(invalidRegisterIDAction());
    } else {
      console.log('try registring id:', registerID);

      const query = firebase.database().ref().child('users').orderByChild('KID')
        .equalTo(registerID);
      query.once('value', (snapshot) => {
        const userData = snapshot.val();
        if (userData) {
          dispatch(registerExistingIDAction());
        } else {
          const dataPath = `/users/${firebase.auth().currentUser.uid}`;
          firebase.database().ref(dataPath).update({
            KID: registerID,
          }).then(() => {
            console.log('register KID ok !!!:', registerID);
          });
        }
      });
    }
  };
}


export function LoginSuccess(displayName) {
  return {
    type: LOGIN_SUCCESS,
    payload: {
      displayName,
    },
  };
}

export function handleFBLogout(error, result) {
  return (dispatch) => {
    // 加上其他的off, 不需要
    // 登出後 阿都沒收到, 是因為現在設定成登入才可以有firebase data
    // firebase.database().ref(dataPath).child("catids").on('value', (snapshot) => {

    // https://firebase.google.com/docs/reference/node/firebase.auth.Auth#signOut
    firebase.auth().signOut()
      .then(() => {
        console.log('firebase logout');
        dispatch(LogoutAction());
      });
  };
}

export function handleFBLogin(error, result) {
  return (dispatch) => {
    if (error) {
      // TODO handle FB login error
      // alert("login has error: " + result.error);
      console.log(`login has error: ${result.error}`);
    } else if (result.isCancelled) {
      console.log('login is cancelled.');
      // alert("login is cancelled.");
    } else {
      console.log('login ok, result:', result);// not much info
      AccessToken.getCurrentAccessToken()
        .then((data) => {
          console.log('access token data:', data);
          // userID 10208940635412999"

          const token = data.accessToken.toString();

          return firebase.auth().signInWithCredential(firebase.auth.FacebookAuthProvider.credential(token));
          // alert(data.accessToken.toString());
        }).then((result) => {
          console.log('login FB from Firebae result:', result);
          console.log('result property:', result.displayName, ';', result.email, ';', result.uid);

          if (result.displayName) {
            console.log(`try saving displayName ${result.displayName}`);
            // alert("welcome! " + result.displayName);

            const dataPath = `/users/${result.uid}`;

            // https://firebase.google.com/docs/reference/js/firebase.database.Reference#update
            // oncomplete: use callback or promise
            firebase.database().ref(dataPath).update({
              displayName: result.displayName,
            }).then(() => {
              console.log('register displayName ok');
            });
          }

          // uid:SKdyxdxZjvhuUFo4VLBm4U1m1iy2" ???

          dispatch(LoginSuccess(result.displayName));
        }).catch((error) => {
        // TODO handle FB + firebase login fail or
        // getCurrentAccessToken fail
          console.log("use fb's token to login firebase error:", error);
        });
    }
  };
}

export function fetchUserData(result, userData) {
  return {
    type: USER_DATA,
    payload: {
      result,
      userData,
    },
  };
}

export function connectDBtoCheckUser() {
  return (dispatch) => {
    firebase.initializeApp(firebaseConfig);

    // https://github.com/SolidStateGroup/react-native-firebase-auth/blob/master/index.js
    // https://github.com/JamesMarino/Firebase-ReactNative/blob/master/index.ios.js
    firebase.auth().onAuthStateChanged((authUser) => {
      console.log('got auth user change in DB:', authUser);

      if (authUser) {
        const dataPath = `/users/${authUser.uid}`;// +"/KID";

        // will not trigger two times !!! if on(xx) two times
        firebase.database().ref(dataPath).on('value', (snap) => {
          const userValue = snap.val();

          console.log('userdata from firebase:', userValue);

          if (userValue && userValue.KID) {
            console.log('KID for:', authUser.uid, ';KID:', userValue.KID);
          } else {
            console.log('no KID for:', authUser.uid);
          }

          dispatch(fetchUserData(true, userValue));
        });

        // let userData = await firebase.auth().currentUser;
        // user.uid
        // let userMobilePath = "/user/" + userId + "/details";

        // login
        // 檢查 database裡的值
        //  a. 已login 但無KID
        //  b. 已login 有id
      } else {
        console.log('auth becomes null');

        // userChecking=false, 直接回到login 第一頁

        dispatch(fetchUserData(false, null));
      }
    });
  };
}

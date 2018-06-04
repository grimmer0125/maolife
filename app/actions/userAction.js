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
const REMOVE_CAT = 'REMOVE_CAT';
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
  REMOVE_CAT,
  NAVI_TO_CAT,
  LEAVE_CAT_DETAIL,
};

function addCatToUserFireBaseData(catids, newCatId, ownerPath) {
  catids.push(newCatId);

  return firebase.database().ref(ownerPath).child('catids').set(catids)
    .then(() => {
      console.log('add cat to catids ok !!!:');
    })
    .catch((error) => {
      console.log('add cat to catids failed:', error);
    });
}

function removeCatFromUserFields(catids, catID, ownerPath) {
  const index = catids.indexOf(catID);
  if (index === -1) {
    console.log("can not find catid in self's catids");

    return;
  }
  catids.splice(index, 1);

  firebase.database().ref(ownerPath).child('catids').set(catids)
    .then(() => {
      console.log('reset catids (remove) ok !!!:');
    })
    .catch((error) => {
      console.log('reset catids (remove) failed:', error);
    });
}

export const invalidRegisterIDAction = createAction(INVALID_REGISTERID);
export const registerExistingIDAction = createAction(EXISTING_REGISTERID);
export const leaveCatDetail = createAction(LEAVE_CAT_DETAIL);
export const LogoutAction = createAction(LOGOUT);

/**
 * two steps: 1. add owners to cat's property
 * 2. add cat to owner's catids property
 */
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

        if (state.cats[catID].owners instanceof Array) {
          console.log('owner is array');
        }

        const owners = state.cats[catID].owners.slice(0);
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
                catids = data;
              }

              // TODO avoid duplicate catid in catids
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

export function removeSelfFromCatOwners(catID) {
  return (dispatch, getState) => {
    const state = getState();

    // step1: update cat's owners,
    // a: if self is the only one owner, completely delete cat info.
    // b: just remove self from cat's owners
    const owners = state.cats[catID].owners.slice(0);

    const index = owners.indexOf(firebase.auth().currentUser.uid);
    if (index === -1) {
      console.log("can not find self in cat's owners");

      return;
    }
    owners.splice(index, 1);

    const catPath = `cats/${catID}`;

    if (owners.length > 0) {
      // case 1-a

      firebase.database().ref(catPath).child('owners').set(owners)
        .then(() => {
          console.log("update cat's owner ok");
          // step2: update user's catids

          const userPath = `/users/${firebase.auth().currentUser.uid}`;
          const catids = state.currentUser.catids.slice(0);
          removeCatFromUserFields(catids, catID, userPath);
        })
        .catch((error) => {
          console.log('update cat owner failed:', error);
        });
    } else {
      // case 1-b
      firebase.database().ref(catPath).remove()
        .then(() => {
          console.log('remove cat ok');
          // step2: update user's catids

          const userPath = `/users/${firebase.auth().currentUser.uid}`;
          const catids = state.currentUser.catids.slice(0);
          removeCatFromUserFields(catids, catID, userPath);
        })
        .catch((error) => {
          console.log('remove cat fail:', error);
        });
    }
  };
}

export function addNewCat(name, age) {
  return (dispatch, getState) => {
    const state = getState();

    const newCatRef = firebase.database().ref('cats').push();
    const newCatId = newCatRef.key;
    console.log('newCat:', newCatId);

    newCatRef.set({
      name,
      age,
      owners: [firebase.auth().currentUser.uid],
    })
      .then(() => {
        console.log('add new cat succeeded');

        const userPath = `/users/${firebase.auth().currentUser.uid}`;
        let catids = [];
        if (state.currentUser.catids) {
          catids = state.currentUser.catids.slice(0);
        }
        addCatToUserFireBaseData(catids, newCatId, userPath, getState)
          .then(() => {
            console.log('add new cat\'s id to user\'s catids ok');
          });
      })
      .catch((error) => {
        console.log('add cat failed:', error);
      });
  };
}

export function removeCat(catID) {
  return {
    type: REMOVE_CAT,
    payload: {
      catID,
    },
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

function stopLiveQueryCatInfo(catID) {
  return (dispatch, getState) => {
    // ref: https://stackoverflow.com/a/28266537/7354486
    // ref: https://stackoverflow.com/questions/11804424/deactivating-events-with-off indicates that
    // off('value') w/o callback seems ok too.
    firebase.database().ref('cats').child(catID).off();
  };
}

function liveQueryCatInfo(catID) {
  return (dispatch) => {
    firebase.database().ref('cats').child(catID).on('value', (snapshot) => {
      const catInfo = snapshot.val();

      console.log('grimmer catid info live update', catID);

      dispatch(updateCatInfo(catID, catInfo));
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

export function handleFBLogout(error) {
  return (dispatch) => {
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
      // TODO handle FB login error on UI
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

          const token = data.accessToken.toString();

          return firebase.auth().signInWithCredential(firebase.auth.FacebookAuthProvider.credential(token));
          // alert(data.accessToken.toString());
        }).then((result) => {
          console.log('login FB from Firebae result:', result);

          if (result.displayName) {
            console.log(`try saving displayName ${result.displayName}`);
            // alert("welcome! " + result.displayName);

            const dataPath = `/users/${result.uid}`;

            // https://firebase.google.com/docs/reference/js/firebase.database.Reference#update
            firebase.database().ref(dataPath).update({
              displayName: result.displayName,
            }).then(() => {
              console.log('register displayName ok');
            });
          }

          dispatch(LoginSuccess(result.displayName));
        }).catch((error) => {
        // TODO handle firebase login fail or
        // getCurrentAccessToken fail
          console.log("use fb's token to login firebase error:", error);
        });
    }
  };
}

export function getUserData(result, userData) {
  console.log('getUserData:', userData);
  return {
    type: USER_DATA,
    payload: {
      result,
      userData,
    },
  };
}

export function connectDBtoCheckUser() {
  return (dispatch, getState) => {
    firebase.initializeApp(firebaseConfig);

    // https://github.com/SolidStateGroup/react-native-firebase-auth/blob/master/index.js
    // https://github.com/JamesMarino/Firebase-ReactNative/blob/master/index.ios.js
    firebase.auth().onAuthStateChanged((authUser) => {
      console.log('got auth user change in DB:', authUser);

      if (authUser) {
        const dataPath = `/users/${authUser.uid}`;

        // TODO check: will not trigger two times ?? !!!
        firebase.database().ref(dataPath).on('value', (snap) => {
          const userValue = snap.val();

          console.log('grimmer userdata from firebase:', userValue);

          if (userValue && userValue.KID) {
            console.log('KID for:', authUser.uid, ';KID:', userValue.KID);
          } else {
            console.log('no KID for:', authUser.uid);
          }

          let catids = [];
          let catids_copy = [];
          let oldCatids_copy = [];

          if (userValue.catids) {
            catids = userValue.catids.slice(0);
            catids_copy = userValue.catids.slice(0);
          }

          const state = getState();
          if (state.currentUser.catids) {
            const oldCatids = state.currentUser.catids;

            for (const id of oldCatids) {
              const index = catids.indexOf(id);
              if (index !== -1) {
                catids.splice(index, 1);
              }
            }

            oldCatids_copy = oldCatids.slice(0);
            for (const id of catids_copy) {
              const index = oldCatids_copy.indexOf(id);
              if (index !== -1) {
                oldCatids_copy.splice(index, 1);
              }
            }
          }

          // case: add cat to catids
          for (const id of catids) {
            dispatch(liveQueryCatInfo(id));
          }

          // case: remvoe cat from catids
          for (const id of oldCatids_copy) {
            console.log('stopquery and remove cat:', id);
            dispatch(stopLiveQueryCatInfo(id));
            dispatch(removeCat(id));
          }

          dispatch(getUserData(true, userValue));
        });
      } else {
        console.log('auth becomes null');

        dispatch(getUserData(false, null));
      }
    });
  };
}

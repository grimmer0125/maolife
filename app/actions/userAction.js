import { createAction } from 'redux-actions';

import * as firebase from 'firebase';
import firebaseConfig from '../../firebaseConfig';

const FBSDK = require('react-native-fbsdk');

const {
  AccessToken,
} = FBSDK;

const LOGIN_DATA = 'LOGIN_DATA';
const USER_DATA = 'USER_DATA';
const OWNER_DATA = 'OWNER_DATA';
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
  OWNER_DATA,
  LOGOUT,
  INVALID_REGISTERID,
  EXISTING_REGISTERID,
  UPDATE_CAT_INFO,
  REMOVE_CAT,
  NAVI_TO_CAT,
  LEAVE_CAT_DETAIL,
};

function addPetToUserFireBaseData(petIDList, newPetId, ownerPath) {
  petIDList.push(newPetId);

  return firebase.database().ref(ownerPath).child('petIDList').set(petIDList)
    .then(() => {
      console.log('add pet to petIDList ok !!!');
    })
    .catch((error) => {
      console.log('add pet to petIDList failed:', error);
    });
}

function removePetFromUserFields(petIDList, petID, ownerPath) {
  const index = petIDList.indexOf(petID);
  if (index === -1) {
    console.log("can not find petid in self's petIDList");

    return;
  }
  petIDList.splice(index, 1);

  firebase.database().ref(ownerPath).child('petIDList').set(petIDList)
    .then(() => {
      console.log('reset petIDList (remove) ok !!!:');
    })
    .catch((error) => {
      console.log('reset petIDList (remove) failed:', error);
    });
}

export function getOwnerData(userID, userInfo) {
  return {
    type: OWNER_DATA,
    payload: {
      userID,
      userInfo,
    },
  };
}

export function fetchOwnerData(owners) {
  return (dispatch, getState) => {
    const state = getState();
    const selfID = firebase.auth().currentUser.uid;
    for (const ownerID of owners) {
      if (ownerID !== selfID) {
        if (!state.users[ownerID]) {
          console.log('fetch owner data:', ownerID);
          const userPath = `users/${ownerID}`;
          firebase.database().ref(userPath).once('value', (snapshot) => {
            const data = snapshot.val();

            dispatch(getOwnerData(ownerID, data));
          })
            .catch((error) => {
              console.log('fetch owner failed:', error);
            });
        }
      }
    }
  };
}

export const invalidRegisterIDAction = createAction(INVALID_REGISTERID);
export const registerExistingIDAction = createAction(EXISTING_REGISTERID);
export const leavePetDetail = createAction(LEAVE_CAT_DETAIL);
export const LogoutAction = createAction(LOGOUT);

/**
 * two steps: 1. add owners to pet's property
 * 2. add pet to owner's petIDList property
 */
export function addNewOwner(petID, ownerKID) {
  return (dispatch, getState) => {
    if (!ownerKID || ownerKID === '') {
      console.log('invalid ownerKID:', ownerKID);
      return;
    }

    const query = firebase.database().ref().child('users').orderByChild('KID')
      .equalTo(ownerKID);
    query.once('value', (snapshot) => {
      const matchIDs = snapshot.val();
      if (matchIDs) {
        const matchIDKeys = Object.keys(matchIDs); // or use snapshot.foreach
        const matchID = matchIDKeys[0];

        console.log('get matched KID:', matchID);

        const state = getState();

        const owners = state.pets[petID].owners.slice(0);
        if (owners.indexOf(matchID) > -1) {
          console.log('that user is already authorized yet, not add again');
          return;
        }
        owners.push(matchID);

        const petPath = `pets/${petID}`;

        firebase.database().ref(petPath).child('owners').set(owners)
          .then(() => {
            console.log('add ownerID into pet\'s owners ok !!!');

            const userPath = `users/${matchID}`;
            firebase.database().ref(userPath).child('petIDList').once('value', (snapshot) => {
              const data = snapshot.val();

              let petIDList = [];
              if (data) {
                petIDList = data;
              }

              // TODO avoid duplipete petid in petIDList
              addPetToUserFireBaseData(petIDList, petID, userPath);
            });
          });
      }
    });
  };
}

export function naviToPet(petID) {
  return {
    type: NAVI_TO_CAT,
    payload: {
      petID,
    },
  };
}

export function removeSelfFromPetOwners(petID) {
  return (dispatch, getState) => {
    const state = getState();

    // step1: update pet's owners,
    // a: if self is the only one owner, completely delete pet info.
    // b: just remove self from pet's owners
    const owners = state.pets[petID].owners.slice(0);

    const index = owners.indexOf(firebase.auth().currentUser.uid);
    if (index === -1) {
      console.log("can not find self in pet's owners");

      return;
    }
    owners.splice(index, 1);

    const petPath = `pets/${petID}`;

    if (owners.length > 0) {
      // case 1-a

      firebase.database().ref(petPath).child('owners').set(owners)
        .then(() => {
          console.log("update pet's owner ok");
          // step2: update user's petIDList

          const userPath = `/users/${firebase.auth().currentUser.uid}`;
          const petIDList = state.currentUser.petIDList.slice(0);
          removePetFromUserFields(petIDList, petID, userPath);
        })
        .catch((error) => {
          console.log('update pet owner failed:', error);
        });
    } else {
      // case 1-b
      firebase.database().ref(petPath).remove()
        .then(() => {
          console.log('remove pet ok');
          // step2: update user's petIDList

          const userPath = `/users/${firebase.auth().currentUser.uid}`;
          const petIDList = state.currentUser.petIDList.slice(0);
          removePetFromUserFields(petIDList, petID, userPath);
        })
        .catch((error) => {
          console.log('remove pet fail:', error);
        });
    }
  };
}

export function addNewPet(name, age) {
  return (dispatch, getState) => {
    const state = getState();

    const newPetRef = firebase.database().ref('pets').push();
    const newPetId = newPetRef.key;
    console.log('newPet:', newPetId);

    newPetRef.set({
      name,
      age,
      owners: [firebase.auth().currentUser.uid],
    })
      .then(() => {
        console.log('add new pet succeeded');

        const userPath = `/users/${firebase.auth().currentUser.uid}`;
        let petIDList = [];
        if (state.currentUser.petIDList) {
          petIDList = state.currentUser.petIDList.slice(0);
        }
        addPetToUserFireBaseData(petIDList, newPetId, userPath, getState)
          .then(() => {
            console.log('add new pet\'s id to user\'s petIDList ok');
          });
      })
      .catch((error) => {
        console.log('add pet failed:', error);
      });
  };
}

export function removePet(petID) {
  return {
    type: REMOVE_CAT,
    payload: {
      petID,
    },
  };
}

export function updatePetInfo(petID, petInfo) {
  return {
    type: UPDATE_CAT_INFO,
    payload: {
      petID,
      petInfo,
    },
  };
}

function stopLiveQueryPetInfo(petID) {
  return (dispatch, getState) => {
    // ref: https://stackoverflow.com/a/28266537/7354486
    // ref: https://stackoverflow.com/questions/11804424/deactivating-events-with-off indipetes that
    // off('value') w/o callback seems ok too.
    firebase.database().ref('pets').child(petID).off();
  };
}

function liveQueryPetInfo(petID) {
  return (dispatch) => {
    firebase.database().ref('pets').child(petID).on('value', (snapshot) => {
      const petInfo = snapshot.val();

      dispatch(updatePetInfo(petID, petInfo));
    });
  };
}

// use a empty string as KID to note "skip" status in DB
export function skipRegistration() {
  return () => {
    const dataPath = `/users/${firebase.auth().currentUser.uid}`;
    firebase.database().ref(dataPath).update({
      KID: '',
    }).then(() => {
      console.log('register dummy KID ("") ok !!!');
    })
      .catch((error) => {
        console.log('registering dummy KID ("") fail:', error);
      });
  };
}

export function registerKID(registerID) {
  return (dispatch) => {
    if (!registerID || registerID.indexOf(' ') >= 0) {
      console.log('invalid register id:', registerID);
      dispatch(invalidRegisterIDAction());
    } else {
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
          })
            .catch((error) => {
              console.log('registering KID fail:', error);
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
  return (dispatch, getState) => {
    // https://firebase.google.com/docs/reference/node/firebase.auth.Auth#signOut
    firebase.auth().signOut()
      .then(() => {
        console.log('firebase auth signOut ok');
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

      // FB login ok by users
      dispatch(LoginSuccess(''));

      // NOTE:
      // dispatch(LoginSuccess('')) here ->
      // login button-ui change (logined status)
      // -> signIn callback ->auth callback

      AccessToken.getCurrentAccessToken()
        .then((data) => {
          console.log('access token data:', data);

          const token = data.accessToken.toString();

          // Try FB auth by this app, not users
          return firebase.auth().signInWithCredential(firebase.auth.FacebookAuthProvider.credential(token));
          // alert(data.accessToken.toString());
        }).then((result) => {
          console.log('login FB ok. Firebae result:', result);

          if (result.displayName) {
            console.log(`try saving displayName ${result.displayName}`);
            // alert("welcome! " + result.displayName);

            const dataPath = `/users/${result.uid}`;

            // https://firebase.google.com/docs/reference/js/firebase.database.Reference#update
            firebase.database().ref(dataPath).update({
              displayName: result.displayName,
            }).then(() => {
              console.log('save displayName ok');
            });
          }

          // dispatch(LoginSuccess('')); // displayName can be gotten from auth+data callback
        }).catch((error) => {
        // TODO handle firebase login fail or
        // getCurrentAccessToken fail
          console.log("use fb's token to login firebase error:", error);
        });
    }
  };
}

export function getUserData(result, userData) {
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
    console.log('setup firebase, connectDBtoCheckUser');
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

          console.log('user value changed from firebase:', userValue);

          let petIDList = [];
          let petIDList_copy = [];
          let oldPetIDList_copy = [];

          if (userValue && userValue.petIDList) {
            petIDList = userValue.petIDList.slice(0);
            petIDList_copy = userValue.petIDList.slice(0);
          }

          const state = getState();
          if (state.currentUser.petIDList) {
            const oldPetIDList = state.currentUser.petIDList;

            for (const id of oldPetIDList) {
              const index = petIDList.indexOf(id);
              if (index !== -1) {
                petIDList.splice(index, 1);
              }
            }

            oldPetIDList_copy = oldPetIDList.slice(0);
            for (const id of petIDList_copy) {
              const index = oldPetIDList_copy.indexOf(id);
              if (index !== -1) {
                oldPetIDList_copy.splice(index, 1);
              }
            }
          }

          // case: add pet to petIDList
          for (const id of petIDList) {
            dispatch(liveQueryPetInfo(id));
          }

          // case: remvoe pet from petIDList
          for (const id of oldPetIDList_copy) {
            console.log('stopquery and remove pet:', id);
            dispatch(stopLiveQueryPetInfo(id));
            dispatch(removePet(id));
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

const actions = {
  fetchOwnerData,
};

export default actions;

import { createAction } from 'redux-actions';
import { Alert } from 'react-native';
// import validator from 'validator';

import * as firebase from 'firebase';
import firebaseConfig from '../../firebaseConfig';
import I18n from '../i18n/i18n';

const FBSDK = require('react-native-fbsdk');

const {
  AccessToken,
  LoginManager,
} = FBSDK;

const LOGIN_DATA = 'LOGIN_DATA';
const USER_DATA = 'USER_DATA';
const OWNER_DATA = 'OWNER_DATA';
const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const START_SIGNIN = 'START_SIGNIN';
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
  START_SIGNIN,
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

function fetchOwnerData(owners) {
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
// export const leavePetDetail = createAction(LEAVE_CAT_DETAIL);
export const LogoutAction = createAction(LOGOUT);
export const LoginFailAction = createAction(LOGIN_FAIL);

/**
 * two steps: 1. add owners to pet's property
 * 2. add pet to owner's petIDList property
 */
function addNewOwner(petID, ownerKID) {
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
      // case 1-b: will trigger a UPDATE_CAT_INFO but value is null
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

export function StartSignIn() {
  return {
    type: START_SIGNIN,
  };
}

export function handleFBLogout(error) {
  return (dispatch, getState) => {
    // NOTE:
    // https://stackoverflow.com/questions/38043998/is-there-any-way-to-off-all-listeners-when-a-user-is-de-authorized#comment63528231_38043998
    // All listeners to nodes that require authentication will automatically be cancelled when the user becomes unauthenticated.
    // You can easily check that by listening for errors, those will fire in that scenario. – Frank van Puffelen Jun 26 '16 at 23:39
    firebase.auth().signOut()
      .then(() => {
        console.log('firebase auth signOut ok');
        dispatch(LogoutAction());
      });
  };
}

function handleFBLogin() {
  return (dispatch) => {
    LoginManager.logInWithReadPermissions(['public_profile'])
      .then(
        (result) => {
          if (result.isCancelled) {
            console.log('login is cancelled.');
          } else {
            console.log(`Login success with permissions: ${
              result.grantedPermissions.toString()}`);

            console.log('login ok, result:', result);// not much info

            // FB login ok by users
            // will trigger a loading.... screen
            dispatch(StartSignIn());

            // NOTE:
            // dispatch(StartSignIn('')) here ->
            // login button-ui change (logined status)
            // -> signIn callback ->auth callback

            AccessToken.getCurrentAccessToken()
              .then((data) => {
                console.log('access token data:', data);

                const token = data.accessToken.toString();

                // Try FB auth by this app, not users
                return firebase.auth().signInWithCredential(firebase.auth.FacebookAuthProvider.credential(token));
              }).then((result) => {
                console.log('login FB ok. Firebase result:', result);

                if (result.displayName) {
                  console.log(`try saving displayName ${result.displayName}`);

                  const dataPath = `/users/${result.uid}`;

                  // https://firebase.google.com/docs/reference/js/firebase.database.Reference#update
                  firebase.database().ref(dataPath).update({
                    displayName: result.displayName,
                  }).then(() => {
                    console.log('save displayName ok');
                  });
                }

              // dispatch(StartSignIn('')); // displayName can be gotten from auth+data callback
              }).catch((error) => {
              // TODO handle firebase login fail or
              // getCurrentAccessToken fail
                console.log("use fb's token to login firebase error:", error);
              });
          }
        },
        (error) => {
          console.log(`login has error: ${error}`);
        },
      );
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

    // mm https://github.com/SolidStateGroup/react-native-firebase-auth/blob/master/index.js
    // https://github.com/JamesMarino/Firebase-ReactNative/blob/master/index.ios.js
    firebase.auth().onAuthStateChanged((user) => {
      console.log('auth got user change in DB:', user);

      // Testing
      // const testDataPath = '/cars3/grimmer2';
      // firebase.database().ref(testDataPath).on('value', (snap) => {
      //   const testValue = snap.val();
      //   console.log('testValue:', testValue);
      //
      //   // setTimeout(() => {
      //   //   console.log('test write');
      //   //   firebase.database().ref(testDataPath).update({
      //   //     displayName: 'kk',
      //   //   }).then(() => {
      //   //     console.log('save kk ok');
      //   //   });
      //   // }, 3000);
      // });

      if (user) {
        // emailVerified:falsue
        // providerId :"facebook.com"
        const emailVerified = !user.providerData || !user.providerData.length || user.providerData[0].providerId != 'password' || user.emailVerified;
        if (emailVerified) {
          console.log('user email is not needed or verified');
        } else {
          console.log('user email is not verified:', user);
        }

        const dataPath = `/users/${user.uid}`;

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

          // after get the data, login -> MainScreen
          dispatch(getUserData(true, userValue));
        });
      } else {
        console.log('auth becomes null');

        dispatch(getUserData(false, null));

        // TODO: empty redux's cats to have better code logic
      }
    });
  };
}

function signinEmailAccount(email, password) {
  return (dispatch, getState) => {
    if (email && password) {
      dispatch(StartSignIn(''));

      firebase.auth().signInWithEmailAndPassword(email, password)
        .then((user) => {
          console.log('sign in ok, get the user:', user);
        })
        .catch((error) => {
          dispatch(LoginFailAction());

          // Handle Errors here.
          console.log('sign in fail');
          const errorCode = error.code;
          const errorMessage = error.message;
          // alert(errorMessage);
          //
          Alert.alert(
            errorCode,
            errorMessage,
            [
              { text: 'Ok' },
            ],
            { cancelable: true },
          );
        });
    } else {
      // alert('empty email/pwd');
    }
  };
}

function resetEmailAccountPassword(email) {
  return () => {
    firebase.auth().sendPasswordResetEmail(email)
      .then(() => {
        Alert.alert(
          I18n.t('Password reset email sent'),
          null,
          [
            { text: 'Ok' },
          ],
          { cancelable: true },
        );
      })
      .catch((error) => {
      // Error occurred. Inspect error.code.
        Alert.alert(
          error.code,
          error.message,
          [
            { text: 'Ok' },
          ],
          { cancelable: true },
        );
      });
  };
}


function signUpEmailAccount(email, password) {
  return (dispatch, getState) => {
    // signUpEmailAccount() {
    if (email && password) {
      // validator.isEmail('foo@bar.com');

      firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((user) => {
          console.log('signup & auto login get the user:', user);

          // e.g.
          // displayName:null
          // email:"grimmer0125@gmail.com"
          // emailVerified:false
          //

          const dataPath = `/users/${user.uid}`;// `/users/${firebase.auth().currentUser.uid}`;
          firebase.database().ref(dataPath).update({
            email: user.email,
          }).then(() => {
            console.log('save email ok !!!:', user.email);
          });

          // TODO send Email Verification
          // https://firebase.google.com/docs/auth/web/manage-users
          user.sendEmailVerification()
            .then(() => {
              console.log('Verification email sent');

              Alert.alert(
                I18n.t('Verification email sent'),
                null,
                [
                  { text: 'Ok' },
                ],
                { cancelable: true },
              );

            // Email sent.
            }).catch((error) => {
            // An error happened.
              console.log('email failed to send:', error);
            });
        })
        .catch((error) => {
          // Handle Errors here.
          const errorCode = error.code;
          // e.g. {code: "auth/weak-password", message: "Password should be at least 6 characters"}
          const errorMessage = error.message;
          // alert(errorMessage);
          Alert.alert(
            errorCode,
            errorMessage,
            [
              { text: 'Ok' },
            ],
            { cancelable: true },
          );
        });
    } else {
      // alert('empty email/pwd');
    }
    // }
  };
}

const actions = {
  fetchOwnerData,
  addNewOwner,
  signUpEmailAccount,
  handleFBLogin,
  signinEmailAccount,
  resetEmailAccountPassword,
};

export default actions;

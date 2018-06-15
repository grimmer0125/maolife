import { createAction } from 'redux-actions';
import { Alert } from 'react-native';

import * as firebase from 'firebase';
import I18n from '../i18n/i18n';
import petActions from './petActions';

const FBSDK = require('react-native-fbsdk');

const {
  AccessToken,
  LoginManager,
} = FBSDK;

const USER_DATA = 'USER_DATA';
// const LOGIN_SUCCESS = 'LOGIN_SUCCESS';
const START_SIGNIN = 'START_SIGNIN';
const LOGIN_FAIL = 'LOGIN_FAIL';
const LOGOUT = 'LOGOUT';
const INVALID_REGISTERID = 'INVALID_REGISTERID';
const EXISTING_REGISTERID = 'EXISTING_REGISTERID';

export const ActionTypes = {
  // LOGIN_SUCCESS,
  START_SIGNIN,
  LOGIN_FAIL,
  USER_DATA,
  LOGOUT,
  INVALID_REGISTERID,
  EXISTING_REGISTERID,
};

const invalidRegisterIDAction = createAction(INVALID_REGISTERID);
const registerExistingIDAction = createAction(EXISTING_REGISTERID);
const LogoutAction = createAction(LOGOUT);
const LoginFailAction = createAction(LOGIN_FAIL);

// use a empty string as KID to note "skip" status in DB
function skipRegistration() {
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

function registerKID(registerID) {
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

function startSignIn() {
  return {
    type: START_SIGNIN,
  };
}

function logoutFirebase() {
  return (dispatch) => {
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

// NOTE: seems this is hard to happen in this step, not seen yet
function getFacebookSignInFail() {
  return (dispatch) => {
    dispatch(LoginFailAction());

    Alert.alert(
      I18n.t('Facebook Login Fail'),
      null,
      [
        { text: 'Ok' },
      ],
      { cancelable: true },
    );
  };
}

function getFirebaseSignInFail(error) {
  return (dispatch) => {
    dispatch(LoginFailAction());

    // Handle Errors here.
    const errorCode = error.code;
    const errorMessage = error.message;

    Alert.alert(
      errorCode,
      errorMessage,
      [
        { text: 'Ok' },
      ],
      { cancelable: true },
    );
  };
}

function loginFacebook() {
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
            dispatch(startSignIn());

            // NOTE:
            // dispatch(startSignIn('')) here ->
            // fb login button-ui change (logined status)
            // -> signIn callback ->auth callback
            // we have used fb LoginManager instead of fb login button-ui

            AccessToken.getCurrentAccessToken()
              .then((data) => {
                console.log('access token data:', data);

                const token = data.accessToken.toString();

                // Try FB auth by this app, not users
                return firebase.auth().signInWithCredential(firebase.auth.FacebookAuthProvider.credential(token));
              }).then((user) => {
                console.log('firebase login FB ok. Firebase result:', user);
              }).catch((error) => {
                console.log("use fb's token to auth firebase error:", error);
                dispatch(getFirebaseSignInFail(error));
              });
          }
        },
        (error) => {
          console.log(`login fb error: ${error}`);
          dispatch(getFacebookSignInFail());
        },
      );
  };
}

function getUserData(result, userData) {
  return {
    type: USER_DATA,
    payload: {
      result,
      userData,
    },
  };
}

function updateProfileToFirebase(user, userValue) {
  if (user.displayName && (!userValue || !userValue.displayName)) {
    console.log(`try saving displayName ${user.displayName}`);

    const dataPath = `/users/${user.uid}`;

    // https://firebase.google.com/docs/reference/js/firebase.database.Reference#update
    firebase.database().ref(dataPath).update({
      displayName: user.displayName,
    }).then(() => {
      console.log('save displayName ok');
    });
  }

  if (user.email && (!userValue || !userValue.email)) {
    console.log('write email:', user.email);
    const dataPath = `/users/${user.uid}`;// `/users/${firebase.auth().currentUser.uid}`;
    firebase.database().ref(dataPath).update({
      email: user.email,
    }).then(() => {
      console.log('save email ok !!!:', user.email);
    });
  } else {
    console.log('no write email:', user.email);
  }
}

function connectDBtoCheckUser() {
  return (dispatch) => {
    console.log('setup firebase, connectDBtoCheckUser');

    // mm https://github.com/SolidStateGroup/react-native-firebase-auth/blob/master/index.js
    // https://github.com/JamesMarino/Firebase-ReactNative/blob/master/index.ios.js
    firebase.auth().onAuthStateChanged((user) => {
      console.log('auth got user change in DB:', user);

      if (!user) {
        console.log('auth user is null, fail');
        dispatch(getUserData(false, null));

        return;
      }
      // providerId :"facebook.com", emailVerified:falsue
      const emailVerified = !user.providerData || !user.providerData.length || user.providerData[0].providerId !== 'password' || user.emailVerified;
      if (!emailVerified) {
        console.log('user is not null but email is not verified');
        dispatch(getUserData(false, null));

        // will trigger one time onAuthStateChanged
        dispatch(logoutFirebase());
        return;
      }

      const dataPath = `/users/${user.uid}`;

      firebase.database().ref(dataPath).on('value', (snap) => {
        const userValue = snap.val();

        console.log('user value changed from firebase:', userValue);

        dispatch(petActions.updatePetsFromNewPetList(userValue));

        updateProfileToFirebase(user, userValue);

        // after get the data, login -> MainScreen
        dispatch(getUserData(true, userValue));
      });
    });
  };
}

function signinEmailAccount(email, password) {
  return (dispatch) => {
    if (email && password) {
      dispatch(startSignIn(''));

      firebase.auth().signInWithEmailAndPassword(email, password)
        .then((user) => {
          console.log('sign in email ok, get the user:', user);

          if (!user || !user.emailVerified) {
            console.log('popup a alert about no verification');

            Alert.alert(
              I18n.t('Email is not verified'),
              null,
              [
                { text: 'Ok' },
              ],
              { cancelable: true },
            );
          }
        })
        .catch((error) => {
          console.log('sign in email fail');
          dispatch(getFirebaseSignInFail(error));
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
  return () => {
    if (email && password) {
      firebase.auth().createUserWithEmailAndPassword(email, password)
        .then((user) => {
          console.log('signup & auto login get the user:', user);

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
  skipRegistration,
  registerKID,
  signUpEmailAccount,
  loginFacebook,
  signinEmailAccount,
  resetEmailAccountPassword,
  logoutFirebase,
  connectDBtoCheckUser,
};

export default actions;

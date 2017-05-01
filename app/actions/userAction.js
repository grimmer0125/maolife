// export function selectTab(tabValue) {
//   return {
//     type: SELECT_TAB,
//     payload: {
//       tabValue,
//     },
//   };
// }

const FBSDK = require('react-native-fbsdk');
const {
  AccessToken,
} = FBSDK;

const LOGIN_DATA = 'LOGIN_DATA';
const USER_DATA = 'USER_DATA';
const LOGIN_SUCCESS = `LOGIN_SUCCESS`;
const LOGIN_FAIL = `LOGIN_SUCCESS`;

export const ActionTypes = {
  LOGIN_DATA,
  LOGIN_SUCCESS,
  USER_DATA,
};

import * as firebase from 'firebase';
import firebaseConfig from '../../firebaseConfig';

// https://github.com/acdlite/redux-actions
export function fetchUserData(result, userData) {
  return {
    type: USER_DATA,
    payload: {
      result,
      userData,
    }
  };
}

export function LoginSuccess(displayName) {
  return {
    type: LOGIN_SUCCESS,
    payload:{
      displayName,
    }
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



        //null, null, KdyxdxZjvhuUFo4VLBm4U1m1iy2
        // but U.displayName: "Teng-Chieh Kang"

        //u or xe/displayName "Teng-Chieh Kang
        //uid:SKdyxdxZjvhuUFo4VLBm4U1m1iy2" ???

        dispatch(LoginSuccess(result.displayName));
        // 寫入uid/某狀態值v/state.user?,
        // 然後user.uid會影響到這個 input id 可不可以寫or show input txt之類的

        // let itmes = firebaseApp.database().ref().child('items');
        // console.log("itmes:", itmes);
        //
        // // ok了
        // itmes.on('value', (snap) => {
        //
        //     const itmes2 = snap.val();
        //     console.log("itmes2:", itmes2);
        //
        // });

      }).catch(function(error) {
        //TODO handle FB + firebase login fail or
        // getCurrentAccessToken fail
        console.log("use fb's token to login firebase error:", error);

      });
    }
  };
}

// function facebookToFirebase(token){
//
//   // https://firebase.google.com/docs/auth/web/custom-auth??
//     firebase.auth().signInWithCredential(firebase.auth.FacebookAuthProvider.credential(token))
//     .then(result=>{
//       console.log("grimmer login result:", result);
//       console.log("grimmer result property:", result.displayName,";",result.email,";",result.uid  );
//
//       if(result.displayName){
//         alert("welcome! " + result.displayName);
//       }
//
//       //null, null, KdyxdxZjvhuUFo4VLBm4U1m1iy2
//       // but U.displayName: "Teng-Chieh Kang"
//
//       //u or xe/displayName "Teng-Chieh Kang
//       //uid:SKdyxdxZjvhuUFo4VLBm4U1m1iy2" ???
//
//       let itmes = firebaseApp.database().ref().child('items');
//       console.log("itmes:", itmes);
//
//       // ok了
//       itmes.on('value', (snap) => {
//
//           const itmes2 = snap.val();
//           console.log("itmes2:", itmes2);
//
//       });
//
//     }).catch(function(error) {
//       console.log("grimmer error:", error);
//     });
//
//     // https://github.com/fullstackreact/react-native-firestack, ios/android firebase wrapper, not node.js
//     //firestack.auth.signInWithProvider('facebook', data.accessToken, '') // facebook will need only access token.
// //     .then((user)=>{
// //       console.log("Inside ");
// //       console.log(user); 
// //     })
//
//     //firebase.auth().signInWithCustomToken(token)
// }


export function connectDBtoCheckUser() {
  return (dispatch) => {

    console.log("init checker");

    const firebaseApp = firebase.initializeApp(firebaseConfig);

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

          const userValue = snap.val();

          if (userValue && userValue.maoID) {
            console.log("maoID for:", authUser.uid, ";maoid:", userValue.maoID);
          } else {
            console.log("no maoID for:", authUser.uid);
          }

          dispatch(fetchUserData(true, userValue));
        });



        // let userData = await firebase.auth().currentUser;
        //user.uid
//        let userMobilePath = "/user/" + userId + "/details";


        // login
        // 檢查 database裡的值
        //  a. 已login 但無maoid
        //    b. 已login 有id

      } else {
        // userChecking=false, 直接回到loing 第一頁

        dispatch(fetchUserData(false, null));
      }
    });


    // // step 1. read app setting value, e.g. product api url
    //
    // // step 2. to get product id
    // productID = AppManager.instance().getProductID();
    // dispatch(getProductIDAction(productID));
    //
    // // step 3. use this product id to get product name
    // queryProductInformation()
    // .then(data => {
    //   if (data === '{"statusCode":404,"error":"Not Found"}') {
    //     AppManager.instance().redirectToLogin();
    //   }
    //
    //   rlog(`get product information:${data}`);
    //   const json = JSON.parse(data);
    //   dispatch(getOkamiProductInfo(json));
    //
    //   dispatch(breadcrumbsExtraAlias('ProductName', json.label));
    //
    //   const url = AppManager.instance().getItemURL(UrlItem.PRODUCTS);
    //   dispatch(breadcrumbsExtraURL('Product', url));
    // });

  };
}

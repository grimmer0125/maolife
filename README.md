# Kiteretsu (formerly maolife)

**It has only been tested on Mac. However Windows and Linux should work**

## UI components

It mainly uses https://nativebase.io/.

## Todo list

Try CodePush for update mechanism.
https://github.com/Microsoft/react-native-code-push

## Library Version and environment requirement

The development was setup on 10.12 and has been upgraded to 10.13 with Xcode 9 and latest React version. 10.12 & 10.11 is not tested for the latest code.

- macOS: 10.13.2 (High Sierra)
- Xcode: 9.2 (only work on 10.13. Its version may affect the versions about React Native and some native npm library)
- Android Studio: 3.0.1
- Gradle version: 4.1
- Android Gradle plugin version: 3.0.1
- React Native: 0.51.0 (from v0.49, a breaking change is, there is no more index.Android.js and index.iOS.js, only index.js)
- React: 16.2.0 (Its version will affect - native-base and react-navigation)
- native-base: 2.3.5
- react-navigation: 1.0.0-beta.22.
- react-native-fbsdk: 0.6.3
- FacebookSDK-iOS (need manually download): 4.29.0
- FacebookSDK-Android: 4.22.1  
- Python: 2.7 (Some native npm libraries need Python to build)

Android FacebookSDK v4.29 has some compatibiliy issue with the latest Android Studio and Gradle, so that this project uses some tricky way to force use older version, setup in build.grade in Android Studio.

## iOS

### Installation

Reference:
https://facebook.github.io/react-native/docs/getting-started.html

Summary Step:
1. install homebrew from https://brew.sh. (terminal: `type brew` to check if you have)
2. brew install node (or you can install v7.9.x from https://nodejs.org/en/, in your terminal, type `node --version` to check your version, should use v7.x)
3. brew install watchman
4. npm install -g react-native-cli
5. install Xcode 8 and its command line tools, follow https://facebook.github.io/react-native/docs/getting-started.html#xcode
6. git clone this project, https://github.com/grimmer0125/Kiteretsu
7. cd into this project folder, `npm install`
8. (optional) `node node_modules/native-base/ejectTheme.js` (native-base)
9. `react-native link` (required by some react native npm libraries)

### (optional) Create your Firebase project if you are not using this project's Firebase project

ref: https://Firebase.google.com/docs/web/setup

1. Create a Firebase project in the [Firebase console](https://console.Firebase.google.com/)
2. Authentication -> Enable Facebook. Then record **Oauth redirect URI** for the following Facebook setting.
3. Click Add Firebase to your web app to get its **config information**.

### Setup Firebase config

modify the following in `firebaseConfig.js`:

    ```
    apiKey: "<API_KEY>",
    authDomain: "<PROJECT_ID>.Firebaseapp.com",
    databaseURL: "https://<DATABASE_NAME>.Firebaseio.com",
    storageBucket: "<BUCKET>.appspot.com",
    messagingSenderId: "<SENDER_ID>",
    ```

### Download Facebook SDK on iOS

ref: https://developers.facebook.com/docs/ios/getting-started/#download

Download Facebook SDK and uncompress it to `~/Documents/FacebookSDK`

### (optional) Create & Setup your Facebook project for iOS project if you are not using this project's Facebook application

Follow this guide: https://developers.facebook.com/docs/ios/getting-started/

Keypoint:
1. After add **Facebook login** in your Facebook Application, need to setup OAuth Redirect URI gotten from **Firebase**.

### How to run in on iDevice simulator
1. in project folder, `npm run ios` or `react-native run-ios`.

### How to run on real iPhone

Steps:
https://facebook.github.io/react-native/docs/running-on-device.html

Start from xcode 7, no need paid developer account to run on real device !! Guide:
http://blog.ionic.io/deploying-to-a-device-without-an-apple-developer-account/


## Android + Mac (will complement later)

Keypoint to setup Facebook:
1. Follow https://developers.facebook.com/docs/android/getting-started
2. Need *a development key hash for the development environment of each person who works on your app.* (cover in 1.)
3. Enable single sign https://developers.facebook.com/docs/facebook-login/android/#expresslogin

### Tips on Android

You need to launch your Android emulator (Android Virtual Device) first, then `npm run android` to install and run. The default React Native command will not launch Android emulator automatically.

You can use the following ways to launch emulators
1. Android Studio
2. In terminal, type `emulator @YOUR_VIRTUAL_DEIVCE` & or change the VIRTUAL_DEIVCE name in `npm script (qemu)` then you can type `npm run qemu` in start your emuator..

It is possible to directly use Android Studio to launch and debug. In this case, you may encounter `Unable to load script from assets 'index.android.bundle'`, the relative discussion: https://stackoverflow.com/questions/44446523/unable-to-load-script-from-assets-index-android-bundle-on-windows/47035389.

### How to debug

Follow https://facebook.github.io/react-native/docs/debugging.html to have remote JS debugging. You can setup breakpoint on Nuclide or chrome debugger.

### Debug React Widget
1. Use Nuclide's "React Native Inspector".
2. or use https://github.com/jhen0409/react-native-debugger. (which introduces it integrates its redux-devtools but not tried successfully). And you can not use it to debug react widget and use http://localhost:8081/debugger-ui to see JavaScript logs at the same time.

### Debug Redux

https://github.com/zalmoxisus/remote-redux-devtools supplies a way to use redux server to get redux'store. It needs

**!! [update] remote-redux-devtools-on-debugger is not compatible with the latest React v0.51 and is removed from this project !!**

1. modify your code. follow https://github.com/zalmoxisus/remote-redux-devtools  or  https://github.com/jhen0409/remote-redux-devtools-on-debugger to setup. I tried the latter's `remote-redux-devtools`'s setting and used its local redux server and integrated react debugging for react native.
2. prepare a local redux server (localhost) or a WAN remote server.
3. Then just use browser to see the redux'store (http://localhost:8000) or use specific web page/app to Redux's store.

You can use `remote-redux-devtools`' guide to prepare your own local server.

Or follow https://github.com/jhen0409/remote-redux-devtools-on-debugger to cover the below 1~3. It comes with a local redux server and also integrates redux with react debugger page. So just use http://localhost:8081/debugger-ui to see React's log and Redux's store at the same time.

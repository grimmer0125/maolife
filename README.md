# maolife

**only tested on Mac. But Android on Windows and Linux should work**

## iOS + Mac
We use the latest React Native 0.43. To build its iOS version, it requires Xcode 8 which only works on Mac 10.12.

### Installation

reference:
https://facebook.github.io/react-native/docs/getting-started.html

Summary Step:
1. install homebrew from https://brew.sh. (terminal: `type brew` to check if you have)
2. brew install node (or you can install v7.9.x from https://nodejs.org/en/, in your terminal, type `node --version` to check your version, should use v7.x)
3. brew install watchman
4. npm install -g react-native-cli
5. install Xcode 8 and its command line tools, follow https://facebook.github.io/react-native/docs/getting-started.html#xcode
6. git clone this project, https://github.com/grimmer0125/maolife
7. cd into this project folder, `npm install`

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

### How to run on read iPhone

Steps:
https://facebook.github.io/react-native/docs/running-on-device.html

Start from xcode 7, no need paid developer account to run on real device !! Guide: 
http://blog.ionic.io/deploying-to-a-device-without-an-apple-developer-account/


## Android + Mac (will complement later)

Mac 10.12 is OK. And Android version needes to be checked if it can run Mac 10.11 or not.

Keypoint to setup Facebook:
1. Follow https://developers.facebook.com/docs/android/getting-started
2. Need *a development key hash for the development environment of each person who works on your app.* (cover in 1.)
3. Enable single sign https://developers.facebook.com/docs/facebook-login/android/#expresslogin

### Tips on Android

You need to launch your Android emulator (Android Virtual Device) first, then `npm run android` to install and run. The default React Native command will not launch Android emulator automatically.

You can use the following ways to launch emulators
1. Android Studio
2. In terminal, type `emulator @YOUR_VIRTUAL_DEIVCE` & or change the VIRTUAL_DEIVCE name in `npm script (qemu)` then you can type `npm run qemu` in start your emuator..

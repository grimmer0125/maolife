# maolife

It has only been developed on Mac. However Windows and Linux should work

## Features, Possible feature backlog, Screenshots 

See the wiki, https://github.com/grimmer0125/maolife/wiki

## app store link

Android store (beta): https://play.google.com/store/apps/details?id=com.lifeoverflow.maolife

iOS: https://itunes.apple.com/us/app/maolife/id1397714182

## UI components

It mainly uses https://nativebase.io/.

## Library Version and environment requirement

The development was setup on 10.12 and has been upgraded to 10.13 with Xcode 9 and latest React version. 10.12 & 10.11 is not tested for the latest code.

- macOS: 10.13.5 (High Sierra)
- Xcode: 9.4 (Its version may affect the versions about React Native and some native npm library)
- Android Studio: 3.1
- Gradle version: 4.1
- Android Gradle plugin version: 3.0.1
- React Native: 0.55.4 (from v0.49, a breaking change is, there is no more index.Android.js and index.iOS.js, only index.js)
- React: 16.3.1 (Its version will affect - native-base and react-navigation)
- native-base: 2.4.5
- react-navigation: 2.0.4.
- react-native-fbsdk: 0.7.0
- FacebookSDK-iOS (need manually download): 4.33.0
- FacebookSDK-Android: 4.33.0  
- Python: 2.7 (Some native npm libraries need Python to build)

### (optional) Create your Firebase project if you are not using this project's Firebase project

ref: https://Firebase.google.com/docs/web/setup

1. Create a Firebase project in the [Firebase console](https://console.Firebase.google.com/)
2. Authentication -> Enable Facebook. Then record **Oauth redirect URI** for the following Facebook setting.
3. Click Add Firebase to your web app to get its **config information**.

## Setup Firebase config

### Firebase web console config

1. Create a project, then choose Realtime Database.
2. Enable Facebook & Email login in Authentication.
3. Change Database rule as the following    
    ```
    {
        "rules": {
            ".read": "auth != null",
            ".write": "auth != null",
            "users":{
              ".indexOn":["KID"]
            }   
        }
    }
    ```

### Change the fields of `firebaseConfig.js`:

    ```
    apiKey: "<API_KEY>",
    authDomain: "<PROJECT_ID>.Firebaseapp.com",
    databaseURL: "https://<DATABASE_NAME>.Firebaseio.com",
    storageBucket: "<BUCKET>.appspot.com",
    messagingSenderId: "<SENDER_ID>",
    ```

## iOS

### Installation

**Node 10 can not be used since one of dependent package, grpc will fail to install**

**It seems that firebae 5.0.4 will let Android built app can not start (Objects are not valid as a React child) but "debug JS remotely" works**

**It seems that if Android Gradle upgrades to 3.1.3 from 3.0.1 and gradle to 4.4 from 4.1, Android Studio will fail to build. (react-native run-android is OK)**

Reference:
https://facebook.github.io/react-native/docs/getting-started.html

Summary Step:
1. install homebrew from https://brew.sh. (terminal: `type brew` to check if you have)
2. brew install node (or you can install Node from https://nodejs.org/en/, in your terminal, type `node --version` to check your version, should use Node 8 or newer)
3. brew install watchman
4. npm install -g react-native-cli
5. install Xcode 9 and its command line tools, follow https://facebook.github.io/react-native/docs/getting-started.html#xcode
6. git clone this project, https://github.com/grimmer0125/Kiteretsu
7. cd into this project folder, `npm install`
8. (optional) `node node_modules/native-base/ejectTheme.js` (native-base)
9. `react-native link` (required by native-base, react-native-vector-icons, react-native-fbsdk, react-native-svg)

### Download Facebook SDK on iOS

ref: https://developers.facebook.com/docs/ios/getting-started/#download

Download Facebook SDK and uncompress it to `~/Documents/FacebookSDK`

### (optional) Config Facebook project on Facebook site and iOS project if you are not using this project's Facebook application settings

Follow this guide: https://developers.facebook.com/docs/react-native/configure-ios

Keypoint:
1. On https://developers.facebook.com/, after adding **Facebook login** in your Facebook Application, you need to setup OAuth Redirect URI gotten from **Firebase**.

### How to run in on iDevice simulator
1. in project folder, `npm run ios` or `react-native run-ios`.

### How to run on real iPhone

Steps:
https://facebook.github.io/react-native/docs/running-on-device.html

Start from xcode 7, no need paid developer account to run on real device !! Guide:
http://blog.ionic.io/deploying-to-a-device-without-an-apple-developer-account/

## Android + Mac (will complement later)

Keypoint to setup Facebook:
1. Follow https://developers.facebook.com/docs/react-native/configure-android-current
2. Need *a development key hash for the development environment of each person who works on your app (cover in 1.).* Release key is needed, too. (This release key is to authorize to use Facebook, not Android release key)
3. Enable single sign https://developers.facebook.com/docs/facebook-login/android/#expresslogin

## Register test users or developers/testers on Facebook developer site

Only the Facebook accounts which are registered on Facebook developer site can login successfully.

### Tips on Android

You need to launch your Android emulator (Android Virtual Device) first, then `npm run android` to install and run. The default React Native command will not launch Android emulator automatically.

You can use the following ways to launch emulators
1. Android Studio
2. In terminal, type `emulator @YOUR_VIRTUAL_DEIVCE` & or change the VIRTUAL_DEIVCE name in `npm script (qemu)` then you can type `npm run qemu` in start your emuator..

It is possible to directly use Android Studio to launch and debug. In this case, you may encounter `Unable to load script from assets 'index.android.bundle'`, the relative discussion: https://stackoverflow.com/questions/44446523/unable-to-load-script-from-assets-index-android-bundle-on-windows/47035389.

## How to debug

Follow https://facebook.github.io/react-native/docs/debugging.html to have remote JS debugging. You can setup breakpoint on Nuclide or chrome debugger.

## Debug React Widget
1. Use Nuclide's "React Native Inspector".
2. Use https://github.com/jhen0409/react-native-debugger. (which also includes redux-devtoolsy). p.s. And you can not use it to debug react widget and use http://localhost:8081/debugger-ui to see JavaScript logs at the same time.
3. Standalone [react-devtools](https://facebook.github.io/react-native/docs/debugging.html#react-developer-tools)

## Debug Redux

https://github.com/zalmoxisus/remote-redux-devtools supplies a way to use redux server to get redux'store. It needs

**!! [201806 update] Just use react-native-debugger and it works. The code already set up the according redux store part (same setting as remote-redux-devtools) !!**

**!! [201712 update] remote-redux-devtools-on-debugger is not compatible with the latest React v0.51 and is removed from this project !!**

1. ~~modify your code. follow https://github.com/zalmoxisus/remote-redux-devtools  or  https://github.com/jhen0409/remote-redux-devtools-on-debugger to setup. I tried the latter's `remote-redux-devtools`'s setting and used its local redux server and integrated react debugging for react native.~~
2. ~~prepare a local redux server (localhost) or a WAN remote server.~~
3. ~~Then just use browser to see the redux'store (http://localhost:8000) or use specific web page/app to Redux's store.~~

~~You can use `remote-redux-devtools`' guide to prepare your own local server.~~

~~Or follow https://github.com/jhen0409/remote-redux-devtools-on-debugger to cover the above 1~3. It comes with a local redux server and also integrates redux with react debugger page. So just use http://localhost:8081/debugger-ui to see React's log and Redux's store at the same time.~~

## Offline build on Devices

`offline` means you can run this app without any dev servers/environment/Mac.

### iOS

1. Choose maolife-release scheme.
2. Connect your iPhone to Mac.
3. Build

possible step: only extra run `npm run ios-offline-jsbundle` before build step if you see `main.jsbundle does not exist` and build fail.

### Android

1. connect your Android device to Mac.
2. use `npm run android-release` to build

possible step: only extra run `npm run android-offline-jsbundle` before build step if you see `unable to load script from assets 'index.android bundle'` and build fail.

## Deploy

iOS:
1. Choose maolife-release scheme.
2. Product -> Archive

Android
1. cd android
2. ./gradlew assembleRelease

import React, { Component } from 'react';
import {
  // Button,
  View,
} from 'react-native';

import { Text, Button } from 'native-base';


// import {
//   StackNavigator,
// } from 'react-navigation';

import { createStackNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import { handleFBLogout } from './actions/userAction';
import Registration from './Registration';

const FBSDK = require('react-native-fbsdk');

const {
  LoginButton,
  LoginManager,
} = FBSDK;

// class MyNotificationsScreen extends React.Component {
//   render() {
//     return (
//       <Button
//         onPress={() => this.props.navigation.goBack()}
//       >
//         <Text>
//           Go back home
//         </Text>
//       </Button>
//     );
//   }
// }

class MySettingsScreen extends Component {
  constructor(props) {
    super(props);

    // this.handleFBLogoutResult = this.handleFBLogoutResult.bind(this);
  }

  // handleFBLogoutResult() {
  //   this.props.dispatch(handleFBLogout());
  // }

  render() {
    const { currentUser } = this.props;

    return (
    // <ScrollView>
    //   {/* <Button
    //     onPress={() => navigation.navigate('NotifSettings')}
    //     title="Go to notification settings"
    //   />
      <View style={{ alignItems: 'center' }}>

        {currentUser.KID === '' ? (<Registration />) : (
          <View>
            <Text>
              {`name: ${currentUser.displayName}`}
            </Text>
            <Text>
              {`KID: ${currentUser.KID}`}
            </Text>
          </View>
        )}
        {/* <LoginButton
          onLogoutFinished={this.handleFBLogoutResult}
        /> */}
        <View>
          <Button
            warning
            onPress={() => {
              // it seems that it will also expire deactivate the same token used with Firebase
              // even if we do not call firebase.auth().signOut,
              // firebase's auth callback will fail for next startup
              LoginManager.logOut();

              this.props.dispatch(handleFBLogout());
            }}
          >
            <Text>
              Log out
            </Text>
          </Button>
        </View>

      </View>

    // </ScrollView>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.currentUser,
});

const MySettingsScreen2 = connect(mapStateToProps)(MySettingsScreen);

const SettingPage = createStackNavigator({
  Settings: {
    screen: MySettingsScreen2,
    // path: '/',
    // wired, is function, not {}
    navigationOptions: () => ({
      title: 'Settings',
    }),
  },
  // NotifSettings: {
  //   screen: MyNotificationsScreen,
  //   navigationOptions: {
  //     title: 'Notification Settings',
  //   },
  // },
});

export default SettingPage;



import React, { Component } from 'react';
import {
  Button,
  ScrollView,
  View,
} from 'react-native';

import {
  StackNavigator,
} from 'react-navigation';

const FBSDK = require('react-native-fbsdk');
const {
  LoginButton,
} = FBSDK;
import { connect } from 'react-redux';
import { handleFBLogout } from './actions/userAction';

class MyNotificationsScreen extends React.Component {
  // static navigationOptions = {
  //   tabBarLabel: 'Notifications',
  //   tabBarIcon: ({ tintColor }) => (
  //     <Image
  //       source={require('./notif-icon.png')}
  //       style={[styles.icon, {tintColor: tintColor}]}
  //     />
  //   ),
  // };

  render() {
    return (
      <Button
        onPress={() => this.props.navigation.goBack()}
        title="Go back home"
      />
    );
  }
}

/* <MyNavScreen
  banner="Settings"
  navigation={navigation}
/> */

class MySettingsScreen extends Component {
  constructor(props) {
    super(props);

    this.handleFBLogoutResult = this.handleFBLogoutResult.bind(this);

  }

  handleFBLogoutResult() {

    console.log("logout action in login:");
    this.props.dispatch(handleFBLogout());
  }

  render() {
    const {navigation} = this.props;

    return (
      <ScrollView>
        <Button
          onPress={() => navigation.navigate('NotifSettings')}
          title="Go to notification settings"
        />
        <Button
          onPress={() => navigation.goBack(null)}
          title="In Setting, Go back"
        />
        <View style={{alignItems: 'center'}}>
          <LoginButton
            onLogoutFinished={this.handleFBLogoutResult}
          />
        </View>

      </ScrollView>
    );
  }

}

const MySettingsScreen2 = connect()(MySettingsScreen);

// const MySettingsScreen = ({ navigation }) => (
//     <ScrollView>
//       <Button
//         onPress={() => navigation.navigate('NotifSettings')}
//         title="Go to notification settings"
//       />
//       <Button
//         onPress={() => navigation.goBack(null)}
//         title="In Setting, Go back"
//       />
//       <LoginButton
//         onLogoutFinished={this.handleFBLogoutResult}
//       />
//     </ScrollView>
// );

const SettingPage = StackNavigator({
  Settings: {
    screen: MySettingsScreen2 ,
    // path: '/',
    // wired, is function, not {}
    navigationOptions: () => ({
      title: 'Settings',
    }),
  },
  NotifSettings: {
    screen: MyNotificationsScreen,
    navigationOptions: {
      title: 'Notification Settings',
    },
  },
});

export default SettingPage;

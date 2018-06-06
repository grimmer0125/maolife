

import React, { Component } from 'react';
import {
  Button,
  ScrollView,
  View,
} from 'react-native';

import { Text } from 'native-base';


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
} = FBSDK;

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

class MySettingsScreen extends Component {
  constructor(props) {
    super(props);

    this.handleFBLogoutResult = this.handleFBLogoutResult.bind(this);
  }

  handleFBLogoutResult() {
    this.props.dispatch(handleFBLogout());
  }

  render() {
    const { currentUser } = this.props;

    return (
    // <ScrollView>
    //   {/* <Button
    //     onPress={() => navigation.navigate('NotifSettings')}
    //     title="Go to notification settings"
    //   />
    //   <Button
    //     onPress={() => navigation.goBack(null)}
    //     title="In Setting, Go back"
    //   /> */}
      <View style={{ alignItems: 'center' }}>
        {currentUser.KID === '' ? (<Registration />) : (
          <View>
            <Text>
              {`hi,${currentUser.displayName}`}
            </Text>
            <Text>
              {`Self's KID: ${currentUser.KID}`}
            </Text>
          </View>
        )}
        <LoginButton
          onLogoutFinished={this.handleFBLogoutResult}
        />
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
  NotifSettings: {
    screen: MyNotificationsScreen,
    navigationOptions: {
      title: 'Notification Settings',
    },
  },
});

export default SettingPage;

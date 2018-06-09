import React, { Component } from 'react';
import { View, Linking } from 'react-native';

import { Text, Button, List, ListItem } from 'native-base';

import { createStackNavigator } from 'react-navigation';
import { connect } from 'react-redux';
import { handleFBLogout } from './actions/userAction';
import Registration from './Registration';

const FBSDK = require('react-native-fbsdk');

const {
  LoginManager,
} = FBSDK;

function TutorialLinks() {
  const links = [
    {
      url: 'https://www.youtube.com/watch?v=uEptzj6G-Jk',
      title: 'How to Measure a Resting Respiratory Rate in a Dog',
    },
    {
      url: 'https://www.youtube.com/watch?v=ZwfQh8ldyGM',
      title: 'Calgary Veterinarian discusses Resting Respiratory Rate and app',
    },
    {
      url: 'https://www.youtube.com/watch?v=f4SBwD4JzFQ',
      title: 'Counting the Resting Respiratory Rate',
    },
    {
      url: 'https://www.youtube.com/watch?v=_TfJhRh-OLA',
      title: '計算犬貓休息時呼吸次數',
    },
  ];
  return (
    <View>
      <List>
        {links.map(item => (
          <ListItem key={item.url}>
            <Text style={{ color: 'blue' }} onPress={() => Linking.openURL(item.url)}>
              {item.title}
            </Text>
          </ListItem>
          ))}
      </List>
    </View>
  );
}

class SettingsScreen extends Component {
  // constructor(props) {
  //   super(props);
  //
  //   // this.handleFBLogoutResult = this.handleFBLogoutResult.bind(this);
  // }

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
          <List>
            <ListItem>
              <Text>
                {`name: ${currentUser.displayName}`}
              </Text>
            </ListItem>
            <ListItem>
              <Text>
                {`KID: ${currentUser.KID}`}
              </Text>
            </ListItem>
            <ListItem
              onPress={() => this.props.navigation.navigate('TutorialLinks')}
            >
              <Text style={{ color: 'red' }}>
                {'Tutorial video links'}
              </Text>
            </ListItem>
          </List>
        )}
        {/* <LoginButton
          onLogoutFinished={this.handleFBLogoutResult}
        /> */}
        <View >
          <Button
            style={{ marginTop: 15 }}
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
    // {/* // </ScrollView> */}
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.currentUser,
});

const ConnectedSettingsScreen = connect(mapStateToProps)(SettingsScreen);

const SettingPage = createStackNavigator({
  Settings: {
    screen: ConnectedSettingsScreen,
    // path: '/',
    navigationOptions: () => ({
      title: 'Settings',
    }),
  },
  TutorialLinks: {
    screen: TutorialLinks,
    navigationOptions: {
      title: 'Tutorial Links',
    },
  },
});

export default SettingPage;

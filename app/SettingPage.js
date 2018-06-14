import React, { Component } from 'react';
import { View, Linking } from 'react-native';

import { Container, Text, Button, List, ListItem } from 'native-base';

import { createStackNavigator } from 'react-navigation';
// import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import Registration from './Registration';
import I18n from './i18n/i18n';

import userActions from './actions/userActions';
import petActions from './actions/petActions';

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
    <Container style={{ backgroundColor: '#F5FCFF' }}>
      <List>
        {links.map(item => (
          <ListItem key={item.url}>
            <Text style={{ color: 'blue' }} onPress={() => Linking.openURL(item.url)}>
              {item.title}
            </Text>
          </ListItem>
          ))}
      </List>
    </Container>
  );
}

class SettingsScreen extends Component {
  // logoutFirebaseResult() {
  //   this.props.dispatch(logoutFirebase());
  // }

  handleEmail = () => {
    this.props.petActions.exportRecords();
  }

  render() {
    const { currentUser } = this.props;

    return (
      <Container style={{
          flex: 1,
          alignItems: 'center',
          backgroundColor: '#F5FCFF',
         }}
      >
        <ListItem onPress={() => this.props.navigation.navigate('TutorialLinks')}>
          <Text style={{ color: 'blue', margin: 10 }}>
            {I18n.t('Tutorial Video Links')}
          </Text>
        </ListItem>

        {currentUser.KID === '' ? (<Registration />) : (
          <List>
            {currentUser.displayName ? (
              <ListItem>
                <Text>
                  {`${I18n.t('Name')}: ${currentUser.displayName}`}
                </Text>
              </ListItem>) : null}
            {currentUser.email ? (
              <ListItem>
                <Text>
                  {`${I18n.t('Email')}: ${currentUser.email}`}
                </Text>
              </ListItem>) : null}
            <ListItem>
              <Text>
                {`KID: ${currentUser.KID}`}
              </Text>
            </ListItem>
          </List>
        )}

        <View style={{ marginTop: 10 }}>
          <Button onPress={this.handleEmail}>
            <Text>
              {I18n.t('Export data via Email')}
            </Text>
          </Button>
        </View>

        <View style={{ marginTop: 10 }}>
          <Button
            warning
            onPress={() => {
              LoginManager.logOut();

              this.props.userActions.logoutFirebase();
            }}
          >
            <Text>
              {I18n.t('Log out')}
            </Text>
          </Button>
        </View>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.currentUser,
});

function mapDispatchToProps(dispatch) {
  return {
    petActions: bindActionCreators(petActions, dispatch),
    userActions: bindActionCreators(userActions, dispatch),
  };
}

const ConnectedSettingsScreen = connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);

const SettingPage = createStackNavigator({
  Settings: {
    screen: ConnectedSettingsScreen,
    // path: '/',
    navigationOptions: () => ({
      title: I18n.t('Settings'),
    }),
  },
  TutorialLinks: {
    screen: TutorialLinks,
    navigationOptions: {
      title: I18n.t('Tutorial Video Links'),
    },
  },
});

export default SettingPage;

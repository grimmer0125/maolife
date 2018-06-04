// 1. login in FB
// 2. At least people need to register a unique KID for sharing cats. May change later, add "ignore"

// FB SDK Ref:
// https://github.com/facebook/react-native-fbsdk/blob/master/sample/HelloFacebook/index.ios.js
import React, { Component } from 'react';
import {
  Text,
  TextInput,
  View,
  Button,
} from 'react-native';

import { connect } from 'react-redux';

import CommonStyles from './styles/common';
import { handleFBLogin, handleFBLogout, registerKID } from './actions/userAction';

const FBSDK = require('react-native-fbsdk');

const {
  LoginButton,
} = FBSDK;

class Login extends Component {
  constructor(props) {
    super(props);

    this.handleFBLoginResult = this.handleFBLoginResult.bind(this);
    this.handleFBLogoutResult = this.handleFBLogoutResult.bind(this);
    this.onButtonPress = this.onButtonPress.bind(this);

    this.state = { registerText: '' };
  }

  onButtonPress() {
    this.props.dispatch(registerKID(this.state.registerText));
  }

  handleFBLoginResult(error, result) {
    console.log('login action result in login page');
    this.props.dispatch(handleFBLogin(error, result));
  }

  handleFBLogoutResult() {
    console.log('logout action restul in login page');
    this.props.dispatch(handleFBLogout());
  }

  // TODO: instead of using native TextInput,
  // use https://github.com/halilb/react-native-textinput-effects
  // example: https://github.com/JamesMarino/Firebase-ReactNative/blob/master/includes/views/login.js

  render() {
    const { user, registerStatus } = this.props;
    const name = user ? user.displayName : '';
    let registerUI = null;

    // TODO improve <TextInput style={{width: 150}}> width part later
    if (user.isLogin) {
      registerUI = (
        <View>
          <Text>
            {registerStatus}
          </Text>
          <TextInput
            style={{ height: 40, width: 300, textAlign: 'center' }}
            placeholder="Please type an ID to register here!"
            onChangeText={registerText => this.setState({ registerText })}
          />
          <Button
            onPress={this.onButtonPress}
            title="Click to register"
            color="#841584"
            accessibilityLabel="Learn more about purple"
          />
        </View>
      );
    }

    return (
      <View style={CommonStyles.container}>
        <LoginButton
          onLoginFinished={this.handleFBLoginResult}
          onLogoutFinished={this.handleFBLogoutResult}
        />
        <Text style={CommonStyles.welcome}>
          {name}
        </Text>
        {registerUI}
      </View>
    );
  }
}

const mapStateToProps = state => ({
  user: state.currentUser,
  registerStatus: state.registerStatus,
});

export default connect(mapStateToProps)(Login);

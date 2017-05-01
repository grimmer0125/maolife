// 1. login in FB
// 2. At least people need to register a unique ID for sharing cats.

// FB SDK Ref:
// https://github.com/facebook/react-native-fbsdk/blob/master/sample/HelloFacebook/index.ios.js
'use strict';

const FBSDK = require('react-native-fbsdk');

import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
} from 'react-native';
const {
  LoginButton,
} = FBSDK;

import { connect } from 'react-redux';

import CommonStyles from './styles/common'
import { handleFBLogin, handleFBLogout, registerMaoID } from './actions/userAction';

class Login extends Component {
  constructor(props) {
    super(props);

    this.handleFBLoginResult = this.handleFBLoginResult.bind(this);
    this.handleFBLogoutResult = this.handleFBLogoutResult.bind(this);
    this.onButtonPress = this.onButtonPress.bind(this);

    this.state = {registerText: ''};
  }

  handleFBLoginResult(error, result) {
    console.log("login action in login")
    this.props.dispatch(handleFBLogin(error, result));
  }

  handleFBLogoutResult() {

    console.log("logout action in login:");
    this.props.dispatch(handleFBLogout());
  }

  onButtonPress() {
    this.props.dispatch(registerMaoID(this.state.registerText));
  }

  //TODO: use https://github.com/halilb/react-native-textinput-effects instead of using native TextInput
  // example: https://github.com/JamesMarino/Firebase-ReactNative/blob/master/includes/views/login.js

  render() {
    const {user} = this.props;
    const name = user?user.displayName:"";
    let registerUI = null;

//    {this.props.registerStatus}

    console.log("user in login:", user)
    //TODO improve <View style={{width: 150}}> width part later
    if (user.isLogin) {
      registerUI = (
        <View style={{width: 150}}>
          <Text>
            hihih
          </Text>
          <TextInput
            style={{height: 40}}
            placeholder="Please Type here to register ID for this app!"
            onChangeText={(registerText) => this.setState({registerText})}
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
          <Button
            onPress={this.onButtonPress}
            title="Click to register"
            color="#841584"
            accessibilityLabel="Learn more about purple"
          />
        </View>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
  registerStatus: state.registerStatus,
});

export default connect(mapStateToProps)(Login);

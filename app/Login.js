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
  View,
} from 'react-native';
const {
  LoginButton,
} = FBSDK;

import { connect } from 'react-redux';

import CommonStyles from './styles/common'
import { handleFBLogin, handleFBLogout } from './actions/userAction';

class Login extends Component {
  constructor(props) {
    super(props);

    this.handleFBLoginResult = this.handleFBLoginResult.bind(this);
    this.handleFBLogoutResult = this.handleFBLogoutResult.bind(this);
  }

  handleFBLoginResult(error, result) {
    console.log("login action in login")
    this.props.dispatch(handleFBLogin(error, result));
  }

  handleFBLogoutResult() {

    console.log("logout action in login:");
    this.props.dispatch(handleFBLogout());
  }

  render() {
    const {user} = this.props;
    const name = user?user.displayName:"";
    return (
        <View style={CommonStyles.container}>
          <Text style={CommonStyles.welcome}>
            {name}
          </Text>
          <LoginButton
            onLoginFinished={this.handleFBLoginResult}
            onLogoutFinished={this.handleFBLogoutResult}
          />
        </View>
    );
  }
}

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps)(Login);

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

import { handleFBLogin } from './actions/userAction';


class Login extends Component {
  constructor(props) {
    super(props);

    this.handleFBLoginResult = this.handleFBLoginResult.bind(this);
  }

  handleFBLoginResult(error, result) {

    this.props.dispatch(handleFBLogin(error, result));
  }

  render() {
    const {user} = this.props;
    const name = user?user.displayName:"";
    return (
        <View style={styles.container}>
          <Text style={styles.welcome}>
            {name}
          </Text>
          <LoginButton
            onLoginFinished={this.handleFBLoginResult}
          />
        </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  shareText: {
    fontSize: 20,
    margin: 10,
  },
});

const mapStateToProps = (state) => ({
  user: state.user,
});

export default connect(mapStateToProps)(Login);

import React, { Component } from 'react';
import { View } from 'react-native';

import { Text, Button } from 'native-base';

import { connect } from 'react-redux';

import { handleFBLogin } from './actions/userAction';
import CommonStyles from './styles/common';
import I18n from './i18n/i18n';

// import { getLanguages } from 'react-native-i18n';
//
// getLanguages().then((languages) => {
//   console.log('languages:');
//   console.log(languages); // ['en-US', 'en']
// });

// FB SDK Ref:
// https://github.com/facebook/react-native-fbsdk/blob/master/sample/HelloFacebook/index.ios.js

class Login extends Component {
  loginPress() {
    this.props.dispatch(handleFBLogin());
  }

  render() {
    return (
      <View style={CommonStyles.container}>

        <Text style={CommonStyles.instruction}>
          {I18n.t('APP_INTRODUCTION')}
        </Text>

        <View>
          <Button
            warning
            onPress={() => {
            this.loginPress();
          }}
          >
            <Text>
              {I18n.t('Log in')}
            </Text>
          </Button>
        </View>
      </View>
    );
  }
}

export default connect()(Login);

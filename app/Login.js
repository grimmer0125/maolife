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

  // TODO: instead of using native TextInput,
  // use https://github.com/halilb/react-native-textinput-effects
  // example: https://github.com/JamesMarino/Firebase-ReactNative/blob/master/includes/views/login.js

  render() {
    // const instructionText =
    // "This app is to daily record pet's (usually cat/dog) breath rate.\
    // Monitoring this can avoid some diseases (e.g. cat's HCM) happen or become worse.\
    // Higher breath rate is a kind of alert";

    return (
      <View style={CommonStyles.container}>

        <Text style={CommonStyles.instruction}>
          This app is to daily record pet's (usually cat/dog) breath rate.
          Monitoring this can avoid some diseases (e.g. cat's HCM) happen or become worse.
          Higher breath rate is a kind of alert. The app uses Facebook authentication.
        </Text>

        {/* <LoginButton
          onLoginFinished={this.handleFBLoginResult}
          onLogoutFinished={this.handleFBLogoutResult}
        /> */}

        <View>
          <Button
            warning
            onPress={() => {
            this.loginPress();
            // LoginManager.logOut();
            // this.props.dispatch(handleFBLogout());
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

// const mapStateToProps = state => ({
//   user: state.currentUser,
//   registerStatus: state.registerStatus,
// });

export default connect()(Login);

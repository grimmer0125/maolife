import React, { Component } from 'react';
import {
  // Text,
  View,
} from 'react-native';

import { Text, Button } from 'native-base';

import { connect } from 'react-redux';

import { handleFBLogin } from './actions/userAction';
import CommonStyles from './styles/common';

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
    // const { user } = this.props;
    // const registerUI = null;

    // TODO improve <TextInput style={{width: 150}}> width part later
    // if (user.isLogin) {
    //   registerUI = (
    //
    //   );
    // }

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
            Log in
            </Text>
          </Button>
        </View>


        {/* {registerUI} */}
      </View>
    );
  }
}

// const mapStateToProps = state => ({
//   user: state.currentUser,
//   registerStatus: state.registerStatus,
// });

export default connect()(Login);

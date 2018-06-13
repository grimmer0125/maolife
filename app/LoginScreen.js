import React, { Component } from 'react';
import { View } from 'react-native';

import { Container, Text, Button, Form, Item, Input, Label } from 'native-base';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import actions from './actions/userAction';
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

class LoginScreen extends Component {
  constructor(props) {
    super(props);

    this.state = { email: null, password: null, loginMode: true };
  }

  loginFBPress() {
    this.props.actions.handleFBLogin();
  }

  loginOrSignUpEmail() {
    // this.props.dispatch(handleFBLogin());
    const { email, password } = this.state;

    if (!email || !password) {
      return;
    }

    if (this.state.loginMode) {
      this.props.actions.signinEmailAccount(email, password);
    } else {
      // sign up
      this.props.actions.signUpEmailAccount(email, password);
    }
  }

  handleChangeEmail = (text) => {
    this.setState({ email: text });
  }

  handleChangePassword = (text) => {
    this.setState({ password: text });
  }

  handleResetPassword = () => {
    if (this.state.email) {
      this.props.actions.resetEmailAccountPassword(this.state.email);
    }
  }

  render() {
    const { email, password, loginMode } = this.state;

    return (
      <Container style={{
          flex: 1,
          alignItems: 'center',
          backgroundColor: '#F5FCFF',
         }}
      >
        <View style={{ marginTop: 70 }}>
          <Text style={CommonStyles.instruction}>
            {I18n.t('APP_INTRODUCTION')}
          </Text>
        </View>
        <View>
          <Button
            warning
            onPress={() => {
            this.loginFBPress();
          }}
          >
            <Text>
              {I18n.t('Log in to Facebook')}
            </Text>
          </Button>
        </View>

        <View
          style={{
            margin: 10,
            width: '66%',
            flexDirection: 'row',
          }}
        >
          <View style={{
            flex: 1,
            borderBottomColor: 'black',
            borderBottomWidth: 1,
            }}
          />
          <View >
            <Text>
              {I18n.t('OR')}
            </Text>
          </View>
          <View style={{
            flex: 1,
            borderBottomColor: 'black',
            borderBottomWidth: 1,
            }}
          />
        </View>
        <View style={{ alignItems: 'center' }}>
          <View style={{ flexDirection: 'row' }}>
            <View>
              <Button
                bordered={loginMode}
                transparent={!loginMode}
                onPress={() => {
                  this.setState({ loginMode: !loginMode });
                }}
              >
                <Text>
                  {I18n.t('Sign in')}
                </Text>
              </Button>
            </View>
            <View>
              <Button
                bordered={!loginMode}
                transparent={loginMode}
                onPress={() => {
                  this.setState({ loginMode: !loginMode });
                }}
              >
                <Text>
                  {I18n.t('Sign up')}
                </Text>
              </Button>
            </View>
          </View>
          <Form style={{ width: 300 }}>
            <Item>
              <Label>{I18n.t('Email')}</Label>
              <Input
                onChangeText={this.handleChangeEmail}
                value={email}
              />
            </Item>
            <Item last>
              <Label>{I18n.t('Password')}</Label>
              <Input
                onChangeText={this.handleChangePassword}
                secureTextEntry
                value={password}
              />
            </Item>
          </Form>
          <View>
            <Button
              onPress={() => {
                this.loginOrSignUpEmail();
              }}
            >
              <Text>
                {loginMode ? I18n.t('Sign in') : I18n.t('Sign up')}
              </Text>
            </Button>
          </View>
          {loginMode ? (
            <View>
              <Button
                small
                transparent
                onPress={this.handleResetPassword}
              >
                <Text>
                  {I18n.t('Reset password')}
                </Text>
              </Button>
            </View>
          ) : null}
        </View>
      </Container>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(null, mapDispatchToProps)(LoginScreen);

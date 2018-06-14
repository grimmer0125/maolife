import React, { Component } from 'react';
import { View } from 'react-native';

import { Container, Content, Text, Button, Form, Item, Input, Label } from 'native-base';

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

    this.state = { password: null, loginMode: true };
    this.emailRef = React.createRef();
  }

  getEmail() {
    return this.emailRef.current._root._lastNativeText;
  }

  loginFBPress() {
    this.props.actions.handleFBLogin();
  }

  loginOrSignUpEmail() {
    const { password } = this.state;

    const email = this.getEmail();

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

  handleChangePassword = (text) => {
    this.setState({ password: text });
  }

  handleResetPassword = () => {
    const email = this.getEmail();

    console.log('in handleResetPassword email:', email);

    if (email) {
      this.props.actions.resetEmailAccountPassword(email);
    }
  }

  render() {
    const { password, loginMode } = this.state;

    return (
      <Container
        style={{
          alignItems: 'center',
          backgroundColor: '#F5FCFF',
         }}
      >
        <Content>
          <View
            style={{
              alignItems: 'center',
             }}
          >
            <View style={{ marginTop: 50 }}>
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
                  autoCapitalize="none"
                  ref={this.emailRef}
                />
              </Item>
              <Item last>
                <Label>{I18n.t('Password')}</Label>
                <Input
                  onChangeText={this.handleChangePassword}
                  autoCapitalize="none"
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
        </Content>
      </Container>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(null, mapDispatchToProps)(LoginScreen);

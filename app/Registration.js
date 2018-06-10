import React, { Component } from 'react';
import { Item, Input, Text, Button, Container, Header, Content, Footer } from 'native-base';
import { View } from 'react-native';
import { connect } from 'react-redux';

import { registerKID, skipRegistration } from './actions/userAction';
import CommonStyles from './styles/common';
import I18n from './i18n/i18n';

class Registration extends Component {
  constructor(props) {
    super(props);

    this.state = { registerText: '' };
  }
  registerButtonPress = () => {
    this.props.dispatch(registerKID(this.state.registerText));
  }

  skipButtonPress = () => {
    this.props.dispatch(skipRegistration());
  }

  render() {
    const { currentUser, registerStatus } = this.props;

    const inMainPage = currentUser.KID || currentUser.KID === '';
    return (
      <View style={{
        // flex: 1,
        // flexDirection: 'column',
        alignItems: 'center',
      }}
      >
        {/* <Header /> */}
        {/* <Content padder> */}
        {currentUser.displayName ? <Text>{currentUser.displayName}</Text> : null}
        <Text style={CommonStyles.welcome}>
          {"Please choose a ID (named KID internally) to let other people can find you and authorize you to manage their pets' health."}
          { inMainPage ? null : 'This step is optional.'}
        </Text>
        <Text>
          {registerStatus ? I18n.t(registerStatus) : null}
        </Text>
        <Item
          regular
          style={{ width: 300 }}
        >
          <Input
            placeholder="KID"
            onChangeText={registerText => this.setState({ registerText })}
          />
        </Item>

        {/* <TextInput
          onChangeText={registerText => this.setState({ registerText })}
        /> */}
        <View
          style={{ marginTop: 10 }}
        >
          <Button
            warning
            onPress={this.registerButtonPress}
          >
            <Text>
              {I18n.t('Register')}
            </Text>
          </Button>
        </View>
        <View
          style={{ marginTop: 10 }}
        >
          {inMainPage ? null : (
            <Button
              onPress={this.skipButtonPress}
            >
              <Text>
                {I18n.t('Skip')}
              </Text>
            </Button>
          )}
        </View>
      </View>

    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.currentUser,
  registerStatus: state.registerStatus,
});

export default connect(mapStateToProps)(Registration);

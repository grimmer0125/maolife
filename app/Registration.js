import React, { Component } from 'react';
import { Item, Input, Text, Button, Container, Header, Content, Footer } from 'native-base';
import { View } from 'react-native';
import { connect } from 'react-redux';

import { bindActionCreators } from 'redux';
import actions from './actions/userActions';
import CommonStyles from './styles/common';
import I18n from './i18n/i18n';

class Registration extends Component {
  constructor(props) {
    super(props);

    this.state = { registerText: '' };
  }
  registerButtonPress = () => {
    this.props.actions.registerKID(this.state.registerText);
  }

  skipButtonPress = () => {
    this.props.actions.skipRegistration();
  }

  render() {
    const { currentUser, registerStatus } = this.props;

    const inMainPage = currentUser.KID || currentUser.KID === '';
    return (
      <View style={{
        alignItems: 'center',
      }}
      >
        {currentUser.displayName ? <Text>{currentUser.displayName}</Text> : null}
        {currentUser.email ? <Text>{currentUser.email}</Text> : null}

        <Text style={CommonStyles.welcome}>
          {I18n.t('REGISTER_INTRODUCTION')}
        </Text>
        <Text>
          {registerStatus ? I18n.t(registerStatus) : null}
        </Text>
        <Item
          regular
          style={{ width: 300 }}
        >
          <Input
            autoCapitalize="none"
            placeholder="KID"
            onChangeText={registerText => this.setState({ registerText })}
          />
        </Item>
        <View
          style={{ marginTop: 15 }}
        >
          <Button
            onPress={this.registerButtonPress}
          >
            <Text>
              {I18n.t('Register')}
            </Text>
          </Button>
        </View>
        <View
          style={{ marginTop: 20 }}
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

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(Registration);

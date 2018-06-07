import React, { Component } from 'react';
import { Container, Header, Content, Footer } from 'native-base';
import {
  Button,
  Text,
  TextInput,
  View,
} from 'react-native';
import { connect } from 'react-redux';

import { registerKID, skipRegistration } from './actions/userAction';
import CommonStyles from './styles/common';

class Registration extends Component {
  constructor(props) {
    super(props);

    // this.onButtonPress = this.onButtonPress.bind(this);

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
            Please choose a ID (named KID internally) to let other people can find you and authorize you to manage their pets' health.
          { inMainPage ? null : 'This step is optional.'}
        </Text>
        <Text>
          {registerStatus}
        </Text>
        <TextInput
          style={{ height: 40, width: 300, textAlign: 'center' }}
          placeholder="Please type an ID to register here!"
          onChangeText={registerText => this.setState({ registerText })}
        />
        <Button
          onPress={this.registerButtonPress}
          title="Register"
          color="#841584"
        />
        {inMainPage ? null : (
          <Button
            onPress={this.skipButtonPress}
            title="Skip"
            color="#841584"
          />)}
      </View>
    //   {/* <Footer />
    // </Container> */}
    );
  }
}

const mapStateToProps = state => ({
  currentUser: state.currentUser,
  registerStatus: state.registerStatus,
});

export default connect(mapStateToProps)(Registration);

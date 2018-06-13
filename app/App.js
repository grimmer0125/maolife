import React, { Component } from 'react';
// import { View } from 'react-native';
import { Container, Text } from 'native-base';

import { connect } from 'react-redux';

import CommonStyles from './styles/common';
import { connectDBtoCheckUser } from './actions/userAction';
import LoginScreen from './LoginScreen';
import MainScreen from './MainScreen';
import RegistrationScreen from './RegistrationScreen';

import I18n from './i18n/i18n';

class App extends Component {
  constructor(props) {
    super(props);

    // ref: initial actions in constructor vs in componentDidMount
    // https://discuss.reactjs.org/t/constructor-vs-componentwillmount-vs-componentdidmount/4287
    // Actually, the rule is: If your initialization depends upon the DOM, use componentDidMount,
    // otherwise use constructor.
    this.props.dispatch(connectDBtoCheckUser());
  }

  render() {
    const { authenticatingWithFirebase, currentUser } = this.props;
    if (authenticatingWithFirebase) {
      // nativebase's text seems to be block so it does not need another <View> to alignItems
      // but Button needs
      return (
        <Container style={{
            flex: 1,
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#F5FCFF',
           }}
        >
          <Text style={CommonStyles.welcome}>
            {`${I18n.t('Loading')}...`}
          </Text>
        </Container>
      );
    }

    if (currentUser && currentUser.isLoggedInWithData) {
      if (currentUser.KID || currentUser.KID === '') {
        return <MainScreen />;
      }

      return <RegistrationScreen />;
    }

    return <LoginScreen />;
  }
}

const mapStateToProps = state => ({
  currentUser: state.currentUser,
  authenticatingWithFirebase: state.authenticatingWithFirebase,
});

export default connect(mapStateToProps)(App);

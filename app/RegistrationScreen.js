import React from 'react';
import { Container } from 'native-base';
import Registration from './Registration';

function RegistrationScreen() {
  return (
    <Container style={{
        flex: 1,
        justifyContent: 'center',
        backgroundColor: '#F5FCFF',
       }}
    >
      <Registration />
    </Container>
  );
}

export default RegistrationScreen;

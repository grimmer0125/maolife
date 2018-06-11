import React from 'react';
import { Container } from 'native-base';
import Registration from './Registration';

function RegistrationScreen() {
  // View style={CommonStyles.container}
  return (
    <Container style={{
        flex: 1,
        justifyContent: 'center',
       }}
    >
      <Registration />
    </Container>
  );
}

export default RegistrationScreen;

import React, { Component } from 'react';
import { View } from 'react-native';
import { Container, Button, Text } from 'native-base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import petActions from './actions/petActions';
import I18n from './i18n/i18n';

class EditRecord extends Component {
 static navigationOptions = () => ({
   title: I18n.t('Edit'),
 });

 onDelete = () => {
   const { petID, recordTime } = this.props.navigation.state.params;

   this.props.petActions.deleteBreathRecord(petID, recordTime);

   this.props.navigation.goBack(null); // .pop(1);
 }

 render() {
   return (

     <Container style={{
         flex: 1,
         justifyContent: 'center',
         alignItems: 'center',
         backgroundColor: '#F5FCFF',
        }}
     >
       <View >
         <Button
           warning
           onPress={this.onDelete}
         >
           <Text>{I18n.t('Delete')}</Text>
         </Button>
       </View>
     </Container>
   );
 }
}


function mapDispatchToProps(dispatch) {
  return { petActions: bindActionCreators(petActions, dispatch) };
}

export default connect(null, mapDispatchToProps)(EditRecord);

import React, { Component } from 'react';
import { View } from 'react-native';
import { Button, Text } from 'native-base';
import { connect } from 'react-redux';
import { deleteBreathRecord } from './actions/petAction';
import I18n from './i18n/i18n';

class EditRecord extends Component {
 static navigationOptions = () => ({
   title: I18n.t('Edit'),
 });

 onDelete = () => {
   const { petID, recordTime } = this.props.navigation.state.params;

   this.props.dispatch(deleteBreathRecord(petID, recordTime));

   this.props.navigation.goBack(null); // .pop(1);
 }

 render() {
   return (
     <View style={{
      flex: 1,
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
     }}
     >
       <View style={{ width: 100, height: 100 }} >
         <Button
           warning
           onPress={this.onDelete}
         >
           <Text>{I18n.t('Delete')}</Text>
         </Button>
       </View>
     </View>
   );
 }
}

export default connect()(EditRecord);

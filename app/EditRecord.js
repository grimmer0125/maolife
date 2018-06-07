import React, { Component } from 'react';
import { View } from 'react-native';
import { Container, Form, Item, Input, Button, Text, Label } from 'native-base';
import { connect } from 'react-redux';
import { deleteBreathRecord } from './actions/petAction';

// import { connect } from 'react-redux';

// import { addNewPet, removeSelfFromPetOwners } from './actions/userAction';
// import { updatePetInfo } from './actions/petAction';

class EditRecord extends Component {
 static navigationOptions = ({ navigation }) => ({
   title: 'Edit',
 });

 constructor(props) {
   super(props);

   // this.state = { name: '', age: '' };
 }

 onDelete = () => {
   const { petID, recordTime } = this.props.navigation.state.params;
   //
   // if (petID) {
   //   this.props.dispatch(removeSelfFromPetOwners(petID));
   // }
   //
   this.props.dispatch(deleteBreathRecord(petID, recordTime));


   this.props.navigation.goBack(null); // .pop(1);
 }

 render() {
   // const {
   //   title, petID, name, age,
   // } = this.props.navigation.state.params;
   // console.log('render in EditPet:', title, petID);
   // // native-base's Input's value is not the normal defitnion, more like initialValue

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
           onPress={this.onDelete}
         >
           <Text>Delete</Text>
         </Button>
       </View>


     </View>
   );
 }
}

export default connect()(EditRecord);

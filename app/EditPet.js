import React, { Component } from 'react';
import { View } from 'react-native';
import { Container, Form, Item, Input, Button, Text, Label } from 'native-base';
import { connect } from 'react-redux';

import { addNewPet, removeSelfFromPetOwners } from './actions/userAction';
import { updatePetInfo } from './actions/petAction';
import I18n from './i18n/i18n';

class EditPet extends Component {
 static navigationOptions = ({ navigation }) => ({
   title: navigation.state.params.title,
 });

 constructor(props) {
   super(props);

   this.state = { name: null, age: null };
 }

 static getDerivedStateFromProps(newProps) {
   const { pet } = newProps.navigation.state.params;
   if (pet) {
     return {
       name: pet.name,
       age: pet.age,
     };
   }
   // https://medium.com/@baphemot/whats-new-in-react-16-3-d2c9b7b6193b
   return null;
 }

  onSave = () => {
    const { pet } = this.props.navigation.state.params;

    if (!pet || !pet.petID) {
      if (!this.state.name || !this.state.age) {
        console.log('no name/age, skip');
        return;
      }

      if (Number.isNaN(this.state.age)) {
        alert(I18n.t('input age is invalid')); // eslint-disable-line no-alert
        return;
      }

      this.props.dispatch(addNewPet(this.state.name, this.state.age));
    } else {
      if (this.state.name === '') {
        console.log('change name to empty is invalid');
        return;
      }

      const info = {};
      if (this.state.name) {
        info.name = this.state.name;
      }

      if (this.state.age !== null) {
        if (Number.isNaN(this.state.age)) {
          alert(I18n.t('input age is invalid')); // eslint-disable-line no-alert
          return;
        }
        info.age = this.state.age;
      }

      this.props.dispatch(updatePetInfo(pet.petID, info));
    }

    this.props.navigation.goBack(null);
  }

  onDelete = () => {
    const { pet } = this.props.navigation.state.params;

    if (pet && pet.petID) {
      this.props.dispatch(removeSelfFromPetOwners(pet.petID));
    }

    this.props.navigation.pop(2);
  }

  // https://github.com/GeekyAnts/ignite-native-base-boilerplate/blob/42a1cc8a9366b5aed191e7f8fcc660788cedcd64/boilerplate/App/Containers/LoginScreen.js
  handleChangeUsername = (text) => {
    this.setState({ name: text });
  }

  handleChangeAge = (text) => {
    this.setState({ age: parseFloat(text, 10) });
  }

  // https://github.com/GeekyAnts/NativeBase-KitchenSink/blob/baa87754f4607d194dd5fc974677011ae51be931/js/components/form/fixedLabel.js
  render() {
    const {
      pet, // , name, age,
    } = this.props.navigation.state.params;

    // petID,
    // age: pet.age,
    // name: pet.name,
    // pet.owners idlist -> name list
    //
    const { users, currentUser } = this.props;

    const ownerList = [];
    ownerList.push(currentUser.KID);
    if (users && pet && pet.owners) {
      for (const ownerID of pet.owners) {
        if (users[ownerID]) {
          ownerList.push(users[ownerID].KID);
        }
      }
    }

    const { name, age } = this.state;

    // NOTE:
    // NativeBase Input's value is not the normal definition is iOS, more like initialValue

    return (
      <Container style={{
          backgroundColor: '#F5FCFF',
         }}
      >        {/* <Content> */}
        <Form>
          {(pet && pet.petID) ? (
            <Item>
              <Label>{`${I18n.t('Owner')} KID: ${ownerList}`}</Label>
            </Item>) : null}
          <Item inlineLabel>
            <Label>{I18n.t('Name')}</Label>
            <Input
              onChangeText={this.handleChangeUsername}
              value={name}
            />
          </Item>
          <Item inlineLabel>
            <Label>{I18n.t('Age')}</Label>
            <Input
              keyboardType="numeric"
              onChangeText={this.handleChangeAge}
              value={age ? age.toString() : null}
            />
          </Item>
        </Form>

        <Button
          style={{ margin: 15, marginTop: 20 }}
          onPress={this.onSave}
        >
          <Text>{I18n.t('Save')}</Text>
        </Button>

        {(pet && pet.petID) ? (
          <View>
            <Button
              style={{ margin: 15, marginTop: 100 }}
              onPress={this.onDelete}
            >
              <Text>{I18n.t('Remove self from Owners')}</Text>
            </Button>
            <Text style={{ color: 'red' }}> {I18n.t('The pet data will be removed too, if you are the only one owner')}</Text>
          </View>
          ) : null}
        {/* </Content> */}
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  users: state.users,
  currentUser: state.currentUser,
});

export default connect(mapStateToProps)(EditPet);

import React, { Component } from 'react';
import { View } from 'react-native';
import { Container, Form, Item, Input, Button, Text, Label } from 'native-base';
import { connect } from 'react-redux';

import { addNewPet, removeSelfFromPetOwners } from './actions/userAction';
import { updateInfo } from './actions/petAction';

class EditPet extends Component {
 static navigationOptions = ({ navigation }) => ({
   title: navigation.state.params.title,
 });

 constructor(props) {
   super(props);

   this.state = { name: '', age: '' };
 }

 // navigation change will not trgger this
 // componentWillReceiveProps(newProps) {
 //   const {
 //     title, petID, name, age,
 //   } = newProps.navigation.state.params;
 //
 //   this.setState({ name });
 // }

  onSave = () => {
    console.log('in add/edit pet page, state:', this.state);

    const { petID } = this.props.navigation.state.params;

    if (!petID) {
      if (!this.state.name || !this.state.age) {
        console.log('no name/age, return');
        return;
      }
      this.props.dispatch(addNewPet(this.state.name, this.state.age));
    } else {
      console.log('save edited pet info');
      const info = {};
      if (this.state.name) {
        info.name = this.state.name;
      }

      if (this.state.age) {
        info.age = this.state.age;
      }

      this.props.dispatch(updateInfo(petID, info));
    }

    this.props.navigation.goBack(null);
  }

  onDelete = () => {
    console.log('clicking delete pet');

    const { petID } = this.props.navigation.state.params;

    if (petID) {
      this.props.dispatch(removeSelfFromPetOwners(petID));
    }

    this.props.navigation.pop(2);
  }

  // https://github.com/GeekyAnts/ignite-native-base-boilerplate/blob/42a1cc8a9366b5aed191e7f8fcc660788cedcd64/boilerplate/App/Containers/LoginScreen.js
  handleChangeUsername = (text) => {
    this.setState({ name: text });
  }

  handleChangeAge = (text) => {
    this.setState({ age: text });
  }

  // https://github.com/GeekyAnts/NativeBase-KitchenSink/blob/baa87754f4607d194dd5fc974677011ae51be931/js/components/form/fixedLabel.js
  render() {
    const {
      title, petID, name, age,
    } = this.props.navigation.state.params;
    console.log('render in EditPet:', title, petID);
    // native-base's Input's value is not the normal defitnion, more like initialValue

    return (
      <Container>
        {/* <Content> */}
        <Form>
          <Item stackedLabel>
            <Label>Name</Label>
            <Input
              onChangeText={this.handleChangeUsername}
              value={name}
            />
          </Item>
          <Item stackedLabel>
            <Label>Age</Label>
            <Input
              onChangeText={this.handleChangeAge}
              value={age}
            />
          </Item>
        </Form>

        <Button
          style={{ margin: 15, marginTop: 20 }}
          onPress={this.onSave}
        >
          <Text>Save</Text>
        </Button>

        {petID ? (
          <View>
            <Button
              style={{ margin: 15, marginTop: 100 }}
              onPress={this.onDelete}
            >
              <Text>Remove self from Owners</Text>
            </Button>
            <Text style={{ color: 'red' }}>The pet data will be removed too, if you are the only one owner</Text>
          </View>
          ) : null}
        {/* </Content> */}
      </Container>
    );
  }
}

export default connect()(EditPet);

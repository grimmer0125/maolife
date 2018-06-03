// import React, { Component } from 'react';
import React, { Component } from 'react';

import { Container, Content, Form, Item, Input, Button, Text, Label } from 'native-base';

import { addNewCat } from './actions/userAction';
import { updateInfo } from './actions/catAction';

import { connect } from 'react-redux';

import {
  StackNavigator,
} from 'react-navigation';

class EditCat extends Component {
 static navigationOptions = ({ navigation }) => ({
   //  title: `Chat with ${navigation.state.params.user}`,
   // title: 'New Cat',
   title: navigation.state.params.title,
   //  headerRight: (
   //    <Button title="Save"
   //      onPress={() => {
   //        //try to save
   //        navigation.goBack(null);
   //      }}
   //    />
   //  ),
 });

 constructor(props) {
   super(props);

   this.state = { name: '', age: '' };
 }

 // not triggered
 // componentWillReceiveProps(newProps) {
 //   const {
 //     title, catID, name, age,
 //   } = newProps.navigation.state.params;
 //
 //   this.setState({ name });
 // }

  // https://github.com/GeekyAnts/ignite-native-base-boilerplate/blob/42a1cc8a9366b5aed191e7f8fcc660788cedcd64/boilerplate/App/Containers/LoginScreen.js
  handleChangeUsername = (text) => {
    this.setState({ name: text });
  }

  handleChangeAge = (text) => {
    this.setState({ age: text });
  }

  onSave = () => {
    console.log('in add/edit cat page, state:', this.state);

    const { catID } = this.props.navigation.state.params;

    if (!catID) {
      if (!this.state.name || !this.state.age) {
        console.log('no name/age, return');
        return;
      }
      this.props.dispatch(addNewCat(this.state.name, this.state.age));
    } else {
      console.log('save edited cat info');
      const info = {};
      if (this.state.name) {
        info.name = this.state.name;
      }

      if (this.state.age) {
        info.age = this.state.age;
      }

      this.props.dispatch(updateInfo(catID, info));
    }

    // we can also chain the two calls together

    // const { username, password } = this.state
    this.props.navigation.goBack(null);
  }

  onDelete = () => {
    console.log('in delete cat page, state:', this.state);

    // this.props.dispatch(addNewCat(this.state.name, this.state.age));

    // we can also chain the two calls together

    // const { username, password } = this.state
    this.props.navigation.goBack(null);
  }


  // https://github.com/GeekyAnts/NativeBase/issues/483
  // username input:
  // onSubmitEditing={ (event) => {
  //               this.refs._root.Password.focus();
  //         }}
  // password input: onSubmit: this.onPressButton();

  // https://github.com/GeekyAnts/NativeBase-KitchenSink/blob/baa87754f4607d194dd5fc974677011ae51be931/js/components/form/fixedLabel.js
  render() {
    const {
      title, catID, name, age,
    } = this.props.navigation.state.params;
    console.log('render in EditCat:', title, catID);
    // native-base's Input's value is not the normal defitnion, more like initialValue
    return (
      <Container>
        {/* <Content> */}
        <Form>
          <Item stackedLabel>
            <Label>Username</Label>
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
          style={{ margin: 15, marginTop: 50 }}
          onPress={this.onSave}
        >
          <Text>Save</Text>
        </Button>
        {catID ? (
          <Button
            style={{ margin: 15, marginTop: 50 }}
            onPress={this.onDelete}
          >
            <Text>Delete</Text>
          </Button>) : null}

        {/* </Content> */}
      </Container>
    );
  }
}

export default connect()(EditCat);

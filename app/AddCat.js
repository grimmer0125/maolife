// import React, { Component } from 'react';
import React, { Component } from 'react';

import { Container, Content, Form, Item, Input, Button, Text } from 'native-base';

import {
  StackNavigator,
} from 'react-navigation';

export default class AddCat extends Component {

 static navigationOptions = ({ navigation }) => ({
   //  title: `Chat with ${navigation.state.params.user}`,
   title: 'New Cat',
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

    this.state = {name:"", age:""};
  }

// https://github.com/GeekyAnts/ignite-native-base-boilerplate/blob/42a1cc8a9366b5aed191e7f8fcc660788cedcd64/boilerplate/App/Containers/LoginScreen.js
  handleChangeUsername = (text) => {
    this.setState({name: text});
  }

  handleChangeAge = (text) => {
    this.setState({age: text});
  }

  onSave = () =>{
    console.log("this.state:", this.state);

    // const { username, password } = this.state
    this.props.navigation.goBack(null);
  }

// https://github.com/GeekyAnts/NativeBase-KitchenSink/blob/baa87754f4607d194dd5fc974677011ae51be931/js/components/form/fixedLabel.js
    render() {
        return (
            <Container>
                <Content>
                    <Form>
                        <Item>
                            {/* <Label>Username</Label> */}
                            <Input placeholder="Name"
                              onChangeText={this.handleChangeUsername}
                            />
                        </Item>
                        <Item last>
                            <Input placeholder="Age"
                              onChangeText={this.handleChangeAge}
                            />
                        </Item>
                    </Form>
                    <Button style={{ margin: 15, marginTop: 50 }}
                      onPress={this.onSave}>
                      <Text>Save</Text>
                    </Button>
                </Content>
            </Container>
        );
    }
}

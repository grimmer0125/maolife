// record number of breath per minute

// maybe one of the tabs, but even decide to do, implement later

import React, { Component } from 'react';
import { Container,
  Content,
  Button,
  Icon,
  Fab,
  Card,
  CardItem,
  Body,
  Form,
  Item,
  Input,
  Right,
  Text,
  ListItem, Radio } from 'native-base';

  import {
    // Text,
    // TextInput,
    View,
    // Button,
  } from 'react-native';

import { connect } from 'react-redux';

import {
  StackNavigator,
} from 'react-navigation';

// import Enum from "es6-enum";

const BUTTON_STATUS_INIT = "Click to Start";
const BUTTON_STATUS_RUNNING = "Click to Cancel";
const BUTTON_STATUS_END = "End";

const TOTAL_SECONDS = 5;

const initialState = {
  buttonStatus: BUTTON_STATUS_INIT,
  seconds: TOTAL_SECONDS,
  numberOfBreath: null,
};

class Record extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'New Record',
  });

  constructor(props) {
    super(props);

    console.log("record init");
    this.state = {
      sleepRadio: true,
      // radio2: false,
      // radio3: false,
      // radio4: true,
      // numberOfBreath: -1,
    };
    this.state = {...initialState};

    // this.resetSeconds();

    this.timerID = -1;
  }

  resetSeconds() {

    console.log("reset !!!!!!!!!!!!!!!")
    this.setState({ ...initialState
    });
  }

  toggleRadio() {
    this.setState({
      sleepRadio: !this.state.sleepRadio,
    });
  }

  inputNumberOfBreach = (text) => {
    this.setState({numberOfBreath: text});
  }

  onSave = () => {

    console.log("submit!!!:", this.state.numberOfBreath);
    this.resetSeconds();
  }

  onCancel = () => {

    console.log("Cancel!!!:", this.state.numberOfBreath);
    this.resetSeconds();
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  startCalibration = () => {
    if (this.state.buttonStatus == BUTTON_STATUS_INIT) {
      this.setState({
        buttonStatus: BUTTON_STATUS_RUNNING,
      });
      //start timer;
      this.timerID = setInterval(()=>{

        console.log("timer !!!!");

        const newSeconds = this.state.seconds-1;
        this.setState({
          seconds: newSeconds,
        });
        if (newSeconds == 0){
          this.setState({
            buttonStatus: BUTTON_STATUS_END,
          });

          //TODO make some vibration on phone for seconds

          //stop timer
          clearInterval(this.timerID);
        }
      }, 1000);
    } else if (this.state.buttonStatus == BUTTON_STATUS_RUNNING) {


      this.resetSeconds();

      //stop timer
      clearInterval(this.timerID);
    }
  }

  render() {
    // if (state.listNav.routes.length>1 && state.listNav.routes[1].params.catID) {

    console.log("new record props:", this.props.navigation.state);
    console.log("current cat:", this.props.currentCat);

    let inputUI = null;

    if (this.state.buttonStatus == BUTTON_STATUS_END) {
      // show input text
      inputUI = (
        // <Container>
        <Card>
          <CardItem>
            {/* <Form> */}
                <Item>
                    {/* <Label>Username</Label> */}
                    <Input placeholder="Input Number of breath"
                      onChangeText={this.inputNumberOfBreach}
                    />
                </Item>
            {/* </Form> */}
              </CardItem>
            {/* <Card> */}
              <CardItem>
                <Button onPress={this.onCancel}>
                    {/* <Icon active name="thumbs-up" /> */}
                    <Text>Cancel</Text>
                </Button>
                <Right>
                  <Button onPress={this.onSave}>
                      {/* <Icon active name="chatbubbles" /> */}
                      <Text>Save</Text>
                  </Button>
                </Right>
              </CardItem>
            {/* </Card> */}
          </Card>
      );
    }

    return (
      <Container>
        <Content>
          <ListItem onPress={() => this.toggleRadio()}>
              <Radio selected={this.state.sleepRadio} onPress={() => this.toggleRadio()}/>
              <Text>睡著時</Text>
          </ListItem>
          <ListItem onPress={() => this.toggleRadio()}>
              <Radio selected={!this.state.sleepRadio} onPress={() => this.toggleRadio()}/>
              <Text>呼吸時</Text>
          </ListItem>
          <Button onPress={this.startCalibration}>
            <Text>{this.state.buttonStatus}</Text>
          </Button>
          <Text>
            {this.state.seconds}
          </Text>
        </Content>
        {inputUI}
      </Container>
    );
  }
}

function extractCatInfo(state) {

  //    state.routes[1].params.catID;

  let cat = {};
  if (state.listNav.routes.length > 1 && state.listNav.routes[1].params.catID) {
    const catID = state.listNav.routes[1].params.catID;

    if (state.cats && state.cats.hasOwnProperty(catID)) {
      cat = {catID, ...state.cats[catID]};
    }
  }

  return cat;

}

const mapStateToProps = (state) => ({
  currentCat: extractCatInfo(state),
});

export default connect(mapStateToProps)(Record);

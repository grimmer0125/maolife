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

import { connect } from 'react-redux';

import {
  StackNavigator,
} from 'react-navigation';

import Enum from "es6-enum";

const BUTTON_STATUS_INIT = "Click to Start";
const BUTTON_STATUS_RUNNING = "Click to Cancel";

class Record extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'New Record',
  });

  constructor(props) {
   super(props);

   this.state = {
      sleepRadio: true,
      // radio2: false,
      // radio3: false,
      // radio4: true,
      buttonStatus: BUTTON_STATUS_INIT,
    };

  }

  toggleRadio() {
   this.setState({
     sleepRadio: !this.state.sleepRadio,
   });
  }

  startCalibration() {
    if (this.state.buttonStatus == BUTTON_STATUS_INIT) {
      this.setState({
        buttonStatus: BUTTON_STATUS_RUNNING,
      });
      //start timer;
    } else if (this.state.buttonStatus == BUTTON_STATUS_RUNNING) {

    }
  }

  render() {
    // if (state.listNav.routes.length>1 && state.listNav.routes[1].params.catID) {

    console.log("new record props:", this.props.navigation.state);
    console.log("current cat:", this.props.currentCat);
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
        </Content>
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

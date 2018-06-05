// record number of breath per minute

import React from 'react';
import {
  Container,
  Content,
  Button,
  Card,
  CardItem,
  Body,
  Item,
  Input,
  Right,
  Text,
  ListItem,
  Radio,
  Label,
} from 'native-base';

import {
  View,
  Vibration,
  Platform,
} from 'react-native';

import { connect } from 'react-redux';

import { newBreathRecord } from './actions/petAction';

const moment = require('moment');

const BUTTON_STATUS_INIT = 'Start Countdown';
const BUTTON_STATUS_RUNNING = 'Cancel';
const BUTTON_STATUS_END = 'End';

const TOTAL_SECONDS = 60;

const initialState = {
  buttonStatus: BUTTON_STATUS_INIT,
  seconds: TOTAL_SECONDS,
  numberOfBreath: null,
};

class Measure extends React.Component {
  static navigationOptions = ({ navigation }) => ({ title: 'Measure' });

  constructor(props) {
    super(props);

    console.log('Measure init');
    this.state = {
      sleepRadio: true,
    };
    this.state = {
      ...initialState,
    };

    this.timerID = -1;
  }

  resetSeconds() {
    console.log('reset seconds and other everything!!');
    this.setState({
      ...initialState,
    });
  }

  toggleRadio() {
    this.setState({
      sleepRadio: !this.state.sleepRadio,
    });
  }

  inputNumberOfBreach = (text) => {
    this.setState({ numberOfBreath: text });
  }

  onSave = () => {
    console.log('on save!!!:', this.state.numberOfBreath);
    console.log('time:', this.inputTime);
    let time;
    if (!this.inputTime) {
      time = moment().unix();
    } else {
      time = moment(this.inputTime).unix();
    }

    let mode = 'sleep';
    if (!this.state.sleepRadio) {
      mode = 'rest';
    }
    // console.log("params:", this.props.navigation.state.params);
    const petID = this.props.navigation.state.params.petID;
    console.log('petID:', petID);

    this.props.dispatch(newBreathRecord(petID, this.state.numberOfBreath, mode, time));

    this.resetSeconds();

    // this.props.navigation.goBack(null);
  }

  onCancel = () => {
    console.log('Cancel! !!:', this.state.numberOfBreath);
    this.resetSeconds();
  }

  componentWillMount() {
    this.endTime = moment().format('YYYY-MM-DD HH:mm');
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  startCalibration = () => {
    if (this.state.buttonStatus === BUTTON_STATUS_INIT) {
      // Start Action
      this.setState({ buttonStatus: BUTTON_STATUS_RUNNING });

      // start timer;
      this.timerID = setInterval(() => {
        console.log('timer !!!!');

        const newSeconds = this.state.seconds - 1;
        this.setState({ seconds: newSeconds });
        if (newSeconds === 0) {
          this.endTime = moment().format('YYYY-MM-DD HH:mm');
          console.log(this.endTime);
          this.setState({ buttonStatus: BUTTON_STATUS_END });

          // make some vibration on phone for seconds
          if (Platform.OS === 'android') {
            const pattern = [0, 500, 200, 500];
            Vibration.vibrate(pattern);
            console.log('Vibration:', pattern);
          } else {
            Vibration.vibrate();
          }

          // stop timer
          clearInterval(this.timerID);
        }
      }, 1000);
    } else if (this.state.buttonStatus === BUTTON_STATUS_RUNNING) {
      // Cancel Action

      this.resetSeconds();

      // stop timer
      clearInterval(this.timerID);
    }
  }

  render() {
    let inputUI = null;

    if (this.state.buttonStatus !== BUTTON_STATUS_RUNNING) {
      // show input text
      const labelStr = `Record time (default is currentTime, ${this.endTime}) Modify it if need be`;
      inputUI = (
      // <Container>
        <Card>
          <CardItem>
            <Body>
              {/* <Form> */}
              <Item stackedLabel>
                <Label>{labelStr}</Label>
                <Input onChangeText={(text) => { this.inputTime = text; }} />
              </Item>
              <Item>
                <Input placeholder="Input Number of breath" onChangeText={this.inputNumberOfBreach} />
              </Item>
              {/* </Form> */}
            </Body>
          </CardItem>
          <CardItem>
            <Button onPress={this.onCancel}>
              <Text>Cancel</Text>
            </Button>
            <Right>
              <Button onPress={this.onSave}>
                <Text>Save</Text>
              </Button>
            </Right>
          </CardItem>
        </Card>);
    }

    return (
      <Container>
        <Content>
          <ListItem onPress={() => this.toggleRadio()}>
            <Radio selected={this.state.sleepRadio} onPress={() => this.toggleRadio()} />
            <Text>sleep mode</Text>
          </ListItem>
          <ListItem onPress={() => this.toggleRadio()}>
            <Radio selected={!this.state.sleepRadio} onPress={() => this.toggleRadio()} />
            <Text>rest mode</Text>
          </ListItem>
          <View style={{
  flex: 1, flexDirection: 'row',
}}
          >
            <Button onPress={this.startCalibration}>
              <Text>{this.state.buttonStatus}</Text>
            </Button>
            <Text>
              {` ${this.state.seconds}s`}
            </Text>
          </View>
        </Content>
        {inputUI}
      </Container>);
  }
}

export default connect()(Measure);

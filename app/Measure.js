import React from 'react';
import {
  Container,
  Content,
  Button,
  Item,
  Input,
  Right,
  Text,
  ListItem,
  Radio,
  Label,
  List,
  Form,
  Left,
} from 'native-base';

import {
  View,
  Vibration,
  Platform,
  TouchableOpacity,
} from 'react-native';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import petActions from './actions/petActions';
import Constant from './Constant';
import I18n from './i18n/i18n';

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
  static navigationOptions = () => ({ title: I18n.t('Measure') });

  constructor(props) {
    super(props);

    this.state = {
      helpCount: 0,
      restRadio: true,
      ...initialState,
    };

    this.timerID = -1;
  }

  resetSeconds() {
    this.setState({
      ...initialState,
    });
  }

  // toggleRadio() {
  //   this.setState({
  //     sleepRadio: !this.state.sleepRadio,
  //   });
  // }

  inputNumberOfBreach = (text) => {
    if (text) {
      this.setState({ numberOfBreath: parseInt(text, 10) });
    } else {
      this.setState({ numberOfBreath: null });
    }
  }

  onSave = () => {
    const { numberOfBreath, helpCount } = this.state;

    if (numberOfBreath === null && helpCount === 0) {
      console.log('can not input zero count');
      return;
    }

    const inputNumber = numberOfBreath || helpCount;

    if (Number.isNaN(inputNumber)) {
      alert(I18n.t('input breath count is invalid')); // eslint-disable-line no-alert
      return;
    }

    let time;
    if (!this.inputTime) {
      time = moment().unix();
    } else {
      time = moment(this.inputTime).unix();
    }
    if (Number.isNaN(time)) {
      alert(I18n.t('input time is invalid')); // eslint-disable-line no-alert
      return;
    }

    let mode = Constant.MODE_REST;
    if (!this.state.restRadio) {
      mode = Constant.MODE_SLEEP;
    }

    const { petID } = this.props.navigation.state.params;

    this.props.petActions.newBreathRecord(petID, inputNumber, mode, time);

    this.resetSeconds();

    this.props.navigation.goBack(null);
  }

  onCancel = () => {
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
      this.resetHelpCount();

      // Start Action
      this.setState({ buttonStatus: BUTTON_STATUS_RUNNING });

      // start timer;
      this.timerID = setInterval(() => {
        const newSeconds = this.state.seconds - 1;
        this.setState({ seconds: newSeconds });
        if (newSeconds === 0) {
          this.endTime = moment().format('YYYY-MM-DD HH:mm');
          this.setState({ buttonStatus: BUTTON_STATUS_END });

          // make some vibration on phone for seconds
          if (Platform.OS === 'android') {
            const pattern = [0, 500, 200, 500];
            Vibration.vibrate(pattern);
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

  selectRestMode=() => {
    this.setState({
      restRadio: true,
    });
  }

  selectSleepMode=() => {
    this.setState({
      restRadio: false,
    });
  }

  resetHelpCount = () => {
    this.setState({
      helpCount: 0,
    });
  }
  addHelpCount = () => {
    const count = this.state.helpCount + 1;
    this.setState({
      helpCount: count,
    });
  }

  render() {
    let inputUI = null;

    if (this.state.buttonStatus !== BUTTON_STATUS_RUNNING) {
      // show input text
      const labelStr = `${I18n.t('Input record time is optoinal and by default it will use currentime')}:${this.endTime}`;
      inputUI = (
        <View>
          <Text
            style={{ margin: 15 }}
          >
            {labelStr}
          </Text>
          <Form>
            <Item inlineLabel>
              <Label>{`${I18n.t('time')}:`}</Label>
              <Input onChangeText={(text) => { this.inputTime = text; }} />
            </Item>
            <Item inlineLabel>
              <Label>{`${I18n.t('breath count')}:`}</Label>
              <Input
                keyboardType="numeric"
                placeholder={this.state.helpCount ? this.state.helpCount.toString() : null}
                onChangeText={this.inputNumberOfBreach}
              />
            </Item>
          </Form>
          <View style={{ flexDirection: 'row' }}>
            <View style={{ margin: 15 }}>
              <Button onPress={this.onCancel}>
                <Text>{I18n.t('Cancel')}</Text>
              </Button>
            </View>
            <View style={{ margin: 15 }}>
              <Button onPress={this.onSave}>
                <Text>
                  {I18n.t('Save')}
                </Text>
              </Button>
            </View>
          </View>
        </View>);
    }

    return (
      <Container style={{ backgroundColor: '#F5FCFF' }}>
        <Content>
          <List
            style={{ backgroundColor: 'white' }}
          >
            <ListItem
              onPress={this.selectRestMode}
            >
              <Left>
                <Text>{I18n.t('rest mode')}</Text>
              </Left>

              <Right>
                <Radio
                  selected={this.state.restRadio}
                  onPress={this.selectRestMode}
                />
              </Right>
            </ListItem>
            <ListItem
              onPress={this.selectSleepMode}
            >
              <Left>
                <Text>{I18n.t('sleep mode')}</Text>
              </Left>

              <Right>
                <Radio
                  selected={!this.state.restRadio}
                  onPress={this.selectSleepMode}
                />
              </Right>
            </ListItem>
          </List>
          <View
            style={{ margin: 15 }}
          >
            <Text>
              {I18n.t('Directly input measured # breaths per minute or click the assisting countdown timer which will trigger a vibration after 1 minute to help your measurement accurate')}
            </Text>
          </View>
          <View style={{
            margin: 15,
            flex: 1,
            flexDirection: 'row',
          }}
          >
            <Button onPress={this.startCalibration}>
              <Text>{I18n.t(this.state.buttonStatus)}</Text>
            </Button>
            <Text>
              {` ${this.state.seconds}s`}
            </Text>
          </View>
          {this.state.buttonStatus === BUTTON_STATUS_RUNNING ? (
            <View style={{ alignItems: 'center' }}>
              <TouchableOpacity
                style={{
                  backgroundColor: '#84D8D0', borderRadius: 125, width: 250, height: 250,
                }}
                onPress={this.addHelpCount}
              >
                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                  <Text>{`${I18n.t('(Optional) Tap here to add 1 count')}:${this.state.helpCount}`}</Text>
                </View>
              </TouchableOpacity>
            </View>) : null}
          {inputUI}
        </Content>
      </Container>);
  }
}

function mapDispatchToProps(dispatch) {
  return { petActions: bindActionCreators(petActions, dispatch) };
}

export default connect(null, mapDispatchToProps)(Measure);

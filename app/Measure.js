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
} from 'native-base';

import {
  View,
  Vibration,
  Platform,
} from 'react-native';

import { connect } from 'react-redux';

import { newBreathRecord } from './actions/petAction';
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
      sleepRadio: true,
    };
    this.state = {
      ...initialState,
    };

    this.timerID = -1;
  }

  resetSeconds() {
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
    if (text) {
      this.setState({ numberOfBreath: parseInt(text, 10) });
    } else {
      this.setState({ numberOfBreath: null });
    }
  }

  onSave = () => {
    if (this.state.numberOfBreath === null) {
      console.log('no input breateRate');
      return;
    }

    if (Number.isNaN(this.state.numberOfBreath)) {
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
    if (this.state.sleepRadio) {
      mode = Constant.MODE_SLEEP;
    }

    const { petID } = this.props.navigation.state.params;

    this.props.dispatch(newBreathRecord(petID, this.state.numberOfBreath, mode, time));

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

  render() {
    let inputUI = null;

    if (this.state.buttonStatus !== BUTTON_STATUS_RUNNING) {
      // show input text
      const labelStr = `${I18n.t('Input record time is optoinal and by default it will use currentime')}:${this.endTime}`;
      inputUI = (
      // <Container>
        <View style={{ marginTop: 10 }}>
          {/* <Separator bordered> */}
          <Text>{labelStr}</Text>
          {/* </Separator> */}
          <Form>
            <Item inlineLabel>
              <Label>{`${I18n.t('time')}:`}</Label>
              <Input onChangeText={(text) => { this.inputTime = text; }} />
            </Item>
            <Item inlineLabel>
              <Label>{`${I18n.t('breath count')}:`}</Label>
              <Input keyboardType="numeric" onChangeText={this.inputNumberOfBreach} />
            </Item>
          </Form>
          <ListItem>
            <Button onPress={this.onCancel}>
              <Text>{I18n.t('Cancel')}</Text>
            </Button>
            <Right>
              <Button onPress={this.onSave}>
                <Text>{I18n.t('Save')}</Text>
              </Button>
            </Right>
          </ListItem>
        </View>);
    }

    return (
      <Container>
        <Content>
          <List
            style={{ backgroundColor: 'white' }}
          >
            <ListItem onPress={() => this.toggleRadio()}>
              <Text>{I18n.t('rest mode')}</Text>
              <Right>
                <Radio selected={!this.state.sleepRadio} />
              </Right>
            </ListItem>
            <ListItem onPress={() => this.toggleRadio()}>
              <Text>{I18n.t('sleep mode')}</Text>
              <Right>
                <Radio selected={this.state.sleepRadio} />
              </Right>
            </ListItem>
          </List>
          <View
            style={{ marginTop: 10 }}
          >
            <Text>
              {I18n.t('Directly input measured # breaths per minute or click the assisting countdown timer which will trigger a vibration after 1 minute to help your measurement accurate')}
            </Text>
          </View>
          <View style={{
            flex: 1, flexDirection: 'row',
          }}
          >
            <Button onPress={this.startCalibration}>
              <Text>{I18n.t(this.state.buttonStatus)}</Text>
            </Button>
            <Text>
              {` ${this.state.seconds}s`}
            </Text>
          </View>
          {inputUI}
        </Content>
      </Container>);
  }
}

export default connect()(Measure);

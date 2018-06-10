import React, { Component } from 'react';

import {
  View,
  FlatList,
} from 'react-native';

import {
  Container, Content, Button, Icon, Fab, Card, CardItem,
  Body, List, ListItem, Item, Input, Left, Right, Text, Separator,
} from 'native-base';

// import CommonStyles from './styles/common';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import actions, { addNewOwner } from './actions/userAction';
import Constant from './Constant';
import RecordChart from './RecordChart';
import I18n from './i18n/i18n';

const moment = require('moment');

const baselineNum = 15;

function extractPetInfo(petID, pets) {
  if (petID && pets && pets.hasOwnProperty(petID)) {
    return { petID, ...pets[petID] };
  }

  return {};
}

const MyTitle = ({ navigation, pets }) => {
  const { petID } = navigation.state.params;
  const pet = pets[petID];

  return (
    <Text>
      {pet.name}
    </Text>
  );
};
const MyConnectedTitle = connect(state => ({ pets: state.pets }))(MyTitle);

class PetDetail extends Component {
  static navigationOptions = ({ navigation }) => ({
    headerTitle: (
      <MyConnectedTitle
        navigation={navigation}
      />
    ),
    headerRight: (
      <Button
        transparent
        onPress={() => navigation.navigate('Measure', {
          petID: navigation.state.params.petID,
        })}
      >
        <Text>
          {I18n.t('Measure')}
        </Text>
      </Button>
    ),
  });

  constructor(props) {
    super(props);

    this.state = {
      active: false,
      shareDialog: false,
      authID: '',
    };
  }

  onSave = () => {
    this.props.dispatch(addNewOwner(this.props.navigation.state.params.petID, this.state.authID));

    this.setState({ shareDialog: false });
  }

  onCancel = () => {
    this.setState({ shareDialog: false });
  }

  handleChangeAuthID = (text) => {
    this.setState({ authID: text });
  }

  eachRowItem = (pet, time) => {
    let prefixToday = '';
    if (moment(time * 1000).isSame(moment(), 'day')) {
      prefixToday = ', Today';
    }
    let modeText = 'rest';
    if (pet.breathRecord[time].mode === Constant.MODE_SLEEP) {
      modeText = 'sleep';
    }
    const text = `${moment(time * 1000).format('YYYY-MM-DD HH:mm') + prefixToday
    } \n${I18n.t(modeText)}                           ${pet.breathRecord[time].breathRate}`;

    return (
      <ListItem
        onPress={() => {
        this.props.navigation.navigate('EditRecord', {
          petID: pet.petID,
          recordTime: time,
        });
      }}
      >
        <Text>{text}
        </Text>
      </ListItem>
    );
  }

  calculateStats(breathRecord, recordTimeList) {
    // const t0 = performance.now();

    let sleepTotal = 0;
    let countSleep = 0;
    let restTotal = 0;
    let countRest = 0;

    const sleepList = [];
    const restList = [];

    if (breathRecord) {
      for (const key of recordTimeList) {
        const record = breathRecord[key];
        if (record.mode === Constant.MODE_REST) {
          restList.push({
            x: new Date(key * 1000),
            y: record.breathRate,
          });
          countRest += 1;
          restTotal += record.breathRate;
        } else if (record.mode === Constant.MODE_SLEEP) {
          sleepList.push({
            x: new Date(key * 1000),
            y: record.breathRate,
          });
          countSleep += 1;
          sleepTotal += record.breathRate;
        }
      }
    }

    const numTotal = countRest + countSleep;
    const info = {
      dataSleep: sleepList,
      dataRest: restList,
      countRest,
      countSleep,
      sleepAvg: countSleep ? sleepTotal / countSleep : 0,
      restAvg: countRest ? restTotal / countRest : 0,
      mixAvg: numTotal ? (sleepTotal + restTotal) / numTotal : 0,
      sleepHeadAvg: 0,
      sleepTailAvg: 0,
      restHeadAvg: 0,
      restTailAvg: 0,
    };

    if (countSleep > baselineNum) {
      let total = 0;
      for (let i = 0; i < baselineNum; i += 1) {
        total += sleepList[i].y;
      }
      info.sleepHeadAvg = (total / baselineNum).toFixed(1);

      total = 0;
      for (let i = 0; i < baselineNum; i += 1) {
        total += sleepList[countSleep - 1 - i].y;
      }
      info.sleepTailAvg = (total / baselineNum).toFixed(1);
    }

    // TODO: two similar blocks become a function
    if (countRest > baselineNum) {
      let total = 0;
      for (let i = 0; i < baselineNum; i += 1) {
        total += restList[i].y;
      }
      info.restHeadAvg = (total / baselineNum).toFixed(1);

      total = 0;
      for (let i = 0; i < baselineNum; i += 1) {
        total += restList[countSleep - 1 - i].y;
      }
      info.restTailAvg = (total / baselineNum).toFixed(1);
    }

    // const t1 = performance.now();
    // console.log(`Call to calculateStats took ${t1 - t0} milliseconds.`);

    return info;
  }

  naviToEditPet(pet) {
    // Fetch each owner's displayName
    if (pet.owners) {
      this.props.actions.fetchOwnerData(pet.owners);
    }

    this.props.navigation.navigate('EditPet', {
      title: '',
      pet,
    });
  }

  keyExtractor = item => item;

  render() {
    const { pets, navigation } = this.props;
    const { petID } = navigation.state.params;
    const pet = extractPetInfo(petID, pets);

    if (this.state.shareDialog) {
      return (
        <Container>
          <Card>
            <CardItem>
              <Body>
                <Text>
                  {I18n.t("Input your friend's KID to authorize him/her")}
                </Text>
              </Body>
            </CardItem>
            <CardItem cardBody>
              {/* <Form> */}
              <Item regular>
                <Input
                  onChangeText={this.handleChangeAuthID}
                  onSubmitEditing={() => {
                              this.onSave();
                            }}
                />
              </Item>
              {/* </Form> */}
            </CardItem>

            <CardItem>
              <Button onPress={this.onCancel}>
                <Text>{I18n.t('Cancel')}</Text>
              </Button>
              <Right>
                <Button onPress={this.onSave}>
                  <Text>{I18n.t('Save')}</Text>
                </Button>
              </Right>
            </CardItem>
          </Card>
        </Container>
      );
    }

    let recordTimeList = [];
    let stats = null;
    if (pet.hasOwnProperty('breathRecord')) {
      const keys = Object.keys(pet.breathRecord);

      // const t0 = performance.now();
      keys.sort((a, b) => b - a);
      // const t1 = performance.now();
      // console.log(`Call to sort took ${t1 - t0} milliseconds.`);

      recordTimeList = keys;

      stats = this.calculateStats(pet.breathRecord, recordTimeList);
    }

    // fab:
    // https://github.com/GeekyAnts/NativeBase-KitchenSink/blob/master/js/components/fab/basic.js
    // https://github.com/GeekyAnts/NativeBase/issues/372
    // fab should be outside content
    const firstText = I18n.t('first');
    const lastText = I18n.t('last');
    const avgText = I18n.t('AVG');
    return (
      <Container>
        <Content>
          <List enableemptysections style={{ backgroundColor: 'white' }}>
            <ListItem
              onPress={() => this.naviToEditPet(pet)}
            >
              <Left>
                <Text>{I18n.t('Edit')}</Text>
              </Left>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
          </List>
          <Separator bordered>
            <Text>{I18n.t('Stats & Chart')}</Text>
          </Separator>
          <View>
            <ListItem>
              <Text style={{ color: '#FF6347' }}>{stats ? `${I18n.t('Rest CNT')}:${stats.countRest}, ${firstText}${baselineNum}${avgText}:${stats.restHeadAvg}, ${lastText}${baselineNum}${avgText}:${stats.restTailAvg}` : ''}</Text>
            </ListItem>
            <ListItem>
              <Text style={{ color: 'blue' }}>{stats ? `${I18n.t('Sleep CNT')}:${stats.countSleep}, ${firstText}${baselineNum}${avgText}:${stats.sleepHeadAvg}, ${lastText}${baselineNum}${avgText}:${stats.sleepTailAvg}` : ''}</Text>
            </ListItem>
            {stats ? <RecordChart stats={stats} /> : null}
          </View>
          <Separator bordered>
            <Text>{I18n.t('Records (1:mode 2:frequency per minute)')}</Text>
          </Separator>
          <View>
            <FlatList
              keyExtractor={this.keyExtractor}
              data={recordTimeList}
              renderItem={({ item }) => (
                this.eachRowItem(pet, item)
                // <SwipeRow
                //   rightOpenValue={-75}
                //   body={this.eachRowItem(pet, item)}
                //   right={
                //     <Button danger onPress={() => this.removeItem(pet.petID, item)}>
                //       <Icon active name="trash" />
                //     </Button>
                //           }
                // />
              )}
            />
          </View>
        </Content>

        <Fab
          active={this.state.active}
          direction="up"
          containerStyle={{}}
          style={{ backgroundColor: '#5067FF' }}
          position="bottomRight"
          onPress={() => {
            this.setState({ active: !this.state.active });
            this.setState({ shareDialog: true });
          }}
        >
          <Icon name="share" />
        </Fab>
      </Container>

    );
  }
}

const mapStateToProps = state => ({
  pets: state.pets,
});

function mapDispatchToProps(dispatch) {
  return { actions: bindActionCreators(actions, dispatch) };
}

export default connect(mapStateToProps, mapDispatchToProps)(PetDetail);

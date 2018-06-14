import React, { Component } from 'react';

import {
  View,
  FlatList,
  Text as SystemText,
  Button as SystemButton,
} from 'react-native';

import {
  Container, Content, Icon, Fab,
  List, ListItem, Left, Right, Text, Separator,
} from 'native-base';

import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import actions from './actions/userAction';
import Constant from './Constant';
import RecordChart from './RecordChart';
import ShareDialog from './ShareDialog';
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
  let pet = null;
  if (pets[petID]) {
    pet = pets[petID];
  }
  return (
    <SystemText>
      {(pet && pet.name) ? pet.name : null}
    </SystemText>
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
      <SystemButton
        onPress={() => navigation.navigate('Measure', {
          petID: navigation.state.params.petID,
        })}
        title={I18n.t('Measure')}
      />
    ),
  });

  constructor(props) {
    super(props);

    this.state = {
      active: false,
      showShareDialog: false,
    };
  }

  onSave = (authID) => {
    this.props.actions.addNewOwner(this.props.navigation.state.params.petID, authID);

    this.setState({ showShareDialog: false });
  }

  onCancel = () => {
    this.setState({ showShareDialog: false });
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

  calRegion(count, modeList, numOfBaseline) {
    let headAvg = 0;
    let tailAvg = 0;
    if (count > numOfBaseline) {
      let total = 0;
      for (let i = 0; i < numOfBaseline; i += 1) {
        total += modeList[i].y;
      }
      headAvg = (total / numOfBaseline).toFixed(1);

      total = 0;
      for (let i = 0; i < numOfBaseline; i += 1) {
        total += modeList[count - 1 - i].y;
      }
      tailAvg = (total / numOfBaseline).toFixed(1);
    }

    return { headAvg, tailAvg };
  }

  // TODO: use info = {sleep:{}, rest:{}} to avoid similar naming
  calculateStats(breathRecord, recordTimeList) {
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

    const { headAvg, tailAvg } = this.calRegion(countRest, restList, baselineNum);
    info.restHeadAvg = headAvg;
    info.restTailAvg = tailAvg;

    const avgSleep = this.calRegion(countSleep, sleepList, baselineNum);
    info.sleepHeadAvg = avgSleep.headAvg;
    info.sleepTailAvg = avgSleep.tailAvg;

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

    if (this.state.showShareDialog) {
      return <ShareDialog onSave={this.onSave} onCancel={this.onCancel} />;
    }

    let recordTimeList = [];
    let stats = null;
    if (pet.hasOwnProperty('breathRecord')) {
      const keys = Object.keys(pet.breathRecord);

      keys.sort((a, b) => b - a);

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
            <Text>{I18n.t('Records (1: mode 2: # breaths per minute)')}</Text>
          </Separator>
          <View>
            <FlatList
              keyExtractor={this.keyExtractor}
              data={recordTimeList}
              renderItem={({ item }) => (
                this.eachRowItem(pet, item)
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
            this.setState({ showShareDialog: true });
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

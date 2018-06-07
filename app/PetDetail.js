import React, { Component } from 'react';

import {
  ListView,
  Button as SystemButton,
  View,
  FlatList,
} from 'react-native';

import { VictoryLegend, VictoryVoronoiContainer, VictoryTooltip, VictoryGroup, VictoryBar, VictoryLine, VictoryChart, VictoryTheme } from 'victory-native';

import {
  Container, Content, Button, Icon, Fab, Card, CardItem,
  Body, List, ListItem, SwipeRow, Item, Input, Left, Right, Text, Separator,
} from 'native-base';

// import CommonStyles from './styles/common';
import { connect } from 'react-redux';
import { addNewOwner } from './actions/userAction';
import Constant from './Constant';

const moment = require('moment');

// TODO: also change the name of sleepHeadAvg etc
const baselineNum = 15;


function extractPetInfo(petID, pets) {
  if (petID && pets && pets.hasOwnProperty(petID)) {
    return { petID, ...pets[petID] };
  }

  return {};
}

class PetDetail extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.name,
    headerRight: (
      <SystemButton
        title="Measure"
        onPress={() => navigation.navigate('Measure', {
          petID: navigation.state.params.petID,
        })}
      />
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

  // removeItem(petID, recordTime) {
  //   this.props.dispatch(deleteBreathRecord(petID, recordTime));
  // }
  //
  // // s1, index(0~x), key=s1+index
  // deleteRow = (petID, secId, rowId, rowMap) => {
  //   rowMap[`${secId}${rowId}`].props.closeRow();
  //   const recordTime = rowMap[`${secId}${rowId}`].props.body.key;
  //
  //   this.props.dispatch(deleteBreathRecord(petID, recordTime));
  // }

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
    } \n${pet.breathRecord[time].breathRate}/min, mode:${modeText}`;

    return (
    // <Card transparent style={{ flex: 0 }}>
    // key is not necessary in NativeBase's listItem but it can be used in deleteRow(body.key)
      <ListItem
        key={time}
        onPress={() => {
        this.props.navigation.navigate('EditRecord', {
          petID: pet.petID,
          recordTime: time,
        });
      }}
      >
        {/* <CardItem header>
    //     <Text>{moment(time * 1000).format('YYYY-MM-DD HH:mm') + prefixToday}</Text>
    //   </CardItem> */}
        {/* <CardItem> */}
        {/* Instead of Body, View can be used too */}
        {/* <View> */}
        <Text>{text}
        </Text>
        {/* <Text>
        </Text> */}
        {/* </View> */}
        {/* </CardItem> */}
        {/* </Card> */}
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

    // TODO: become a function
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

  getChartUI(stats) {
    const { dataSleep, dataRest } = stats;
    // pet.breathRecord
    // const dataSleep = [];
    // const dataRest = [];
    // if (pet.breathRecord) {
    //   for (const key in pet.breathRecord) {
    //     const record = pet.breathRecord[key];
    //
    //     if (record.mode === 'sleep') {
    //       dataSleep.push({
    //         x: new Date(key * 1000),
    //         y: parseInt(record.breathRate, 10),
    //       });
    //     } else if (record.mode === 'rest') {
    //       dataRest.push({
    //         x: new Date(key * 1000),
    //         y: parseInt(record.breathRate, 10),
    //       });
    //     }
    //   }
    // }

    // console.log('getChartUI, data count:', dataSleep.length, dataRest.length);

    return (
      // example:
      // http://formidable.com/open-source/victory/docs/victory-line/
      // https://formidable.com/open-source/victory/gallery/brush-zoom/
      // https://codesandbox.io/embed/vyykx3jp77

      // <VictoryChart
      //   theme={VictoryTheme.material}
      // >
      //   <VictoryLine
      //     style={{
      //       data: { stroke: '#c43a31' },
      //       parent: { border: '1px solid #ccc' },
      //     }}
      //     data={[
      //       { x: 1, y: 2 },
      //       { x: 2, y: 3 },
      //       { x: 3, y: 5 },
      //       { x: 4, y: 4 },
      //       { x: 5, y: 7 },
      //     ]}
      //   />
      // </VictoryChart>

      <VictoryChart
        scale={{ x: 'time' }}
        containerComponent={
          <VictoryVoronoiContainer
            labels={d => `x:${d.x}\ny:${d.y}`}
          />
        }
      >
        <VictoryLegend
          title="AVG"
          x={200}
          y={50}
          centerTitle
          orientation="horizontal"
          gutter={20}
          style={{ title: { fontSize: 10 } }}
          data={[
            { name: stats.restAvg.toFixed(1), symbol: { fill: 'tomato', type: 'star' } },
            { name: stats.sleepAvg.toFixed(1), symbol: { fill: 'blue' } },
          ]}
        />
        {(dataSleep && dataSleep.length >= 2) ? (
          <VictoryLine
            labelComponent={<VictoryTooltip />}
            style={{
            data: { stroke: 'blue' },
          }}
            data={dataSleep}
          />) : null}
        {(dataRest && dataRest.length >= 2) ? (
          <VictoryLine
            labelComponent={<VictoryTooltip />}
            style={{
            data: { stroke: 'tomato' },
            parent: { border: '20px solid #ccc' },
          }}
            data={dataRest}
          />) : null}
      </VictoryChart>
    );
  }

  _keyExtractor = (item, index) => item;

  render() {
    const { pets, navigation } = this.props;
    const petID = navigation.state.params.petID;
    const pet = extractPetInfo(petID, pets);

    if (this.state.shareDialog) {
      return (
        <Container>
          {/* <View> */}
          <Card>
            <CardItem>
              <Body>
                <Text>
                    Input your friend's KID to authorize him/her
                </Text>
              </Body>
            </CardItem>
            <CardItem cardBody>
              {/* <Form> */}
              <Item regular>
                <Input
                  // placeholder="your friend's kid"
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
                <Text>Cancel</Text>
              </Button>
              <Right>
                <Button onPress={this.onSave}>
                  <Text>Save</Text>
                </Button>
              </Right>
            </CardItem>

          </Card>
          {/* </View> */}
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
    return (
      <Container>
        <Content>
          {/* <Separator bordered>
            <Text>Stats & Setting</Text>
          </Separator> */}
          <List enableemptysections style={{ backgroundColor: 'white' }}>
            <ListItem
              onPress={() => this.props.navigation.navigate('EditPet', {
                title: 'Edit Pet',
                petID,
                age: pet.age,
                name: pet.name,
              })}
            >
              <Left>
                <Text>Edit</Text>
              </Left>
              <Right>
                <Icon name="arrow-forward" />
              </Right>
            </ListItem>
            {/* <ListItem>
                <Text>{stats ? `Mix Avg: ${stats.mixAvg.toFixed(1)}` : 'no stats data'}</Text>
            </ListItem> */}
            {/* <ListItem>
              <Text>{stats ? `Rest count:${stats.countRest}, first20AVG:${stats.restHeadAvg}, last20AVG:${stats.restTailAvg}, AVG:${stats.restAvg.toFixed(1)}` : ''}</Text>
            </ListItem>
            <ListItem>
              <Text>{stats ? `Sleep count:${stats.countSleep}, first20AVG:${stats.sleepHeadAvg}, last20AVG:${stats.sleepTailAvg}, AVG: ${stats.sleepAvg.toFixed(1)}` : ''}</Text>
            </ListItem> */}
          </List>
          <Separator bordered>
            <Text>Stats & Chart </Text>
          </Separator>
          <View>
            <ListItem>
              <Text style={{ color: '#FF6347' }}>{stats ? `Rest CNT:${stats.countRest}, first${baselineNum}AVG:${stats.restHeadAvg}, last${baselineNum}AVG:${stats.restTailAvg}` : ''}</Text>
            </ListItem>
            <ListItem>
              <Text style={{ color: 'blue' }}>{stats ? `Sleep CNT:${stats.countSleep}, first${baselineNum}AVG:${stats.sleepHeadAvg}, last${baselineNum}AVG:${stats.sleepTailAvg}` : ''}</Text>
            </ListItem>
            {stats ? this.getChartUI(stats) : null}
          </View>
          <Separator bordered>
            <Text>Records</Text>
          </Separator>
          <View>
            <FlatList
              keyExtractor={this._keyExtractor}
              data={recordTimeList}
              renderItem={({ item }) => (
                this.eachRowItem(pet, item)
                // <SwipeRow
                //   // leftOpenValue={75}
                //   rightOpenValue={-75}
                //   // left={
                //   //   <Button success onPress={() => alert(item.value)} >
                //   //     <Icon active name="add" />
                //   //   </Button>
                //   //         }
                //   body={this.eachRowItem(pet, item)}
                //   right={
                //     <Button danger onPress={() => this.removeItem(pet.petID, item)}>
                //       <Icon active name="trash" />
                //     </Button>
                //           }
                // />
              )}
            />

            {/* // TODO: it seems to be slow when number of Row is 122.
            // Use Flatlist/pagination instead. */}
            {/* <List
              dataSource={this.ds.cloneWithRows(recordTimeList)}
              renderRow={record =>
              this.eachRowItem(pet, record)}
            // renderLeftHiddenRow={record =>
            //   (<Button full onPress={() => alert(record)}>
            //     <Icon active name="information-circle" />
            //    </Button>)}
              disableRightSwipe
              renderRightHiddenRow={(record, secId, rowId, rowMap) =>
              (<Button full danger onPress={_ => this.deleteRow(pet.petID, secId, rowId, rowMap)}>
                <Icon active name="trash" />
               </Button>)}
            // leftOpenValue={275}
              rightOpenValue={-75}
            /> */}
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

export default connect(mapStateToProps)(PetDetail);

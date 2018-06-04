import React, { Component } from 'react';

import {
  ListView,
  Button as SystemButton,
  View,
} from 'react-native';

import { Container, Content, Button, Icon, Fab, Card, CardItem,
  Body, List, ListItem, Item, Input, Left, Right, Text, Separator } from 'native-base';

// import CommonStyles from './styles/common';
import { connect } from 'react-redux';
import { leaveCatDetail, addNewOwner } from './actions/userAction';
import { deleteBreathRecord } from './actions/catAction';

const moment = require('moment');

function extractCatInfo(catID, cats) {
  if (catID && cats && cats.hasOwnProperty(catID)) {
    return { catID, ...cats[catID] };
  }

  return {};
}

class CatDetail extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    title: navigation.state.params.name,
    headerRight: (
      <SystemButton
        title="Measure"
        onPress={() => navigation.navigate('Measure', {
          catID: navigation.state.params.catID,
        })}
      />
    ),
  });

  constructor(props) {
    super(props);

    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

    this.state = {
      active: false,
      shareDialog: false,
      authID: '',
    };
  }

  componentWillUpdate() {
    console.log('detail will udpate');
  }

  onSave = () => {
    this.props.dispatch(addNewOwner(this.props.navigation.state.params.catID, this.state.authID));

    this.setState({ shareDialog: false });
  }

  onCancel = () => {
    this.setState({ shareDialog: false });
  }

  handleChangeAuthID = (text) => {
    this.setState({ authID: text });
  }

  // s1, index(0~x), key=s1+index
  deleteRow = (catID, secId, rowId, rowMap) => {
    rowMap[`${secId}${rowId}`].props.closeRow();
    const recordTime = rowMap[`${secId}${rowId}`].props.body.key;

    this.props.dispatch(deleteBreathRecord(catID, recordTime));
  }

  eachRowItem = (cat, time) => {
    let prefixToday = '';
    if (moment(time * 1000).isSame(moment(), 'day')) {
      prefixToday = ', Today';
    }

    return (
      // <Card transparent style={{ flex: 0 }}>
      // key is not necessary in NativeBase's listItem but it can be used in deleteRow(body.key)
      <ListItem key={time}>
        {/* <CardItem header>
          <Text>{moment(time * 1000).format('YYYY-MM-DD HH:mm') + prefixToday}</Text>
        </CardItem> */}
        {/* <CardItem> */}
        {/* Instead of Body, View can be used too */}
        <Body>
          <Text>{moment(time * 1000).format('YYYY-MM-DD HH:mm') + prefixToday}</Text>
          <Text>
            {`${cat.breathRecord[time].breathRate}/min, mode:${cat.breathRecord[time].mode}`}
          </Text>
        </Body>
        {/* </CardItem> */}
        {/* </Card> */}
      </ListItem>
    );
  }

  calculateStats(breathRecord, recordTimeList) {
    const t0 = performance.now();

    let sleepTotal = 0;
    let numSleep = 0;
    let restTotal = 0;
    let numRest = 0;

    const sleepList = [];
    const restList = [];

    if (breathRecord) {
      for (const key of recordTimeList) {
        const record = breathRecord[key];
        if (record.mode === 'sleep') {
          sleepList.push(parseInt(record.breathRate));
          numSleep++;
          sleepTotal += parseInt(record.breathRate);
        } else if (record.mode === 'rest') {
          restList.push(parseInt(record.breathRate));
          numRest++;
          restTotal += parseInt(record.breathRate);
        }
      }
    }

    const numTotal = numRest + numSleep;
    const info = {
      numRest,
      numSleep,
      sleepAvg: numSleep ? sleepTotal / numSleep : 0,
      restAvg: numRest ? restTotal / numRest : 0,
      mixAvg: numTotal ? (sleepTotal + restTotal) / numTotal : 0,
      sleepFirst20Avg: '',
      sleepLast20Avg: '',
      restFirst20Avg: '',
      restLast20Avg: '',
    };

    // TODO: become a function
    if (numSleep > 20) {
      let total = 0;
      for (let i = 0; i < 20; i++) {
        total += sleepList[i];
      }
      info.sleepFirst20Avg = (total / 20).toFixed(2);

      total = 0;
      for (let i = 0; i < 20; i++) {
        total += sleepList[numSleep - 1 - i];
      }
      info.sleepLast20Avg = (total / 20).toFixed(2);
    }

    if (numRest > 20) {
      let total = 0;
      for (let i = 0; i < 20; i++) {
        total += restList[i];
      }
      info.restFirst20Avg = (total / 20).toFixed(2);

      total = 0;
      for (let i = 0; i < 20; i++) {
        total += restList[numSleep - 1 - i];
      }
      info.restLast20Avg = (total / 20).toFixed(2);
    }

    const t1 = performance.now();
    console.log(`Call to calculateStats took ${t1 - t0} milliseconds.`);

    return info;
  }

  render() {
    const { cats, navigation } = this.props;
    const catID = navigation.state.params.catID;
    const cat = extractCatInfo(catID, cats);

    if (this.state.shareDialog) {
      return (
        <Container>
          {/* <View> */}
          <Card>
            <CardItem>
              <Body>
                <Text>
                    Authorize people
                </Text>
              </Body>
            </CardItem>
            <CardItem cardBody>
              {/* <Form> */}
              <Item regular>
                <Input
                  placeholder="id"
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
    if (cat.hasOwnProperty('breathRecord')) {
      const keys = Object.keys(cat.breathRecord);

      keys.sort((a, b) => b - a);

      recordTimeList = keys;

      stats = this.calculateStats(cat.breathRecord, recordTimeList);
    }

    // fab:
    // https://github.com/GeekyAnts/NativeBase-KitchenSink/blob/master/js/components/fab/basic.js
    // https://github.com/GeekyAnts/NativeBase/issues/372
    // fab should be outside content
    return (
      <Container>
        <Content>
          <Separator bordered>
            <Text>Stats & Setting</Text>
          </Separator>
          <List style={{ backgroundColor: 'white' }}>
            <ListItem
              onPress={() => this.props.navigation.navigate('EditCat', {
                title: 'Edit Cat',
                catID,
                age: cat.age,
                name: cat.name,
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
            <ListItem>
              <Text>{stats ? `Rest total:${stats.numRest}, first20Avg.:${stats.restFirst20Avg}, last20Avg.:${stats.restLast20Avg}, Avg.:${stats.restAvg.toFixed(1)}` : 'no stats data'}</Text>
            </ListItem>
            <ListItem>
              <Text>{stats ? `Sleep total:${stats.numSleep}, first20Avg.:${stats.sleepFirst20Avg}, last20Avg.:${stats.sleepLast20Avg}, Avg.: ${stats.sleepAvg.toFixed(1)}` : 'no stats data'}</Text>
            </ListItem>
          </List>
          <Separator bordered>
            <Text>Records</Text>
          </Separator>
          <View>
            {/* // TODO: it seems to be slow when number of Row is 122.
            // Use Flatlist/pagination instead. */}
            <List
              dataSource={this.ds.cloneWithRows(recordTimeList)}
              renderRow={record =>
              this.eachRowItem(cat, record)}
            // renderLeftHiddenRow={record =>
            //   (<Button full onPress={() => alert(record)}>
            //     <Icon active name="information-circle" />
            //    </Button>)}
              disableRightSwipe
              renderRightHiddenRow={(record, secId, rowId, rowMap) =>
              (<Button full danger onPress={_ => this.deleteRow(cat.catID, secId, rowId, rowMap)}>
                <Icon active name="trash" />
               </Button>)}
            // leftOpenValue={275}
              rightOpenValue={-75}
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
  cats: state.cats,
});

export default connect(mapStateToProps)(CatDetail);

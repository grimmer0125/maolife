// TODO:
// 1. show logs
// *2. add log
// 3. add cat's icon
// *4. input完後時 直接點button, 要可以work, 把view/content/form拿掉就ok, 也有人提過
// *5. fab有時pos會錯, and 預設bottom-right位置不太對. 把content拿掉了就ok, github 有人提過
import React, { Component } from 'react';

import {
  ListView,
  Button as Button2,
  // Alert,
  // Button,
  // Text,
  // View,
} from 'react-native';

import { Container, Content, Image, Button, Icon, Fab, Card, CardItem, Body, List, ListItem, Item, Input, Right, Text } from 'native-base';

import CommonStyles from './styles/common';
import { connect } from 'react-redux';
import { leaveCatDetail, addNewOwner } from './actions/userAction';
import { deleteBreathRecord } from './actions/catAction';

// import {
//   StackNavigator,
// } from 'react-navigation';

const moment = require('moment');

// import Icon2 from 'react-native-vector-icons/FontAwesome';

function extractCatInfo(catID, cats) {
  if (catID && cats && cats.hasOwnProperty(catID)) {
    return { catID, ...cats[catID] };
  }

  return {};
}

const datas = [
  'Simon Mignolet',
  'Nathaniel Clyne',
  'Dejan Lovren',
  'Mama Sakho',
  'Alberto Moreno',
  'Emre Can',
  'Joe Allen',
  'Phil Coutinho',
];

class CatDetail extends React.Component {
  static navigationOptions = ({ navigation }) => ({
    //  title: `Chat with ${navigation.state.params.user}`, <- 進階用法
    // title: 'Cat List',

    // this.props.cats;

    // const cat = extractCatInfo(navigation.state.params.catID, cats);

    // title: navigation.state.params.catID,

    title: navigation.state.params.name,

    // header: ({ goBack }) => ({
    //   left: (  ),
    // }),

    headerRight: (
      <Button2
        title="Measure"
        onPress={() => navigation.navigate('Measure', {
          catID: navigation.state.params.catID,
        })}
      />
    ),

    // headerLeft: (
    //   // <MenuButton/>
    //   // <Icon2 name={'chevron-left'} onPress={ () => { navigation.goBack(); } }  />
    //   <Button2 onPress={() => {console.log("back!!");navigation.goBack();} } title={"<"} >
    //   </Button2>
    // ),
  });

  constructor(props) {
    super(props);

    this.ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });

    // dataSource={this.ds.cloneWithRows(this.state.listViewData)}

    this.state = {
      active: false,
      shareDialog: false,
      authID: '',
      // listViewData: datas,
      // listViewData: [], // ds.cloneWithRows(datas),
    };
  }

  componentWillUpdate() {
    console.log('detail will udpate');
  }

  // not been called
  // componentWillReceiveProps() {
  //   console.log("CatDetail will receive props");
  // }
  // componentWillUnmount() {
  //   console.log("grimmer unmount, selecte = null")
  //   //xTODO not a good way, may use detecting navi change instead of using this
  //   // this.props.dispatch(leaveCatDetail());
  // }

  handleChangeAuthID = (text) => {
    this.setState({ authID: text });
  }

  onSave = () => {
    this.props.dispatch(addNewOwner(this.props.navigation.state.params.catID, this.state.authID));

    this.setState({ shareDialog: false });
  }

  onCancel = () => {
    this.setState({ shareDialog: false });
  }

  deleteRow = (catID, secId, rowId, rowMap) => { // s1, index(0~x), key=s1+index
    rowMap[`${secId}${rowId}`].props.closeRow();
    const recordTime = rowMap[`${secId}${rowId}`].props.body.key;
    // rowMap[`${secId}${rowId}`].props.closeRow(); //props.body.key (recordTime)
    // const newData = [...this.state.listViewData];
    // newData.splice(rowId, 1);
    // this.setState({ listViewData: newData });
    // TODO: send delete command to Firebase
    this.props.dispatch(deleteBreathRecord(catID, recordTime));
  }

  eachRowItem = (cat, time) => {
    // 如果資料大的話就要拆開了, 方便query/sort/pagination
    // breathData/catid1/
    //                   time1

    let prefixToday = '';
    if (moment(time * 1000).isSame(moment(), 'day')) {
      prefixToday = ', Today';
    }

    return (
      <Card key={time} style={{ flex: 0 }}>
        <CardItem header>
          <Text>{moment(time * 1000).format('YYYY-MM-DD HH:mm') + prefixToday}</Text>
        </CardItem>
        <CardItem>
          <Body>
            <Text>
              {/* {moment(time * 1000).format("YYYY-MM-DD HH:mm")} */}
              {`${cat.breathRecord[time].breathRate}/min, mode:${cat.breathRecord[time].mode}`}
            </Text>
          </Body>
        </CardItem>
      </Card>
    );
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
                    Add authorized people
                </Text>
              </Body>
            </CardItem>
            <CardItem cardBody>
              {/* <Form> */}
              <Item regular>
                <Input
                  placeholder="id"
                  onChangeText={this.handleChangeAuthID}
                  onSubmitEditing={(event) => {
                              this.onSave();
                            }}
                />
              </Item>
              {/* </Form> */}
            </CardItem>

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

              {/* <Text>11h ago</Text> */}
            </CardItem>
          </Card>
          {/* </View> */}
        </Container>
      );
    }

    // cat.breathRecord:{
    //   time1: {
    //    breathRate:
    //    mode:
    //   },
    //   time2:
    // }

    // let recordUI = null;
    let recordList = [];
    if (cat.hasOwnProperty('breathRecord')) {
      const keys = Object.keys(cat.breathRecord);

      keys.sort((a, b) => b - a);

      recordList = keys;

      // for (const key of keys) {
      //   // const time = cat.breathRecord[key].breathRate;
      //   console.log("time2:", key)
      //   console.log(moment(key * 1000).format("YYYY-MM-DD HH:mm"));
      //   // const day = moment.unix(key); //object
      //   // console.log("day:", day);
      // }
    }
    //    const unixDate = moment(date).unix(); console.log(moment(unixDate * 1000).format('YYYY-MM-DD')); – Yura Zatsepin Feb 15 at 12:16


    // https://github.com/GeekyAnts/NativeBase-KitchenSink/blob/master/js/components/fab/basic.js
    // https://github.com/GeekyAnts/NativeBase/issues/372
    // fab should be outside content
    return (
      <Container>
        <Content>
          <List
            dataSource={this.ds.cloneWithRows(recordList)}
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

          {/* <View style={{ flex: 1 }}> */}
          {/* <Text>
               {cat.name}
            </Text> */}

          {/* { cat.breathRecord && recordList.map((time) => {
              // 如果資料大的話就要拆開了, 方便query/sort/pagination
              // breathData/catid1/
              //                   time1

              let prefixToday = '';
              if (moment(time * 1000).isSame(moment(), 'day')) {
                prefixToday = ', Today';
              }

              return (
                <Card key={time} style={{ flex: 0 }}>
                  <CardItem header>
                    <Text>{moment(time * 1000).format('YYYY-MM-DD HH:mm') + prefixToday}</Text>
                  </CardItem>
                  <CardItem>
                    <Body>
                      <Text>
                        {`${cat.breathRecord[time].breathRate}/min, mode:${cat.breathRecord[time].mode}`}
                      </Text>
                    </Body>
                  </CardItem>
                </Card>
              );
            })} */}

          {/* <Card style={{flex: 0}}>
              <CardItem>
                <Image style={{ resizeMode: 'cover', height: 200,flex: 1 }} source={{uri: 'https://assets-cdn.github.com/images/modules/logos_page/Octocat.png'}} />
              </CardItem>
              <CardItem>
                <Button transparent>
                  <Icon name="logo-github" />
                  <Text>15,021 stars</Text>
                </Button>
              </CardItem>
            </Card> */}

          {/* </View> */}
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
          {/* <Button style={{ backgroundColor: '#34A34F' }}>
              <Icon name="logo-whatsapp" />
          </Button>
          <Button style={{ backgroundColor: '#3B5998' }}>
              <Icon name="logo-facebook" />
          </Button>
          <Button disabled style={{ backgroundColor: '#DD5144' }}>
              <Icon name="mail" />
          </Button> */}
        </Fab>
      </Container>

    );
  }
}


const mapStateToProps = state => ({
  cats: state.cats,
});

export default connect(mapStateToProps)(CatDetail);

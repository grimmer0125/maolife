// TODO:
// 1. show logs
// *2. add log
// 3. add cat's icon
// *4. input完後時 直接點button, 要可以work, 把view/content/form拿掉就ok, 也有人提過
// *5. fab有時pos會錯, and 預設bottom-right位置不太對. 把content拿掉了就ok, github 有人提過
import React, { Component } from 'react';
import { Container, Content, Image, Button, Icon, Fab,  Card, CardItem, Body, Form, Item, Input, Right, Text } from 'native-base';

import {
  ListView,
  Alert,
  // Button,
  // Text,
  View,
} from 'react-native';

import { Button as Button2 } from "react-native";

import CommonStyles from './styles/common'
import { connect } from 'react-redux';
import { leaveCatDetail, addNewOwner } from './actions/userAction';

import {
  StackNavigator,
} from 'react-navigation';

const  moment = require('moment');

// import Icon2 from 'react-native-vector-icons/FontAwesome';

function extractCatInfo(catID, cats) {

  if (catID && cats && cats.hasOwnProperty(catID)) {
    return {catID, ...cats[catID]};
  }

  return {};

}

class CatDetail extends React.Component {

  static navigationOptions = ({ navigation }) => ({
    //  title: `Chat with ${navigation.state.params.user}`, <- 進階用法
    // title: 'Cat List',

    //this.props.cats;

    // const cat = extractCatInfo(navigation.state.params.catID, cats);

    // title: navigation.state.params.catID,

    title: navigation.state.params.name,

    // header: ({ goBack }) => ({
    //   left: (  ),
    // }),

    headerRight: (
      <Button2 title="Measure"
        onPress={() => navigation.navigate('Measure')}
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

    this.state = {
      active: false,
      shareDialog: false,
      authID: ""
    };
  }

  componentWillUpdate() {
    console.log("detail will udpate");
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
    this.setState({authID: text});
  }

  onSave = () =>{
    this.props.dispatch(addNewOwner(this.props.navigation.state.params.catID, this.state.authID));

    this.setState({ shareDialog: false});
  }

  onCancel  = () =>{
    this.setState({ shareDialog: false});
  }

  render() {
    const {cats, navigation} = this.props;

    const cat = extractCatInfo(navigation.state.params.catID, cats);


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
                        <Input placeholder="id"
                            onChangeText={this.handleChangeAuthID}
                            onSubmitEditing={ (event) => {
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
    if (cat.hasOwnProperty("breathRecord")) {
      const keys = Object.keys(cat.breathRecord);
      for (const key of keys) {
        // const time = cat.breathRecord[key].breathRate;
        console.log("time2:", key)
        console.log(moment(key * 1000).format("YYYY-MM-DD HH:mm"));
        // const day = moment.unix(key); //object
        // console.log("day:", day);
      }
    }
//    const unixDate = moment(date).unix(); console.log(moment(unixDate * 1000).format('YYYY-MM-DD')); – Yura Zatsepin Feb 15 at 12:16


//https://github.com/GeekyAnts/NativeBase-KitchenSink/blob/master/js/components/fab/basic.js
//https://github.com/GeekyAnts/NativeBase/issues/372
// fab should be outside content
    return (
      <Container>
        {/* <Content> */}

          <View style={{ flex: 1 }}>
            {/* <Text>
               {cat.name}
            </Text> */}
            { cat.breathRecord && Object.keys(cat.breathRecord).map((time) => {

              let prefixToday = "";
              if(moment(time * 1000).isSame(moment(), 'day')){
                prefixToday = "Today, ";
              }

              return (
                <Card key={time} style={{flex: 0}}>
                  <CardItem header>
                    <Text>{prefixToday+moment(time * 1000).format("YYYY-MM-DD HH:mm")}</Text>
                  </CardItem>
                  <CardItem>
                    <Body>
                      <Text>
                        {/* {moment(time * 1000).format("YYYY-MM-DD HH:mm")} */}
                        {cat.breathRecord[time].breathRate+"/min, mode:"+cat.breathRecord[time].mode}
                      </Text>
                    </Body>
                  </CardItem>
                </Card>
              );
            })}
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
            <Fab
              active={this.state.active}
              direction="up"
              containerStyle={{}}
              style={{ backgroundColor: '#5067FF' }}
              position="bottomRight"
              onPress={() => {
                this.setState({ active: !this.state.active });
                this.setState({ shareDialog: true});
              }}>
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
          </View>
        {/* </Content> */}
      </Container>

    );
  }
}



const mapStateToProps = (state) => ({
  cats: state.cats,
});

export default connect(mapStateToProps)(CatDetail);


// selected cat要變成null, 怎麼辦?? 先不用back event, 先用下面方法嗎? 先用這個
//   componentWillUnmount() {
    //this.props.leaveDeviceDetailPage();
  //}
  // or redux? selected/detail/xxxx

  // this.props.navigation.goBack()
  //https://github.com/react-community/react-navigation/issues/1122
  //https://github.com/react-community/react-navigation/pull/1492
  // https://github.com/react-community/react-navigation/issues/779
  //back event:
  // https://github.com/react-community/react-navigation/issues/51
  // https://github.com/react-community/react-navigation/issues/684

  //1. back button(), button2 (但有點小) DeviveEventEmitter/callback 2. componentShouldUpdate.
  //3. route https://reactnavigation.org/docs/navigators/navigation-prop, 去收當前的props,結合?url參數, 有沒有用redux都無所謂

// TODO:
// 1. show logs
// 2. add log
// 3. add cat's icon
// 4. input完後時 直接點button, 要可以work
// 5. fab有時pos會錯
// 預設bottom-right位置不太對
import React, { Component } from 'react';
import { Container, Content, Button, Icon, Fab,  Card, CardItem, Body, Form, Item, Input, Right, Text } from 'native-base';

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

import Icon2 from 'react-native-vector-icons/FontAwesome';

class CatDetail extends React.Component {

  static navigationOptions = ({ navigation }) => ({
    //  title: `Chat with ${navigation.state.params.user}`, <- 進階用法
    title: 'Cat List',
    // header: ({ goBack }) => ({
    //   left: (  ),
    // }),

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

//https://github.com/GeekyAnts/NativeBase-KitchenSink/blob/master/js/components/fab/basic.js
//https://github.com/GeekyAnts/NativeBase/issues/372
// fab should be outside content
    return (
      <Container>
        {/* <Content> */}

           <View style={{ flex: 1 }}>
             <Text>
               {cat.name}
             </Text>
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

function extractCatInfo(catID, cats) {

  //    state.routes[1].params.catID;
  // or this.props.navigation.state.params.catID? YES 可以用
  //     // console.log("this.props.navigation.state catdetail", this.props.navigation.state )

  // if (state.selectedCat) {
  // if (state.listNav.routes.length>1 && state.listNav.routes[1].params.catID) {
    // const catID = state.listNav.routes[1].params.catID;
    if (catID && cats && cats.hasOwnProperty(catID)) {
      return {catID, ...cats[catID]};
    }
  // }

  return {};

}

const mapStateToProps = (state) => ({
  cats: state.cats,
});

export default connect(mapStateToProps)(CatDetail);

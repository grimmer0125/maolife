// Back event:
// https://github.com/react-community/react-navigation/issues/51
// https://github.com/react-community/react-navigation/issues/684
// selected cat要變成null, 怎麼辦?? 先不用back event, 先用下面方法嗎? 先用這個
//   componentWillUnmount() {
    //this.props.leaveDeviceDetailPage();
  //}
  // or redux? selected/detail/xxxx

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

import CommonStyles from './styles/common'
import { connect } from 'react-redux';
import { leaveCatDetail, addNewOwner } from './actions/userAction';

class CatDetail extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      active: false,
      shareDialog: false,
      authID: ""
    };
  }

  componentWillUnmount() {

    //TODO not a good way, may use detecting navi change instead of using this
    this.props.dispatch(leaveCatDetail());
  }

  handleChangeAuthID = (text) => {
    this.setState({authID: text});
  }

  onSave = () =>{
    this.props.dispatch(addNewOwner(this.state.authID));

    this.setState({ shareDialog: false});
  }

  onCancel  = () =>{
    this.setState({ shareDialog: false});
  }

  render() {
    const {cat} = this.props;
    // native-base: 1. <Content> 跟 <View> 的差別?
    // 2. body相關: 也有也可ignore Body, 像下面. Body使用時機:<-header,footer, carditem, caritem-header裡, ListItem icon

  //官網的note
// Make use of Left, Body and Right components to align the content of your Card header.
// To mixup Image with other NativeBase components in a single CardItem, include the content within Body component.

    if (this.state.shareDialog) {
      return (
        <Container>
          <Content>
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
          </Content>
        </Container>
      );
    }

//https://github.com/GeekyAnts/NativeBase-KitchenSink/blob/master/js/components/fab/basic.js
//https://github.com/GeekyAnts/NativeBase/issues/372
// fab should be outside content 
    return (
      <Container>
        {/* <Content> */}
          {/* <Text>
            {cat.name}
          </Text> */}
           <View style={{ flex: 1 }}>
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



function extractCatInfo(state) {

  if (state.selectedCat && state.cats && state.cats.hasOwnProperty(state.selectedCat.id)){
    return {catID:state.selectedCat.id, ...state.cats[state.selectedCat.id]};
  }

  return {};

}

const mapStateToProps = (state) => ({
  cat: extractCatInfo(state),
});

export default connect(mapStateToProps)(CatDetail);

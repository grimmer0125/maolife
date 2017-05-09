// https://github.com/react-community/react-navigation/issues/51 back event,
// https://github.com/react-community/react-navigation/issues/684
// selected cat要變成null, 怎麼辦?? 用下面方法嗎?
//   componentWillUnmount() {
    //this.props.leaveDeviceDetailPage();
  //}
  // or redux? selected/detail/xxxx

// 1. show logs
// 2. add log
// 3. add cat's icon
import React, { Component } from 'react';

import {
  ListView,
  Alert,
  Button,
  Text,
  View,
} from 'react-native';

import CommonStyles from './styles/common'

import { connect } from 'react-redux';

import { leaveCatDetail } from './actions/userAction';

class CatDetail extends React.Component {

  constructor(props) {
    super(props);
    console.log("grimmer init CatDetail");
  }

  componentWillUnmount() {
    console.log("grimmer unmount catDetail");

    //TODO not a good way, may use detecting navi change instead of using this
    this.props.dispatch(leaveCatDetail());

    //this.props.leaveDeviceDetailPage();
  }

  render() {
    const {cat} = this.props;
    console.log("cat in detail:", cat);
    return (
      <View>
        <Text style={CommonStyles.welcome}>
          {cat.name}
        </Text>
        <Button
          onPress={() => this.props.navigation.goBack()}
          title="Go back"
        />
      </View>

    );
  }
}

function extractCatInfo(state) {
  //state.selectedCat.id
  //state.cats.

  // let catsArray = [];
  // for (const key of state.cats) {
  //   if (state.selectedCat.id == )
  //   catsArray.push({catID:key, ...cats[key]});
  // }
  if (state.selectedCat && state.cats && state.cats.hasOwnProperty(state.selectedCat.id)){
    return {catID:state.selectedCat.id, ...state.cats[state.selectedCat.id]};
  }

  return {};

  //catid:
  //name:
}

const mapStateToProps = (state) => ({
  cat: extractCatInfo(state),
});

export default connect(mapStateToProps)(CatDetail);

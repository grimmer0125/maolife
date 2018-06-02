  // 1. add cat
// 2. sharing cats for mananing together
//TODO 把自己從owner刪掉時, ui要提示,
//TODO 從detail出來又很快按進去, selectedCat會是null

console.log("load List Page.js !!!!!!!!!")

import React, { Component } from 'react';
import {
  ListView,
  Alert,
  Button,
  Text,
  View,
} from 'react-native';

// import {
//   StackNavigator,
// } from 'react-navigation';
import { createStackNavigator } from 'react-navigation';

import CatDetail from './CatDetail';
import AddCat from './AddCat';
import Measure from './Measure';
import { connect } from 'react-redux';
import { fetchOwnCats, naviToCat } from './actions/userAction';
// import Icon from 'react-native-vector-icons/FontAwesome';

// import { NavigationActions } from 'react-navigation';
import { NavigationActions, addNavigationHelpers } from 'react-navigation';

class ListMain extends Component {

//https://github.com/react-community/react-navigation/issues/779
  static navigationOptions = ({ navigation }) => ({
    //  title: `Chat with ${navigation.state.params.user}`, <- 進階用法
    title: 'Cat List',
    headerRight: (
      <Button title="Add"
        onPress={() => navigation.navigate('AddCat')}
      />
    ),


   });

  // Initialize the hardcoded data
  constructor(props) {
    super(props);

    // so r1, r2 should be different reference
    //TODO: Try to use flatlist or list of native-base
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([
        'John', 'Joel', 'James', 'Jimmy', 'Jackson', 'Jillian', 'Julie', 'Devin'
      ])
    };

    this.props.dispatch(fetchOwnCats());

    this.onButtonPress = this.onButtonPress.bind(this);
  }

  // not been called
  // componentWillReceiveProps() {
  //   console.log("grimme CatList will receive props");
  // }

  shouldComponentUpdate() {
    console.log("grimme CatList shouldComponentUpdate");
    return true;
  }

  componentWillUpdate() {
    console.log("list will udpate");
  }


  onButtonPress(rowData) {
    const catID = rowData.catID;
    const name = rowData.name;
    //Alert.alert('Button has been pressed!');
    console.log("grimmer button press, select:", catID);


    //1. original (這也可以傳params)
    // this.props.navigation.navigate('CatDetail'); //也一樣,
    // 所以可能沒有像 https://reactnavigation.org/docs/navigators/navigation-actions 說的像下面用2.2

    // 原本的onPress={() => this.props.navigation.navigate('Profile', {name: 'Lucy'})}
    // navigation.state.params.name

    //2.
    const naviAction = NavigationActions.navigate(
      {
        routeName: 'CatDetail',
        params: { catID, name },
    });


    // 2.1
    // this.props.dispatch(naviAction); // 跟2.2 一樣!!
    // <-是類似還是2.1真的works in react navigation v1???
    // yes, 至少如果有如 https://v1.reactnavigation.org/docs/redux-integration.html
    // 講的有裝 react-navigation-redux-helpers 等設定好的話

    // 2.2
    // https://v1.reactnavigation.org/docs/navigating-without-navigation-prop.html
    this.props.navigation.dispatch(naviAction);
  }

  componentWillReceiveProps(newProps) {
    const cats = newProps.cats;

    let catsArray = [];
    for (const key in cats) {
      catsArray.push({catID:key, ...cats[key]});
    }

    // ref: 有時會檢查比較多
    //if (newProps.viewingDayUuid !== this.props.viewingDayUuid) {
    //let {data, sectionIds} = this._getListViewData(nextProps.patients);

    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(catsArray)
    });

  }

// 官方listview的example ref
// https://facebook.github.io/react-native/docs/listview.html
//   _renderRow: function(rowData: string, sectionID: number, rowID: number, highlightRow: (sectionID: number, rowID: number) => void) {
// https://facebook.github.io/react-native/docs/listview.html#renderrow
  render() {
    console.log("list navi info:", this.props.navigation); //.routeName
    return (
      <View style={{flex: 1, paddingTop: 22}}>

        <ListView
          dataSource={this.state.dataSource}
          renderRow={(rowData) => {
            return (
              <View>
                {/* <Text>{rowData.name}</Text> */}
                <Button
                  onPress={()=>this.onButtonPress(rowData)}
                  title={rowData.name?rowData.name:""}
                  accessibilityLabel="See an informative alert"
                />
              </View>
            )
            }
          }
        />
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  cats: state.cats,
});

const ListMainReduxState = connect(mapStateToProps)(ListMain);

export const ListPage = createStackNavigator({
  List: {
    screen: ListMainReduxState,
  },
  AddCat: {
    screen: AddCat,
  },
  CatDetail: {
    screen: CatDetail,
    // navigationOptions: {
    //   title: 'CatDetail',
    // },
  },
  Measure : {
    screen: Measure,
  }
});

// the below api usage is v1 of react navigation. if we still want to use it in v2, need change
// {/* <ListPage navigation={{ dispatch, state: nav }} /> */}
// https://v1.reactnavigation.org/docs/redux-integration.html
// const ListPageWithNavState = ({ dispatch, nav }) => (
//   <ListPage navigation={navigationPropConstructor({ dispatch, state: nav })} />
// );
//
// const mapStateToPropsListPage = state => ({
//   nav: state.listNav,
// });

export default ListPage;//connect(mapStateToPropsListPage)(ListPageWithNavState);


// export default ListPage;

import React, { Component } from 'react';
import {
  ListView,
  Button,
  View,
} from 'react-native';

import { createStackNavigator, NavigationActions } from 'react-navigation';
import { connect } from 'react-redux';

import CatDetail from './CatDetail';
import EditCat from './EditCat';
import Measure from './Measure';
// import { liveQueryOwnCats, naviToCat } from './actions/userAction';

console.log('load List Page.js !!');

class ListMain extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Cat List',
    headerRight: (
      <Button
        title="Add"
        onPress={() => navigation.navigate('EditCat', {
          title: 'New Cat',
        })}
      />
    ),
  });

  constructor(props) {
    super(props);

    // TODO: Try to use flatlist or list of native-base
    const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      dataSource: ds.cloneWithRows([]),
    };

    this.onButtonPress = this.onButtonPress.bind(this);
  }

  onButtonPress(rowData) {
    const { catID, name } = rowData;

    // three ways
    // 1. navigation.navigate
    // 2. react navigation redux integration
    // 3. NavigationActions.navigate
    // https://v1.reactnavigation.org/docs/navigating-without-navigation-prop.html
    const naviAction = NavigationActions.navigate({
      routeName: 'CatDetail',
      params: { catID, name },
    });

    this.props.navigation.dispatch(naviAction);
  }

  componentWillReceiveProps(newProps) {
    const { cats } = newProps;

    const catsArray = [];
    for (const key in cats) {
      catsArray.push({ catID: key, ...cats[key] });
    }

    this.setState({
      dataSource: this.state.dataSource.cloneWithRows(catsArray),
    });
  }

  render() {
    // console.log('render list page, navi info:', this.props.navigation);
    return (
      <View style={{ flex: 1, paddingTop: 22 }}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={rowData => (
            <View>
              {/* <Text>{rowData.name}</Text> */}
              <Button
                onPress={() => this.onButtonPress(rowData)}
                title={rowData.name ? rowData.name : ''}
                accessibilityLabel="See an informative alert"
              />
            </View>
            )
          }
        />
      </View>
    );
  }
}

const mapStateToProps = state => ({
  cats: state.cats,
});

const ListMainReduxState = connect(mapStateToProps)(ListMain);

export const ListPage = createStackNavigator({
  List: {
    screen: ListMainReduxState,
  },
  EditCat: {
    screen: EditCat,
  },
  CatDetail: {
    screen: CatDetail,
    // navigationOptions: {
    //   title: 'CatDetail',
    // },
  },
  Measure: {
    screen: Measure,
  },
});

// the below api usage is v1 of react navigation. if we still want to use it in v2, need change
// https://v1.reactnavigation.org/docs/redux-integration.html
// const ListPageWithNavState = ({ dispatch, nav }) => (
//   <ListPage navigation={navigationPropConstructor({ dispatch, state: nav })} />
// );
//
// const mapStateToPropsListPage = state => ({
//   nav: state.listNav,
// });

export default ListPage;

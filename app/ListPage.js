import React, { Component } from 'react';
import {
  FlatList,
  Button,
  View,
} from 'react-native';

import { createStackNavigator, NavigationActions } from 'react-navigation';

import { connect } from 'react-redux';

import PetDetail from './PetDetail';
import EditPet from './EditPet';
import EditRecord from './EditRecord';
import Measure from './Measure';
// import { liveQueryOwnPets, naviToPet } from './actions/userAction';

class ListMain extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: 'Pet List',
    headerRight: (
      <Button
        title="Add"
        onPress={() => navigation.navigate('EditPet', {
          title: 'New Pet',
        })}
      />
    ),
  });

  constructor(props) {
    super(props);

    // TODO: Try to use flatlist or list of native-base
    // const ds = new ListView.DataSource({ rowHasChanged: (r1, r2) => r1 !== r2 });
    this.state = {
      dataSource: [], // ds.cloneWithRows([]),
    };

    this.onButtonPress = this.onButtonPress.bind(this);
  }

  onButtonPress(rowData) {
    const { name } = rowData;
    const petID = rowData.key;
    // three ways
    // 1. navigation.navigate
    // 2. react navigation redux integration
    // 3. NavigationActions.navigate
    // https://v1.reactnavigation.org/docs/navigating-without-navigation-prop.html
    const naviAction = NavigationActions.navigate({
      routeName: 'PetDetail',
      params: { petID, name },
    });

    this.props.navigation.dispatch(naviAction);
  }

  componentWillReceiveProps(newProps) {
    const { pets } = newProps;

    const petsArray = [];
    for (const key in pets) {
      petsArray.push({ key, ...pets[key] });
    }

    this.setState({
      dataSource: petsArray, // this.state.dataSource.cloneWithRows(petsArray),
    });
  }

  render() {
    // console.log('render list page, navi info:', this.props.navigation);
    return (
      <View style={{ flex: 1, paddingTop: 22 }}>
        <FlatList
          data={this.state.dataSource}
          renderItem={({ item }) => (
            <View>
              {/* <Text>{rowData.name}</Text> */}
              <Button
                onPress={() => this.onButtonPress(item)}
                title={item.name ? item.name : ''}
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
  pets: state.pets,
});

const ListMainReduxState = connect(mapStateToProps)(ListMain);

export const ListPage = createStackNavigator({
  List: {
    screen: ListMainReduxState,
  },
  EditPet: {
    screen: EditPet,
  },
  EditRecord: {
    screen: EditRecord,
  },
  PetDetail: {
    screen: PetDetail,
    // navigationOptions: {
    //   title: 'PetDetail',
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

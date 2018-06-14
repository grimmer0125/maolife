import React, { Component } from 'react';
import {
  TouchableOpacity,
  FlatList,
  Button as SystemButton,
} from 'react-native';

import {
  Container,
  Content, // ~ ScrollView of react-native
  Card,
  CardItem,
  Body,
  Text,
} from 'native-base';

import { createStackNavigator, NavigationActions } from 'react-navigation';

import { connect } from 'react-redux';

import PetDetail from './PetDetail';
import EditPet from './EditPet';
import EditRecord from './EditRecord';
import Measure from './Measure';
import I18n from './i18n/i18n';

class ListMain extends Component {
  static navigationOptions = ({ navigation }) => ({
    title: I18n.t('Pets'),
    headerRight: (
      <SystemButton
        onPress={() => navigation.navigate('EditPet', {
          title: I18n.t('New Pet'),
        })}
        title={I18n.t('Add')}
      />
    ),
  });

  constructor(props) {
    super(props);

    this.onButtonPress = this.onButtonPress.bind(this);
  }

  onButtonPress(rowData) {
    const petID = rowData.key;
    // three ways to navigate
    // 1. navigation.navigate
    // 2. react navigation redux integration
    // 3. NavigationActions.navigate
    // https://v1.reactnavigation.org/docs/navigating-without-navigation-prop.html
    const naviAction = NavigationActions.navigate({
      routeName: 'PetDetail',
      params: { petID },
    });

    this.props.navigation.dispatch(naviAction);
  }

  render() {
    const { pets } = this.props;
    const petsArray = [];

    // instead "for in", prevent prototype chain
    Object.keys(pets).forEach((key) => {
      petsArray.push({ key, ...pets[key] });
    });

    return (
      <Container style={{ backgroundColor: '#F5FCFF' }}>
        <Content>
          <FlatList
            data={petsArray}
            renderItem={({ item }) => (
              <TouchableOpacity key={item.key} onPress={() => this.onButtonPress(item)}>
                <Card>
                  <CardItem header >
                    <Text>
                      {item.name}
                    </Text>
                  </CardItem>
                  <CardItem >
                    <Body>
                      <Text>
                        {item.age ? `${I18n.t('Age')}:${item.age}` : null}
                      </Text>
                    </Body>
                  </CardItem>
                </Card>
              </TouchableOpacity>
            )
          }
          />
        </Content>
      </Container>
    );
  }
}

const mapStateToProps = state => ({
  pets: state.pets,
});

const ListMainReduxState = connect(mapStateToProps)(ListMain);

const ListPage = createStackNavigator({
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
  },
  Measure: {
    screen: Measure,
  },
});

export default ListPage;

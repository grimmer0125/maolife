import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  ListView,
  Alert,
  Button,
  Text,
  View,
  ScrollView,
} from 'react-native';

import * as firebase from 'firebase';
import firebaseConfig from '../firebaseConfig';

console.log("grimmer test firebase");

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);
// this.itemsRef = firebaseApp.database().ref();

let test1 = firebaseApp.database().ref().child('items');
console.log("test1:", test1);

test1.on('value', (snap) => {

    const t2 = snap.val();
    console.log("t2:", t2); //now snap is object {title:grimmer}, not

    // get children as an array
    let tmp_items = [];

//     snap.forEach((child) => {
//   items.push({
//     title: child.val().title,
//     _key: child.key
//   });
// });

    // if snap is array,
    // snap.forEach((child) => {
    //     tmp_items.push({title: child.val().title, _key: child.key});
    // });

    console.log("grimmer data:", tmp_items);
    // this.setState({dataSource: this.state.dataSource.cloneWithRows(items)});

});

import {
  StackNavigator,
  TabNavigator,
} from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons';

const onButtonPress = () => {
  Alert.alert('Button has been pressed!');
};

class MyHomeScreen extends Component {

  // Initialize the hardcoded data
  constructor(props) {
    super(props);
    console.log("grimmer init MyHomeScreen");
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([
        'John', 'Joel', 'James', 'Jimmy', 'Jackson', 'Jillian', 'Julie', 'Devin'
      ])
    };
  }

  getRef() {
    return firebaseApp.database().ref();
  }

  render() {
    return (
      <View style={{flex: 1, paddingTop: 22}}>
        <ListView
          dataSource={this.state.dataSource}
          renderRow={(rowData) => {
            return (
              <View>
                <Text>{rowData}</Text>
                <Button
                  onPress={onButtonPress}
                  title="Press Me"
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

class MyNotificationsScreen extends React.Component {
  // static navigationOptions = {
  //   tabBarLabel: 'Notifications',
  //   tabBarIcon: ({ tintColor }) => (
  //     <Image
  //       source={require('./notif-icon.png')}
  //       style={[styles.icon, {tintColor: tintColor}]}
  //     />
  //   ),
  // };

  render() {
    return (
      <Button
        onPress={() => this.props.navigation.goBack()}
        title="Go back home"
      />
    );
  }
}

/* <MyNavScreen
  banner="Settings"
  navigation={navigation}
/> */
const MySettingsScreen = ({ navigation }) => (
    <ScrollView>
      <Button
        onPress={() => navigation.navigate('NotifSettings')}
        title="Go to notification settings"
      />
      <Button
        onPress={() => navigation.goBack(null)}
        title="In Setting, Go back"
      />
    </ScrollView>
);

const SettingsTab = StackNavigator({
  Settings: {
    screen: MySettingsScreen,
    // path: '/',
    // wired, is function, not {}
    navigationOptions: () => ({
      title: 'Settings',
    }),
  },
  NotifSettings: {
    screen: MyNotificationsScreen,
    navigationOptions: {
      title: 'Notification Settings',
    },
  },
});


const App = TabNavigator({
  Home: {
    screen: MyHomeScreen,
    navigationOptions: {
      tabBarLabel: 'Home',
      tabBarIcon: ({ tintColor, focused }) => (
        <Ionicons
        name={focused ? 'ios-home' : 'ios-home-outline'}
        size={26}
        style={{ color: tintColor }}
        />
      ),
    },
  },
  SettingsTab: {
    screen: SettingsTab,
    navigationOptions: {
      tabBarLabel: 'Settings',
      tabBarIcon: ({ tintColor, focused }) => (
        <Ionicons
          name={focused ? 'ios-settings' : 'ios-settings-outline'}
          size={26}
          style={{ color: tintColor }}
        />
      ),
    },
  },
}, {
  tabBarOptions: {
    activeTintColor: '#e91e63',
  },
  //   tabBarPosition: 'bottom',
  //   animationEnabled: false,
  //   swipeEnabled: false,
});

export default App;

// Tab:
// 1. List
// 2. Wall
// 3. Record

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

// import { connect } from 'react-redux';

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


const MainScreen = TabNavigator({
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

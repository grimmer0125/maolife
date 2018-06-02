// Tabs:
// 1. List (如果記的是在那一個cat, 那統計就不會太多層)
// 2. wall ? 之後做
// 3. setting
// 4. 統計要放那?
// 5. 本來record要在在tab之一, 但要三個步驟好像也差不多

import React, { Component } from 'react';
import {
  Button,
} from 'react-native';

// import {
//   TabNavigator,
// } from 'react-navigation';
//   StackNavigator,
//
import { Text, View } from 'react-native';
import { createBottomTabNavigator } from 'react-navigation';

// import Ionicons from 'react-native-vector-icons/Ionicons';

import ListPage from './ListPage';
import SettingPage from './SettingPage';

class HomeScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Home!</Text>
      </View>
    );
  }
}

class SettingsScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text>Settings!</Text>
      </View>
    );
  }
}


// export default createBottomTabNavigator({
//   Home: ListPage,
//   Settings: SettingPage,
// });

export default createBottomTabNavigator({
  Home: ListPage,
  Settings: SettingPage,
});

// const MainScreen = TabNavigator({
//   Home: {
//     screen: ListPage,
//     navigationOptions: {
//       tabBarLabel: 'List',
//       tabBarIcon: ({ tintColor, focused }) => (
//         <Ionicons
//         name={focused ? 'ios-home' : 'ios-home-outline'}
//         size={26}
//         style={{ color: tintColor }}
//         />
//       ),
//     },
//   },
//   SettingsTab: {
//     screen: SettingPage,
//     navigationOptions: {
//       tabBarLabel: 'Settings',
//       tabBarIcon: ({ tintColor, focused }) => (
//         <Ionicons
//           name={focused ? 'ios-settings' : 'ios-settings-outline'}
//           size={26}
//           style={{ color: tintColor }}
//         />
//       ),
//     },
//   },
// }, {
//   tabBarOptions: {
//     activeTintColor: '#e91e63',
//   },
//   //   tabBarPosition: 'bottom',
//   //   animationEnabled: false,
//   //   swipeEnabled: false,
// });
//
// export default MainScreen;

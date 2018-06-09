import React from 'react';

import Ionicons from 'react-native-vector-icons/Ionicons';
import { createBottomTabNavigator } from 'react-navigation';

import ListPage from './ListPage';
import SettingPage from './SettingPage';

export default createBottomTabNavigator({
  Home: {
    screen: ListPage,
    navigationOptions: {
      tabBarLabel: 'List',
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
    screen: SettingPage,
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
});

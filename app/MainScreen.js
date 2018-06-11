import React from 'react';

import Ionicons from 'react-native-vector-icons/Ionicons';
import { createBottomTabNavigator } from 'react-navigation';
import { Root } from 'native-base';

import ListPage from './ListPage';
import SettingPage from './SettingPage';
import I18n from './i18n/i18n';

const MainScreenNavigator = createBottomTabNavigator({
  Home: {
    screen: ListPage,
    navigationOptions: {
      tabBarLabel: I18n.t('Pets'),
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
      tabBarLabel: I18n.t('Settings'),
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

const MainScreen = () => (
  <Root>
    <MainScreenNavigator />
  </Root>
);
export default MainScreen;

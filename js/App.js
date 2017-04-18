import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  ListView,
  Alert,
  Button,
  Text,
  View,
} from 'react-native';

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
    // test();
    // console.log("abc");
    const ds = new ListView.DataSource({rowHasChanged: (r1, r2) => r1 !== r2});
    this.state = {
      dataSource: ds.cloneWithRows([
        'John', 'Joel', 'James', 'Jimmy', 'Jackson', 'Jillian', 'Julie', 'Devin'
      ])
    };
  }

  render() {
    // console.log("abcd");
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

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     justifyContent: 'center',
//     alignItems: 'center',
//     backgroundColor: '#F5FCFF',
//   },
//   welcome: {
//     fontSize: 20,
//     textAlign: 'center',
//     margin: 10,
//   },
//   instructions: {
//     textAlign: 'center',
//     color: '#333333',
//     marginBottom: 5,
//   },
// });

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
  Notifications: {
    screen: MyNotificationsScreen,
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

export default App;


// const StacksInTabs = TabNavigator({
//   MainTab: {
//     screen: MainTab,
//     path: '/',
//     navigationOptions: {
//       tabBarLabel: 'Home',
//       tabBarIcon: ({ tintColor, focused }) => (
//         <Ionicons
//           name={focused ? 'ios-home' : 'ios-home-outline'}
//           size={26}
//           style={{ color: tintColor }}
//         />
//       ),
//     },
//   },
//   SettingsTab: {
//     screen: SettingsTab,
//     path: '/settings',
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
//   tabBarPosition: 'bottom',
//   animationEnabled: false,
//   swipeEnabled: false,
// });

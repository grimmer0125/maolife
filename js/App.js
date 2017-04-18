import React, { Component } from 'react';
import {
  AppRegistry,
  StyleSheet,
  ListView,
  Alert,
  Button,
  Text,
  View
} from 'react-native';

const onButtonPress = () => {
  Alert.alert('Button has been pressed!');
};

export default class App extends Component {

  // Initialize the hardcoded data
  constructor(props) {
    super(props);
    // test();
    console.log("abc");
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


  // render() {
  //   console.log("grimmer test");
  //   return (
  //     <View style={styles.container}>
  //       <Text style={styles.welcome}>
  //         Welcome to React Native!
  //       </Text>
  //       <Text style={styles.instructions}>
  //         To get started, edit index.ios.js
  //       </Text>
  //       <Text style={styles.instructions}>
  //         Press Cmd+R to reload,{'\n'}
  //         Cmd+D or shake for dev menu
  //       </Text>
  //     </View>
  //   );
  // }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});

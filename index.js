import { AppRegistry, YellowBox } from 'react-native';
import App from './app/App';

YellowBox.ignoreWarnings([
  'Warning: isMounted(...) is deprecated', // https://github.com/facebook/react-native/issues/18868
  'Module RCTImageLoader requires', // https://github.com/facebook/react-native/issues/17504
  'Class RCTCxxModule']); // https://github.com/facebook/react-native/issues/18201

AppRegistry.registerComponent('maolife', () => App);

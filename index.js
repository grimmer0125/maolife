import { AppRegistry, YellowBox } from 'react-native';
import App from './app/App';

YellowBox.ignoreWarnings(['Warning: isMounted(...) is deprecated', 'Module RCTImageLoader requires']);

AppRegistry.registerComponent('maolife', () => App);

import { AppRegistry } from 'react-native';
import { App } from '../src/App.web';

AppRegistry.registerComponent('Peitho', () => App);
AppRegistry.runApplication('Peitho', {
  rootTag: document.getElementById('root'),
});

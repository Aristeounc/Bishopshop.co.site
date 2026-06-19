import { AppRegistry } from 'react-native';
import { App } from '../src/App.web';

AppRegistry.registerComponent('AttuneAI', () => App);
AppRegistry.runApplication('AttuneAI', {
  rootTag: document.getElementById('root'),
});

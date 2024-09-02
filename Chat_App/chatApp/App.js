import React from 'react';
import * as Font from 'expo-font';
import * as SplashScreen from 'expo-splash-screen';
import AppNavigation from './config/routes';
import { Root } from 'native-base';
import { ChatProvider } from './context/ChatProvider';
import { LogBox } from 'react-native';
class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isReady: false
    };
    LogBox.ignoreLogs([
      'Unrecognized Websocket connection option(s) `agent`, `perMessageDeflate`, `pfx`, `key`, `passphrase`, `cert`, `ca`, `ciphers`, `rejectUnauthorized`. Did you mean to put these under `headers`?'
    ])
  }

  async _getFonts() {
    await Font.loadAsync({
      Roboto: require('native-base/Fonts/Roboto.ttf'),
      Roboto_medium: require('native-base/Fonts/Roboto_medium.ttf'),  
      'noto-font': require('./assets/fonts/NotoKufiArabic-Regular.ttf')
    });
    this.setState({ isReady: true });
  }

  componentDidMount() {
    this._getFonts();
  } async onLayoutRootView() {
    if (!this.state.isReady) {
      return;
    }
    await SplashScreen.hideAsync();
  }


  render() {
    if (!this.state.isReady) {
      return null;
    }
    return (
      <ChatProvider>
        <Root>
          <AppNavigation />
        </Root>
      </ChatProvider>
    );
  }
}

export default App;
import React, { Component } from "react";
import { Keyboard, KeyboardAvoidingView, Image } from "react-native";
import { Auth, Axios, Strings, Urls } from "../config";
import { Toast, Container, Content, View, Text, Item, Input, Icon, Button } from "native-base";
import styles from "./styles/auth";
import companyLogo from '../assets/images/logo.png';
import { Loader } from '../components';

export default class LoginScreen extends Component {

  constructor(props){
    super(props);
    this.state = {
      username: '',
      password: '',
      isLoading: true
    }
    this._bootstrapAsync();
  }

  _bootstrapAsync = async () => {
    const authenticated = await Auth.auth();
    if(authenticated){
      this.props.navigation.navigate('Home');
    }
    this.setState({ isLoading: false });
  }

  onUsernameChange = username => this.setState({username});

  onPassowrdChange = password => this.setState({password});

  validate(){
    Keyboard.dismiss();
    if(!this.state.username){
      Toast.show({ text: Strings.USERNAME_REQUIRED, type: 'danger'});
      return false;
    }
    if(!this.state.password){
      Toast.show({ text: Strings.PASSWORD_REQUIRED, type: 'danger'});
      return false;
    }
    return true;
  }

  login = async () => {
    if(!this.validate()) return;
    let data = {
      username: this.state.username, password: this.state.password
    };
    try{
      this.setState({ isLoading: true });
      let response = await Axios.post(Urls.AUTH, data);
      Auth.setUser(response.data);
      this.props.navigation.navigate('Home');
      this.setState({ isLoading: false });
    } catch(e) {
      this.setState({ isLoading: false });
      Toast.show({ text: e.response.data.message, type: 'danger'});
    }
  }

  navToRegister = () => this.props.navigation.navigate('Register', { msg: 'Hello' });

  render() {
    return (
      <Container>
        <Loader title={Strings.PLEASE_WAIT} loading={this.state.isLoading} />
        <KeyboardAvoidingView behavior='padding' style={{ flex: 1 }}>
          <Content>
            <View style={styles.logoContainer}>
              <Image
              style={styles.logo}
              source={companyLogo}
              resizeMode='contain' />
            </View>
            <View style={styles.form}>
              <Text style={styles.title}>{Strings.LOGIN}</Text>
              <Item rounded style={styles.inputItem}>
                <Input
                style={styles.input}
                placeholder={Strings.USERNAME_PLACEHOLDER}
                onChangeText={this.onUsernameChange} />
                <Icon name='person-outline' style={styles.icon} />
              </Item>
              <Item rounded style={styles.inputItem}>
                <Input
                style={styles.input}
                placeholder={Strings.PASSWORD_PLACEHOLDER}
                secureTextEntry={true}
                onChangeText={this.onPassowrdChange} />
                <Icon name='lock-closed-outline' style={styles.icon} />
              </Item>
              <Button rounded info block style={styles.button} onPress={this.login}>
                <Text>{Strings.LOGIN}</Text>
              </Button> 
              <Button rounded bordered dark block style={styles.button} onPress={this.navToRegister}>
                <Text>{Strings.CREATE_NEW_ACCOUNT}</Text>
              </Button> 
            </View>
          </Content>
        </KeyboardAvoidingView>
      </Container>
    )
  }
}
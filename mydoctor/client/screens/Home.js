import React, { useState, useEffect } from 'react';
import { StyleSheet, ImageBackground, View } from 'react-native';
import { Button, Text } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import AsyncStorage from '@react-native-async-storage/async-storage';
import styles from '../styles/homeStyles';

export default function HomeScreen(props) {
  const {navigation} = props;
  const [token, setToken] = useState('');
  useEffect(() => {
    const refreshToken = navigation.addListener('focus', () => {
      _checkToken();
    })
   return refreshToken
  }, [navigation])
  
  const _checkToken = async () => {
    const token = await AsyncStorage.getItem('accessToken');
    setToken(token);
  }
  return (
    <ImageBackground 
    source={require('../assets/doc-bg.png')}
    style={styles.backgroundColor}>
      <View style={styles.container}>
        <Text style={styles.title}>Welcome in My Doctor App</Text>
        <Text style={styles.title}>My Doctor is the first app the connects between the patient and doctor</Text>
        {token ?
        <>
          <Button title="Doctors list" onPress={() => navigation.navigate('Doctors')}/>
          <Button type='clear' title="Profile" onPress={() => navigation.navigate('Profile')}>
            <Text style={styles.labelButton}>
              Preview Profile
            </Text>
          </Button>
        </>
        :
        <>
          <Button title="Login" onPress={() => navigation.navigate('SignIn')}/>
            <Button type='clear' title="Create account" onPress={() => navigation.navigate('SignUp')}>
              <Text style={styles.labelButton}>
                Preview Profile
              </Text>
            </Button>
        </>
        }
      </View>
    </ImageBackground>

  );
}
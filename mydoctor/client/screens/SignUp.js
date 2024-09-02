import { StatusBar } from 'expo-status-bar';
import { KeyboardAvoidingView, ScrollView, StyleSheet, View } from 'react-native';
import { Button, CheckBox, Input, Text } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import styles from'../styles/authStyles';
import ProfileForm from '../components/ProfileForm';
import axios from '../config/axios';
import { SIGNUP_URL } from '../config/urls';
import * as Location from 'expo-location';
import { useState, useEffect } from 'react';
import Loader from '../components/Loader';
import Alert from '../components/Alert';

export default function SignUpScreen(props) {
  const {navigation} = props;
  const [location, setLocation] = useState(null);
  const [errorMsg, setErrorMsg] = useState(null);
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [alert, setAlert] = useState({
    title: '',
    message: '',
    type: '',
  })
  useEffect(() => {
    (async () => {
      let {status} = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }
      let location = await Location.getCurrentPositionAsync({});
      setLocation(location.coords);
    })();
  }, []);


  const _singUp = async(values) => {
    setLoading(true);
    const body = {
      name: values.name,
      email: values.email,
      password: values.password,
      userType: values.userType ? 'doctor' : 'normal',
      specialilzation: values.specialilzation,
      address: values.address,
      phone: values.phone,
      workingHours: values.workingHours,
      location: {
        latitude: location ? location.latitude : null,
        longitude: location ? location.longitude : null,
      },
    }
    try {
      const response = await axios.post(SIGNUP_URL, body);
      setLoading(false);
      setAlert({title: 'Account created', message: 'Your account is created succesfully\n Do you want to login?', type: 'question'});
      setVisible(true);
    } catch (e) {
      console.log(e.response);
      setLoading(false);
      setAlert({title: 'Alert', message: e.response.data.errors[0].message, type: 'alert'});
      setVisible(true);
    }
  }
  return (
    <ScrollView>
      <Loader title='Your account is being created' loading={loading} />
      <Alert visible={visible} title={alert.title} message={alert.message} type={alert.type} onClose= {() => setVisible(false) } onClick= {() => navigation.navigatie('SignIn')}/>
      <View style={styles.container}>
        <Icon
        raised
        name='user'
        type="font-awesome"
        color="#f50"
        size={50} />
        <Text h4>Create new account</Text>
      </View>
      <KeyboardAvoidingView
        behavior='padding' enabled>
          <View style={styles.container}>
        <ProfileForm submit = {(values => _singUp(values))} user={null} disabled={false} buttonTitle="Sign Up" CheckBox={true}/>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  );
}
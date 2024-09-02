import { KeyboardAvoidingView, ScrollView, StyleSheet, View } from 'react-native';
import styles from '../styles/authStyles';
import { Formik } from 'formik';
import { Button, Input, Icon, Text } from 'react-native-elements';
import * as yup from 'yup';
import { useState } from 'react';
import axios from '../config/axios';
import { SIGNIN_URL } from '../config/urls';
import Loader from '../components/Loader';
import Alert from '../components/Alert';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function SignInScreen(props) {
  const [loading, setLoading] = useState(false);
  const [visible, setVisible] = useState(false);
  const [alert, setAlert] = useState({
    title: '',
    message: '',
    type: '',
  })
  const signInValidationSchema = yup.object().shape({
    email: yup
      .string()
      .email('Email must be entered correctly')
      .required('Email required'),
    password: yup
      .string()
      .required('Password required'),
  })

  const _signIn = async(values) => {
    setLoading(true);
    const body = {
      email: values.email,
      password: values.password,
    }
    try {
      const response = await axios.post(SIGNIN_URL, body);
      AsyncStorage.setItem("accessToken", response.data.accessToken);
      setLoading(false);
      props.navigation.navigate("Home");
    } catch (e) {
      console.log(e);
      setLoading(false);
      setAlert({
        title:'Alert',
         message: e.response.data.message,
         type: 'alert'
      });
      setVisible(true);
    }
  }

  return(
    <ScrollView>
      <Loader loading={loading} title='checking information'/>
      <Alert visible={visible} title={alert.title} message={alert.message} type={alert.type} onClose= {() => setVisible(false)}/>
      <View style={styles.container}>
        <Icon
        raised
        name='user'
        type="font-awesome"
        color="#f50"
        size={50} />
        <Text h4>Login</Text>
      </View>
      <KeyboardAvoidingView behavior='padding' enabled>
        <View style={styles.container}>
          <Formik
            initialValues={{email: '', password: ''}}
            validationSchema={signInValidationSchema}
            onSubmit={values => _signIn(values)}
            >
              {({handleChange, handleBlur, handleSubmit, values, errors, isValid}) => (
                <>
                <Input 
                name="email"
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                placeholder='Email'
                style={[styles.textInput, errors.email && styles.errorInput]}
                keboardType='email-addres'
                />
                {errors.email && <Text p style={styles.textError}>{errors.email}</Text>}
                <Input 
                name="password"
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                secureTextEntry
                placeholder='Password'
                style={[styles.textInput, errors.password && styles.errorInput]}
                />
                {errors.password && <Text p style={styles.textError}>{errors.password}</Text>}
                <Button title='Login' style={{marginTop: '20px'}} onPress={handleSubmit} disabled= {!isValid} />
                </>
              )}
            </Formik>
        </View>
      </KeyboardAvoidingView>
    </ScrollView>
  )
}
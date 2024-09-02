import { StatusBar } from 'expo-status-bar';
import { Platform, StyleSheet, Text, View } from 'react-native';
import { Button, CheckBox } from 'react-native-elements';
import Icon from 'react-native-vector-icons/FontAwesome';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from './screens/Home';
import DoctorsScreen from './screens/Doctors';
import SignUpScreen from './screens/SignUp';
import SignInScreen from './screens/SignIn';
import ProfileScreen from './screens/Profile';
import UpdateProfileScreen from './screens/UpdateProfile';

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerStyle: {
            backgroundColor: '#007bff',
          },
          headerTintColor: '#fff',
          headerTitleStyle: {
            textAlign: 'left',
            fontFamily: 'NotoFont',
          },
        }}
      >
        <Stack.Screen
          name='Home'
          component={HomeScreen}
          options={{headerShown: false}}
        />
        <Stack.Screen
          name='Doctors'
          component={DoctorsScreen}
          options={{
            title: "Doctors Screen"
          }}
        />
        <Stack.Screen
          name='SignUp'
          component={SignUpScreen}
          options={{
            title: "Create new account"
          }}
        />
        <Stack.Screen
          name='SignIn'
          component={SignInScreen}
          options={{
            title: "SignIn"
          }}
        />
        <Stack.Screen
          name='Profile'
          component={ProfileScreen}
          options={{
            title: "Profile"
          }}
        />
        <Stack.Screen
          name='UpdateProfile'
          component={UpdateProfileScreen}
          options={{
            title: "Profile update"
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

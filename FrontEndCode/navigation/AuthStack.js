import React from 'react';
import {View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';

import Welcome from '../screens/Welcome'
import Login from '../screens/Login'
import Signup from '../screens/Signup'

import FontAwesome from 'react-native-vector-icons/FontAwesome';

// import AsyncStorage from '@react-native-community/async-storage';
// import { GoogleSignin } from '@react-native-community/google-signin';

const Stack = createStackNavigator();

const AuthStack = () => {
  return (
      <Stack.Navigator>
          <Stack.Screen name="Welcome" component={Welcome}/>
          <Stack.Screen 
            name="Signup" 
            component={Signup}
            options={({navigation}) => ({
              title: '',
              headerStyle: {
                backgroundColor: '#f9fafd',
                shadowColor: '#f9fafd',
                elevation: 0,
              },
              headerLeft: () => (
                <View style={{marginLeft: 10}}>
                  <FontAwesome.Button 
                    name="angle-left"
                    size={25}
                    backgroundColor="#f9fafd"
                    color="#333"
                    onPress={() => navigation.navigate('Welcome')}
                  />
                </View>
              ),
            })}
          />
          <Stack.Screen 
            name="Login" 
            component={Login} 
            options={({navigation}) => ({
              title: '',
              headerStyle: {
                backgroundColor: '#f9fafd',
                shadowColor: '#f9fafd',
                elevation: 0,
              },
              headerLeft: () => (
                <View style={{marginLeft: 10}}>
                  <FontAwesome.Button 
                    name="angle-left"
                    size={25}
                    backgroundColor="#f9fafd"
                    color="#333"
                    onPress={() => navigation.navigate('Welcome')}
                  />
                </View>
              ),
            })}
          />
      </Stack.Navigator>
  );
};

export default AuthStack;

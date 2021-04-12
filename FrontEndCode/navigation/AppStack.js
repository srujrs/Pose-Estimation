import React, {useContext} from 'react';
import {View} from 'react-native';
import {createStackNavigator} from '@react-navigation/stack';
import Icon from 'react-native-vector-icons/MaterialIcons';
import {AuthContext} from '../navigation/AuthProvider';

import Home from '../screens/Home'

const Stack = createStackNavigator();

const AppStack = () => {
  const {logout} = useContext(AuthContext);
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Pose Estimator"
        component={Home}
        options={{
          headerTitleAlign: 'center',
          headerTitleStyle: {
            color: '#2e64e5',
            fontFamily: 'Kufam-SemiBoldItalic',
            fontSize: 18,
          },
          headerStyle: {
            shadowColor: '#fff',
            elevation: 0,
          },
          headerRight: () => (
            <View style={{marginRight: 10}}>
              <Icon.Button
                name="logout"
                size={22}
                backgroundColor="#fff"
                color="#2e64e5"
                onPress={() => logout()}
              />
            </View>
          ),
        }}
      />
  </Stack.Navigator>
  );
};

export default AppStack;

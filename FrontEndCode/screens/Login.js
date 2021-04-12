import React, {useContext, useState} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView
} from 'react-native';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import {AuthContext} from '../navigation/AuthProvider';

import { emailValidator } from '../utils/emailValidator'
import { passwordValidator } from '../utils/passwordValidator'

const Login = ({navigation}) => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [email_error, setEmailError] = useState();
  const [password_error, setPasswordError] = useState();


  const {login} = useContext(AuthContext);

  const onLoginPressed = () => {
    const emailError = emailValidator(email);
    const passwordError = passwordValidator(password);
    if(emailError || passwordError){
      setEmailError(emailError);
      setPasswordError(passwordError);
      return;
    }

    login(email, password)
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.text}>Pose Estimator</Text>

      <FormInput
        labelValue={email}
        onChangeText={(userEmail) => setEmail(userEmail)}
        placeholderText="Email"
        iconType="user"
        keyboardType="email-address"
        autoCapitalize="none"
        autoCorrect={false}
      />

      <Text style={styles.errmsg}>{email_error}</Text>

      <FormInput
        labelValue={password}
        onChangeText={(userPassword) => setPassword(userPassword)}
        placeholderText="Password"
        iconType="lock"
        secureTextEntry={true}
      />
      <Text style={styles.errmsg}>{password_error}</Text>

      <FormButton
        buttonTitle="Sign In"
        onPress={() => onLoginPressed()}
        // onPress = {() => {}}
      />

      <TouchableOpacity style={styles.forgotButton} onPress={() => {}}>
        <Text style={styles.navButtonText}>Forgot Password?</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.forgotButton}
        onPress={() => navigation.navigate('Signup')}>
        <Text style={styles.navButtonText}>
          Don't have an acount? Create here
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    paddingTop: 50
  },
  errmsg: {
    alignSelf: 'flex-start',
    color: '#f66'
  },
  logo: {
    height: 150,
    width: 150,
    resizeMode: 'cover',
  },
  text: {
    fontFamily: 'Kufam-SemiBoldItalic',
    fontSize: 28,
    marginBottom: 10,
    color: '#051d5f',
  },
  navButton: {
    marginTop: 15,
  },
  forgotButton: {
    marginVertical: 35,
  },
  navButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2e64e5',
    fontFamily: 'Lato-Regular',
  },
});
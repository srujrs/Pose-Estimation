import React, {useContext, useState} from 'react';
import {View, Text, TouchableOpacity, Platform, StyleSheet} from 'react-native';
import FormInput from '../components/FormInput';
import FormButton from '../components/FormButton';
import SocialButton from '../components/SocialButton';
import {AuthContext} from '../navigation/AuthProvider';

import { emailValidator } from '../utils/emailValidator'
import { passwordValidator } from '../utils/passwordValidator'
import { confirmPasswordValidator } from '../utils/confirmPasswordValidator'

const Signup = ({navigation}) => {
  const [email, setEmail] = useState();
  const [password, setPassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const [email_error, setEmailError] = useState();
  const [password_error, setPasswordError] = useState();
  const [confirmPassword_error, setConfirmPasswordError] = useState();

  const {register} = useContext(AuthContext);

  const onSignup = () => {
    const emailError = emailValidator(email);
    const passwordError = passwordValidator(password);
    const confirmPasswordError = confirmPasswordValidator(password, confirmPassword);
    if (emailError || passwordError || confirmPasswordError){
      setEmailError(emailError);
      setPasswordError(passwordError);
      setConfirmPasswordError(confirmPasswordError);
      return;
    }

    register(email, password)
  }

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Create an account</Text>

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

      <FormInput
        labelValue={confirmPassword}
        onChangeText={(userPassword) => setConfirmPassword(userPassword)}
        placeholderText="Confirm Password"
        iconType="lock"
        secureTextEntry={true}
      />
      <Text style={styles.errmsg}>{confirmPassword_error}</Text>

      <FormButton
        buttonTitle="Sign Up"
        onPress={() => onSignup()}
        // onPress = {() => {}}
      />


      <TouchableOpacity
        style={styles.navButton}
        onPress={() => navigation.navigate('Login')}>
        <Text style={styles.navButtonText}>Have an account? Sign In</Text>
      </TouchableOpacity>
    </View>
  );
};

export default Signup;

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#f9fafd',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errmsg: {
    alignSelf: 'flex-start',
    color: '#f66'
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
  navButtonText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#2e64e5',
    fontFamily: 'Lato-Regular',
  },
});
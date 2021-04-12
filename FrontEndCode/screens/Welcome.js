import React from 'react'
import { View , StyleSheet ,Text, Button} from 'react-native'
import FormButton from '../components/FormButton';

function Welcome({navigation}) {
    return (
        <View style={styles.container}>
            <Text style={{fontSize : 24, fontWeight: 'bold', padding: 48}}>Welcome</Text>
            <FormButton
              buttonTitle="Login"
              onPress={() => navigation.navigate('Login')}
            />
            <FormButton
              buttonTitle="Signup"
              onPress={() => navigation.navigate('Signup')}
            />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
      backgroundColor : '#f9fafd'
    }
  });

export default Welcome

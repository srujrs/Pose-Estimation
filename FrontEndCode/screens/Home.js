import React, { useContext, useState } from 'react'
import { View , Text, StyleSheet, Button, Image, ScrollView, Alert, ActivityIndicator} from 'react-native'
import {AuthContext} from '../navigation/AuthProvider';
import FormButton from '../components/FormButton';
import {windowWidth} from '../utils/Dimentions';
import ImgToBase64 from 'react-native-image-base64';

import * as ImagePicker from 'react-native-image-picker';

function Home() {
  const {user} = useContext(AuthContext);
  const [photo1, setPhoto1] = useState(null);
  const [photo2, setPhoto2] = useState(null);
  const [image1, setImage1] = useState(null);
  const [image2, setImage2] = useState(null);
  const [img1, setImg1] = useState(null);
  const [img2, setImg2] = useState(null);
  const [errImg, setErrImg] = useState(null);
  const [isLoading, setIsLoading] = useState(false); 
  const [matchPerc, setMatchPerc] = useState(0);

  const [error, setError] = useState('');

  const handleChoosePhoto1 = () => {
    const options = {mediaType : 'photo'};
    ImagePicker.launchImageLibrary(options, (response) => {
      // console.log("response", response);
      if(response.uri){
        setPhoto1(response);
        ImgToBase64.getBase64String(response.uri)
          .then(base64String => {setImage1(base64String)})
          .catch(err => console.log(err));
      }
    })
  }

  const handleChoosePhoto2 = () => {
    const options = {mediaType : 'photo'};
    ImagePicker.launchImageLibrary(options, (response) => {
      // console.log("response", response);
      if(response.uri){
        setPhoto2(response);
        ImgToBase64.getBase64String(response.uri)
          .then(base64String => {setImage2(base64String);})
          .catch(err => console.log(err));
      }
    })
  }

  // Handle Upload
  const handleUpload = () => {
    if(!(photo1 && photo2)){
      setError("You need to upload both images");
      return
    }
    setError('');
    var mystrings = [];
    mystrings[0] = image1;
    mystrings[1] = image2;

    var formdata = new FormData();
    formdata.append('javascript_data', JSON.stringify({
      'images': mystrings
    }));

    const requestOptions = {
      method: 'POST',
      headers: { 'Content-Type': 'multipart/form-data' },
      body: formdata,
    };

    setIsLoading(true);
    fetch('https://posestimation.pythonanywhere.com/comparejs', requestOptions)
        .then(async response => {
            const data = await response.text();

            // check for error response
            if (!response.ok) {
                // get error message from body or default to response status
                const error = (data && data.message) || response.status;
                return Promise.reject(error);
            }
            var result = JSON.parse(data)
            if(result.Success === "True"){
              setImg1(result.Image1);
              setImg2(result.Image2);
              setErrImg(result.ErrorImage)
              setMatchPerc(result.Match)
            }else{
              Alert.alert("Something went wrong", "please try different images");
            }
        })
        .catch(error => {
            // this.setState({ errorMessage: error.toString() });
            Alert.alert('There was an error!', error.toString());
        })
        .finally(() => setIsLoading(false));
  }
  return (
    <ScrollView contentContainerStyle={styles.container}>

          <View style={{flex: 1, alignItems: 'center', justifyContent: 'center', flexDirection: 'row'}}>
            <View style={{margin: 2}}>
              {
                photo1 && (
                  <Image source={{uri: photo1.uri}} style={{width: windowWidth*0.45, height: windowWidth*0.45}} />
                )
              }
              <Button 
                title = "Chooose Photo1"
                onPress = {() => handleChoosePhoto1()}
              />
              {
                img1 && (
                  <Image source={{uri: img1}} style={{width: windowWidth*0.45, height: windowWidth*0.45}} />
                )
              }
            </View>
            <View style={{margin: 2}}>
              {
                photo2 && (
                  <Image source={{uri: photo2.uri}} style={{width: windowWidth*0.45, height: windowWidth*0.45}} />
                )
              }
              <Button 
                title = "Chooose Photo2"
                onPress = {() => handleChoosePhoto2()}
              />
              {
                img2 && (
                  <Image source={{uri: img2}} style={{width: windowWidth*0.45, height: windowWidth*0.45}} />
                )
              }
            </View>
          </View>
          {
            isLoading &&
            <ActivityIndicator size="large" color="#0000ff" style={{padding: 20}}/>
          }
          {
            errImg && (
              <View>
                <Text style={{fontSize: 16, padding: 8, fontWeight: 'bold'}}>{"Match Percentage :" + matchPerc}</Text>
                <Image source={{uri: errImg}} style={{width: windowWidth*0.8, height: windowWidth*0.8}} />
              </View>
            )
          }
          <Text>{error}</Text>
          <FormButton 
            buttonTitle="Upload Images"
            onPress={() => handleUpload()}
          />
      </ScrollView>
  )
}

const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      padding : 12,
      flexGrow: 1
    }
  });


export default Home

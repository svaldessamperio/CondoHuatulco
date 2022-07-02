import { useNavigation } from '@react-navigation/native';
import { StackNavigationProp, StackScreenProps } from '@react-navigation/stack';
import React, { useContext } from 'react';
import { TouchableOpacity, View, ScrollView, Text, Image, KeyboardAvoidingView, Platform, StyleSheet, TouchableWithoutFeedback, Keyboard, Alert } from 'react-native';
import { Input } from 'react-native-elements';
import Icon  from 'react-native-vector-icons/Ionicons';
import messaging from '@react-native-firebase/messaging';
import auth from '@react-native-firebase/auth';

import { AuthContext } from '../context/AuthContext';
import { useForm } from '../hooks/useForm';
import { RootStackParams } from '../navigation/Navigator';
import gaAPI from '../api/gaAPI';


type screenProp = StackNavigationProp<RootStackParams, 'SignInScreen'>;
interface scrProps extends StackScreenProps<RootStackParams, 'SignInScreen'>{};

function registerToken(form:any) {
  const { userName } = form;
  
  const token = messaging().getToken().then((token) => {
    console.log('Token: ' + token);
    return token;
  })
  .catch((err)=>console.log(err));
  
  
  const userTokens = gaAPI.get('/api/users/getDeviceTokensByUser',{params:{email:userName}})
  .then((tokens)=> {
    let existeTokenNuevo = false;
    var tokenss = [];

    if (tokens.data.length > 0)  {
       tokenss = JSON.parse(tokens.data[0].token)
    }
    
    for (let i = 0; i < tokenss.length; i++) {
      const element = tokenss[i];
      //console.log('>>>>>>Element: ' + JSON.stringify(element,null,4) + '\n' + 'TOKEN: ' + JSON.stringify(token,null,4));
      if (JSON.stringify(element,null,4) === JSON.stringify(token,null,4)){
        existeTokenNuevo = true;
        //console.log('>>>>> EXISTE TOKEN');
      } else {
        //console.log('>>>>> NOOOOO EXISTE TOKEN');
      }
    }
    
    if (!existeTokenNuevo) {
      tokenss.push(token);
    }

    /** el valor del token para campaña en firebase */
    //console.log('!!!!!!!: '+ listaTokens[2].token._W);

    const saveTokens = gaAPI.post('/api/users/storeUserDeviceToken',{params:{email:userName, tokenObject: JSON.stringify(tokenss,null,4) }})
    .then((response)=>{
      //console.log('>>>>>>>>>>' + response.status);
    })
    .catch((err)=>
      console.log('Error al Guardar el tokenObject ' + err)
    );

  })
  .catch((err)=>console.log('Errorss:' + err));
}

export default function SignInScreen({ route } : scrProps ) {
  const { signIn } = useContext(AuthContext);
  const navigation = useNavigation<screenProp>();
  const params = route.params;

  const {form, error, isError, onChange} = useForm({
    userName: '',
    passWord: ''
  });

  const getError = (campo:string) => {
    let message:string ='';
    const returnMessage = (msg:any) => {return (message=msg)}
    Object.entries(error).forEach(([key, value]) => {
      if (key === campo) {
        returnMessage(value);
      }
    });
    return message;
  }
  const getFieldValue = (campo:string) => {
    let message:string ='';
    const returnMessage = (msg:any) => {return (message=msg)}
    Object.entries(form).forEach(([key, value]) => {
      if (key === campo){
        returnMessage(value);
      }
    });    
    return message;
  }

  const logIn = async(form:any)=> {
    
    const {userName, passWord} = form;

    console.log('-------->>> user: ' + userName + ' Pass: ' + passWord);
    const userCredential = await auth().signInWithEmailAndPassword(userName,passWord)
       .then(()=> {
           registerToken(form);
          signIn();
           if (params) {
             console.log('usuario firmado...' + JSON.stringify(params,null,4));
             if(params.notificationInfo) {
               const { notificationInfo } = params;
               navigation.navigate('NotificationsScreen', {notificationInfo});
             }
           }
       })
       .catch((err)=>{
         console.error('Error: ' + err);
       })
      
  }

  return (
    
    <KeyboardAvoidingView
    behavior={Platform.OS === "ios" ? "padding" : "height"}
    style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView
          style={[
            styles.container,
            { flex:1,
              flexDirection:'column'
            }
          ]}
        >
          <View style={{backgroundColor:'white'}}>
            <Image 
              source={require('../assets/GAautomotriz.jpg')} 
              style={{
                margin:10,
                resizeMode: 'contain',
                height:70,
              }}
            />            
          </View>

          <View style={{
            flexDirection:'row',
            // backgroundColor:'red'
            }}
          >
            <View style={{flex:1}}></View>
            <View style={{flex:10}}>
            <Text style={{
              marginTop: 75,
              color: 'white',
              fontFamily:'verdana',
              fontSize:30,
              fontWeight:'bold',
            }}>
              Bienvenido
            </Text>
            </View>
            <View style={{flex:1}}></View>
          </View>

          <View style={{
            flex:2,
            // backgroundColor:'red'
            }}
          >
            <View style={{flex:1,flexDirection:'row'}}>
              <View style={{flex:1}}></View>
              <View style={{flex:10}}>
                <Input
                  label='Usuario'
                  labelStyle={{fontSize:20, fontWeight:'bold', color:'white',marginTop:50}}
                  autoCompleteType={false}
                  autoCorrect={false}
                  placeholder="usuario"
                  containerStyle={styles.inputForm}
                  style = {{color:'white'}}
                  rightIcon= {
                    <Icon
                      name="information-circle-outline"
                      color='white'
                      size={30}
                      onPress={ ()=>
                        Alert.alert("Información", "Debe ingresar su correo electrónico corporativo, \n"
                         + "Si no tiene usuario, debe solicitarlo a la mesa de ayuda con un ticket")
                      }
                    />
                  }                  
                  leftIcon = {
                      <Icon
                          name="person-outline"
                          color='white'
                          size={30}
                      />
                  }
                  errorStyle={{ fontSize:20, color: 'red' }}
                  errorMessage={getError('userName')}
                  onChangeText={(value) => 
                    onChange(
                       value, 
                      'userName',
                      /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                      'Debe ingresar una dirección de correo válida'
                    )
                  }
                />
              </View>
              <View style={{flex:1}}></View>
            </View>

            <View style={{flex:1,flexDirection:'row',}}>
              <View style={{flex:1}}></View>
              <View style={{flex:10}}>
                <Input
                    label='Contraseña'
                    labelStyle={{fontSize:20, fontWeight:'bold', color:'white'}}
                    autoCompleteType={false}
                    secureTextEntry={true}
                    placeholder="contraseña"
                    containerStyle={styles.inputForm}
                    style = {{color:'white'}}
                    rightIcon= {
                      <Icon
                        name="information-circle-outline"
                        color='white'
                        size={30}
                        onPress={ ()=>
                          Alert.alert("Información","La contraseña debe estar compuesta por: \n" +
                          "* Entre 8 y 15 caracteres \n" +
                          "* Una mayúscula, \n" +
                          "* Una minúscula, \n" +
                          "* Un número y \n" +
                          "* Un caracter de los siguientes $@$!%#*?&",
                          [
                            { text: "OK"}
                          ]
                          )
                        }
                      />
                    }
                    leftIcon = {
                      <Icon
                          name="key-outline"
                          color='white'
                          size={30}
                      />
                    }
                    errorStyle={{ fontSize:20, color: 'red' }}
                    //errorMessage={error['passWord']}
                    errorMessage={getError('passWord')}
                    onChangeText={(value) => 
                      onChange(
                        value, 
                       'passWord',
                       /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@$!%#*?&])[A-Za-z\d$@$!%*?&]{8,15}/,
                       'Ingrese una contraseña válida'
                      )
                    }
                  />

              </View>
              <View style={{flex:1}}></View>
            </View>
          </View>

          <View
            style={{
              flex:1,
              marginTop:100,
              // backgroundColor:'yellow',
              justifyContent: 'flex-start',
              alignItems: 'center',
            }}
          >
            <TouchableOpacity
              onPress={ 
                ()=>logIn(form)
              }
              style={{
                height: 50,
                width: 150,
                justifyContent: 'center',
                alignItems: 'center',
                borderRadius:10,
                backgroundColor: isError ? '#abc9d6' : getFieldValue('passWord') === '' ? '#abc9d6' : '#39B2E6',
              }}
              disabled={isError ? true : getFieldValue('passWord') === '' ? true : false }
              activeOpacity={isError ? 0.2 : 1}
              >
                <Text
                  style={{
                    fontSize:20,
                    color:'white',
                    opacity: isError ? 0.3 : 1
                  }}
                >
                  Entrar
                </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#053b74',
  },
  inner: {
    padding: 24,
    flex: 1,
    justifyContent: "space-around"
  },
  header: {
    fontSize: 36,
    marginBottom: 48
  },
  textInput: {
    height: 40,
    borderColor: "#053b74",
    borderBottomWidth: 1,
    marginBottom: 36
  },
  btnContainer: {
    backgroundColor: "white",
    marginTop: 12
  },
  inputForm:{
    width: "100%",
    marginTop: 20,
},
iconRight: {
  color: "#c1c1c1",
},
});
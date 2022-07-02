import React, { useContext, useEffect, useState} from 'react';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import messaging from '@react-native-firebase/messaging';
import notifee, { AndroidBadgeIconType, AndroidImportance, EventType } from '@notifee/react-native';
import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/native';

import HomeScreen from '../screens/HomeScreen';
import SingInScreen from '../screens/SingInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import RecoverPasswordScreen from '../screens/RecoverPasswordScreen';
import PagosScreen from '../screens/PagosScreen';
import NotificationsScreen from '../screens/NotificationsScreen';
import ApprovalRequests from '../screens/ApprovalRequests';

type homeScreenProp = StackNavigationProp<RootStackParams, 'HomeScreen'>;

export type RootStackParams= {
    HomeScreen: undefined;
    PagosScreen: undefined;
    SignInScreen: {notificationInfo?:string};
    SignUpScreen: undefined;
    RecoverPasswordScreen:undefined;
    NotificationsScreen: {notificationInfo:string};
    ApprovalRequests: {idUser:string, idFilterType:string, filterName?: string};
}

const Stack = createStackNavigator<RootStackParams>();

// FCM Método para manejar las notificaciones en backgroud
// Register background handler
// const backgroundMessage = messaging().setBackgroundMessageHandler(async remoteMessage => {
//   //console.log('Message handled in the background!', remoteMessage);
//   console.log('Message handled in the background!');
//   var nextPage = null;
//   var id = null;
//   if (remoteMessage.data){
//     //console.log(JSON.stringify(remoteMessage,null,4));
  
//   //  id = remoteMessage.data.notifyId;
//   //  nextPage = remoteMessage.data.nextPage;
//   }
//   onDisplayNotification().then(() =>{
//     console.log("En el then de onDisplayNotification");
    
//   }).catch();
// });

function requestUserPermission() {
    const enabled=null;
    const authStatus =  messaging().requestPermission({
      announcement: true,
    }).then((status)=>{
      if (status === messaging.AuthorizationStatus.AUTHORIZED ||
      status === messaging.AuthorizationStatus.PROVISIONAL){
          console.log('Authorization status:', status);
      }
    });
  }

export default function Navigator() {
  const { authState } = useContext(AuthContext);
  const { isSignedIn } = authState;
  const navigation = useNavigation<homeScreenProp>();
  
  
  useEffect(() => {

    console.log('>>>>>>>>>>>> SignedIn: ' + isSignedIn);
    
    requestUserPermission();

    //Método que se ejecuta con FCM cuando la aplicacion es abierta desde una notificación
    // messaging().getInitialNotification().then(remoteMessage => {
    //   console.log('When the application is opened from a quit state:', remoteMessage?remoteMessage.notification:"");
    // });

    //Método FCM que se ejecuta cuando la app esta corriendo en fondo
    // messaging().onNotificationOpenedApp(remoteMessage => {
    //   console.log(
    //     'When the application is running, but in the background:',
    //     remoteMessage.notification,
    //   );
    //   // var nextPage = null;
    //   // var id = null;
    //   // if (remoteMessage.data){
    //   //   id = remoteMessage.data.notifyId;
    //   //   nextPage = remoteMessage.data.nextPage;
    //   //   navigation.navigate('SignInScreen',{nextPage: nextPage, id: id });
    //   // }
    // });

    //Método FCM para cuando la aplicación está corriendo y visible en el dispositivo.
    // const foregroundMessage = messaging().onMessage(async remoteMessage => {
    //   //Alert.alert('A new FCM message arrived!', JSON.stringify(remoteMessage));
    //   var nextPage = null;
    //   var id = null;
    //   if (remoteMessage.data){
    //     id = remoteMessage.data.notifyId;
    //     nextPage = remoteMessage.data.nextPage;
    //     if(!isSignedIn) {
    //         navigation.navigate('SignInScreen',{nextPage: nextPage, id: id });
    //     } else {
    //         navigation.navigate('NotificationsScreen', {idNotify: id});
    //     }
    //   }
    // });

    //Método Notifee
    const foregroundMessage =messaging().onMessage(async (message) => {
      const channelId = await notifee.createChannel({
        id: 'Aprobaciones',
        name: 'GA - Canal de Aprobaciones',
        badge: true,
        sound: 'default',
      });
    
      if (message && message.data && message.data.notifee) {
        const not = JSON.parse(message.data.notifee);
        not.android.channelId = channelId;
        not.android.badgeIconType = AndroidBadgeIconType.LARGE;
        not.android.importance = AndroidImportance.HIGH;
        not.android.badgeCount
        const notificationId = await notifee.displayNotification(not);

        await notifee
        .incrementBadgeCount()
        .then(() => notifee.getBadgeCount().then(count => console.log('Current badge count: ', count)))
        .then(count => console.log('Badge count incremented by 1 to: ', count));
        
        const payload = {
          notification: {
            id: notificationId,
          }
        }
        const msgModified = Object.assign(message, payload);

        // if (message.data){
        //   if(!isSignedIn) {
        //       navigation.navigate('SignInScreen',{notificationInfo: JSON.stringify(msgModified,null,4)});
        //   } else {
        //       navigation.navigate('NotificationsScreen', {notificationInfo: JSON.stringify(msgModified,null,4)});
        //   }
        // }        
      }
    });

    return ()=>{
        foregroundMessage();
//        backgroundMessage;
    }

  }, [isSignedIn])

  useEffect(() => {
    return notifee.onForegroundEvent(({ type, detail }) => {
      console.log(">>>>>>>>>>>>>>>> ONFORGROUND");
      
      switch (type) {
        case EventType.DISMISSED:
          console.log('User dismissed notification', detail.notification);
          break;
        case EventType.PRESS:
          console.log(">>>>>>>>> PRESSS" + JSON.stringify(detail,null,4));
          
          notifee
            .decrementBadgeCount()
            .then(() => notifee.getBadgeCount())
            .then(count => console.log('Badge count decremented by 1 to: ', count));
          
          if(!isSignedIn) {
            console.log(">>>>>>>>>NO FIRMADO");
            
            navigation.navigate('SignInScreen',{notificationInfo: JSON.stringify(detail,null,4)});
          } else {
            console.log(">>>>>>>>>SI FIRMADO");
            navigation.navigate('NotificationsScreen', {notificationInfo: JSON.stringify(detail,null,4)});
          }
          break;
      }
    });
  }, [isSignedIn]);
  
  return (
    (!isSignedIn ?
    (
        <Stack.Navigator
            initialRouteName={!isSignedIn?'SignInScreen':'HomeScreen'}
            screenOptions={{
                headerShown: false,
            }}
        >
            <Stack.Screen name="SignInScreen" component={SingInScreen} />
            <Stack.Screen name="SignUpScreen" component={SignUpScreen} />
            <Stack.Screen name="RecoverPasswordScreen" component={RecoverPasswordScreen} />
        </Stack.Navigator>
    ) : (
        <Stack.Navigator
            initialRouteName={!isSignedIn?'SignInScreen':'HomeScreen'}
        >
            <Stack.Screen name="HomeScreen" component={HomeScreen} />
            <Stack.Screen name="PagosScreen" component={PagosScreen}/>
            <Stack.Screen name="NotificationsScreen" component={NotificationsScreen}/>
            <Stack.Screen name="ApprovalRequests" component={ApprovalRequests}/>
        </Stack.Navigator>
    )
      )
  );
}

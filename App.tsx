import 'react-native-gesture-handler';
import { AppRegistry, LogBox } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import React, { useEffect } from 'react';
import notifee, { AndroidBadgeIconType, AndroidImportance, EventType } from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';


import Navigator from './src/navigation/Navigator';
import { AuthProvider } from './src/context/AuthContext';
import { useState } from 'react';

async function onMessageReceived(message:any) {

  const channelId = await notifee.createChannel({
    id: 'Aprobaciones',
    name: 'GA - Canal de Aprobaciones',
    badge: true,
    sound: 'default',
  });

const actionPayLoad = {
    id: 'default'
}

  const dat = message.data;
  const not = JSON.parse(dat.notifee);
  not.android.channelId = channelId;
  not.android.badgeIconType = AndroidBadgeIconType.SMALL;
  not.android.importance = AndroidImportance.HIGH;
  not.android.pressAction = actionPayLoad;
  not.android.badgeCount

  not.android.badgeIconType = AndroidBadgeIconType.LARGE,
  not.android.importance = AndroidImportance.HIGH,

  //await notifee.setBadgeCount(0).then(() => console.log('Badge count removed!'));

  await notifee
  .incrementBadgeCount()
  .then(() => notifee.getBadgeCount().then(count => console.log('Current badge count: ', count)))
  .then(count => console.log('Badge count incremented by 1 to: ', count));
    
  await notifee.displayNotification(not)

  // notifee.displayNotification({
  //   title: 'Notification Title',
  //   body: 'Main body content of the notification',
  //   android: {
  //     channelId,
  //     largeIcon: 'https://grupoandrade.com:8181/appclientesga/Images/ServicePricing.png',
  //     smallIcon: 'gaadminIcon',
  //     color: '#053b74',
  //     badgeIconType: AndroidBadgeIconType.LARGE,
  //     importance: AndroidImportance.HIGH,
  //   },
  // });

}

notifee.onBackgroundEvent(async ({ type, detail }) => {

  const { notification, pressAction } = detail;

  console.log('>>>>>>>>>>>>>> BACKGROUD EVENT' + detail);  

  // Check if the user pressed the "Mark as read" action
  if (type === EventType.ACTION_PRESS && (pressAction && pressAction.id === 'mark-as-read')) {
    // Update external API
    // await fetch(`https://my-api.com/chat/${notification.data.chatId}/read`, {
    //  method: 'POST',
    // });

    // Remove the notification
    if (notification && notification.id) {
      await notifee.cancelNotification(notification.id);
      await notifee
        .decrementBadgeCount()
        .then(() => notifee.getBadgeCount())
        .then(count => console.log('Badge count decremented by 1 to: ', count));
    }
  }
});

const backgroundMessage =messaging().setBackgroundMessageHandler(onMessageReceived);

AppRegistry.registerComponent('app', () => App);

export default function App() {
  
  LogBox.ignoreLogs([
    "[react-native-gesture-handler] Seems like you\'re using an old API with gesture components, check out new Gestures system!",
    "AsyncStorage has been extracted from react-native core and will be removed in a future release. It can now be installed and imported from '@react-native-async-storage/async-storage' instead of 'react-native'. See https://github.com/react-native-async-storage/async-storage",
  ]);

  return (
    <NavigationContainer>
      <AppState>
        <Navigator/> 
      </AppState>       
    </NavigationContainer>
  );
}


const AppState = ({children}:{children:any}) => {

  useEffect(() => {
    
    return ()=>{
      //foregroundMessage();
      //backgroundMessage;
  }
  }, [])
  
  return (
    <AuthProvider>
      {children}
    </AuthProvider>
  )
}
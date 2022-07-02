import React, { useEffect } from 'react';
import { View, Text } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack'
import { RootStackParams } from '../navigation/Navigator'
import notifee from '@notifee/react-native';


interface scrProps extends StackScreenProps<RootStackParams, 'NotificationsScreen'>{};

export default function NotificationsScreen({route}: scrProps) {
  const notificationInfo = JSON.parse(route.params.notificationInfo);

  useEffect(() => {
    if (notificationInfo){
      notifee.cancelNotification(notificationInfo.notification.id);
    }
  }, []);
  
  return (
    <View>
      <Text>NotificationsScreen.... {route.params.notificationInfo?route.params.notificationInfo:'CERO'} </Text>
    </View>
  )
}
import { View, Text, Button, SafeAreaView, FlatList, ActivityIndicator } from 'react-native';
import React, { useContext, useEffect, useState } from 'react';

import { AuthContext } from '../context/AuthContext';
import { useNavigation } from '@react-navigation/core';
import { RootStackParams } from '../navigation/Navigator';
import { StackNavigationProp } from '@react-navigation/stack';
import NotificationTypeCard from '../components/NotificationTypeCard';
import { useResumenNotifications } from '../hooks/useResumenNotifications';

type homeScreenProp = StackNavigationProp<RootStackParams, 'HomeScreen'>;

const Item = ({title}:any ) => (
  <View>
    <Text>{title}</Text>
  </View>
);

export default function HomeScreen() {
  const { signOut } = useContext(AuthContext);
  const navigation = useNavigation<homeScreenProp>();
  const logout = () => {
    signOut();
    //Se quita la última notificacion consultada
    navigation.navigate('SignInScreen',{});
  }
  const idUsuario:string = '71';
  const {isLoading, DATA} = useResumenNotifications(idUsuario);

  return (
    <SafeAreaView>
     
      <View style={{flexDirection: 'column', alignContent: 'space-between' }}>
        {isLoading?
          <ActivityIndicator size={30} color={'blue'} style={{ marginTop: 20 }}/>
        :
          <View style={{ alignItems: 'center'}}>
            <FlatList
              numColumns={ 2 }
              data={DATA}
              renderItem={ ({ item }) => (
                <NotificationTypeCard card={item} />
              )}
              keyExtractor={item => item.idFilterType}
            />
          </View>
        }

        <View style={{backgroundColor: 'blue'}}>
          <Button
            title='SignOut'
            onPress={() => logout()}
          />
          <Button
            title='Pagos'
            onPress={ () => navigation.navigate('PagosScreen') }
          />             
        </View>
      </View>
      
    </SafeAreaView>
  );
}

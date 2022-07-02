import { View, Text, FlatList, ActivityIndicator } from 'react-native';
import React, { useEffect } from 'react'
import { StackScreenProps } from '@react-navigation/stack';
import { RootStackParams } from '../navigation/Navigator';
import { useApprovalRequests } from '../hooks/useApprovalRequests';

const Item = ( { item }:any ) => (
    <View 
        style={{
            flex: 1, 
            backgroundColor: 'white',
            borderRadius: 10,
            margin: 5,
        }}
    >
        <Text 
            style={{
            fontWeight: 'bold',
            color: 'black',
            fontSize: 20,
            }}
        >
            {item.identificador}
        </Text>
        
        <Text>
            {item.descripcionLarga}
        </Text>

    </View>
  );

interface Props extends StackScreenProps<RootStackParams, 'ApprovalRequests'>{};

export default function ApprovalRequests({ route, navigation }:Props) {
    const {idUser, idFilterType, filterName} = route.params;
    const {isLoading, approvals} = useApprovalRequests(idUser, idFilterType);

    useEffect(() => {
        navigation.setOptions({
            title: filterName,
        });
    }, [])

  return (
    <View>
        {isLoading ?
            <ActivityIndicator size={30} color="blue" style={{ marginTop: 20 }}/>
            :
            <FlatList
            data={approvals}
            renderItem={({ item }) => (
                <Item item={item.notificacion} />
            )}
            keyExtractor={item => item.id}
          />
        }
    </View>
  )
}
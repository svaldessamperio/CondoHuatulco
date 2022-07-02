import { View, Text, StyleSheet, TouchableOpacity } from 'react-native'
import React from 'react'
import { useNavigation } from '@react-navigation/native';
import { NotTypeCard } from '../interfaces/NotificationInterface';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParams } from '../navigation/Navigator';


type approvalRequestProps = StackNavigationProp<RootStackParams, 'ApprovalRequests'>;

interface Props {
    card: NotTypeCard
}

export default function NotificationTypeCard({card}:Props) {
    const {idUser, idFilterType, filterName, notificationsNumber} = card;
    const navigation = useNavigation<approvalRequestProps>();

  return (
    <View >
        <TouchableOpacity
            style={styles.NotTypeContainer}
            onPress={() => {
                navigation.navigate('ApprovalRequests', { idUser, idFilterType, filterName });
            }}
        >
            <View style={{flexDirection:'column', alignItems:'center'}}> 
                <Text style={{fontSize:20, fontFamily:'verdana', color:'#f5f7f7', fontWeight: 'bold'}}>{filterName}</Text>
                <Text style={{fontSize:40, fontFamily:'verdana', color:'#f5f7f7', justifyContent: 'center'}}>{notificationsNumber}</Text>         
            </View>
        </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
    NotTypeContainer: {
        justifyContent: 'center',
        margin:5,
        width: 190, height: 100,
        backgroundColor: '#2e8bb3',
        borderRadius: 10,
    },
});
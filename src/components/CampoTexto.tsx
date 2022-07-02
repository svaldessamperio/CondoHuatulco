import { View, Text, TextInput } from 'react-native';
import React from 'react';

interface Props {
    etiqueta:string;
    placeholder:string;
    labelStyle?:{};
    inputStyle?:{};
    secureTextEntry?:false|true;
    placeHolderColor:string;
    name?: string;
    onChangei?: (value:any, campo:string) => void;
}

export default function CampoTexto ({
    etiqueta,
    placeholder,
    labelStyle,
    inputStyle,
    placeHolderColor,
    name,
    onChangei}:Props) {
  return (
    <View>
        {/* <Text style={labelStyle}>
            {etiqueta}
        </Text> */}
        <TextInput
            style={inputStyle}
            placeholder={placeholder}
            placeholderTextColor={placeHolderColor}
            onChangeText={(value)=>onChangei?onChangei(value, name?name:''):console.log('SALUDOS')} 
        />
    </View>
  );
}

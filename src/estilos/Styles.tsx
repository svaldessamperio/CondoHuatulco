import { StyleSheet } from "react-native";
import { withSafeAreaInsets } from "react-native-safe-area-context";

export const styles = StyleSheet.create ({
    colorFondo: {
        backgroundColor: '#053b74',        
    },
    etiquetaCampo: {
        fontSize: 15,
        fontFamily: 'Verdana',
        color: 'white',

    },
    campoInput: {
        fontSize: 15,
        backgroundColor: 'white',
        color: '#053b74',
        borderRadius: 10,
    }
});

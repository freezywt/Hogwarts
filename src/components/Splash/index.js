import React from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator } from 'react-native';

import hat from '../../Assets/hat.png';

function SplashScreen(){
    return(
        <View style={styles.container}>
            <Image source={hat} style={styles.logo} />
            <ActivityIndicator size={50} color="#F6F6F6" style={styles.activityIndicator}/>
        </View>
    )
}

export default SplashScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#242633',
        alignItems: 'center',
        justifyContent: 'center',
    },
    logo: {
        width: 300,
        height: 228,
    },
    activityIndicator: {
        width: 150,
        height: 150,
    }
})
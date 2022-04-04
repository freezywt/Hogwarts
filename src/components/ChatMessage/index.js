import React, { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';

import auth from '@react-native-firebase/auth';

function ChatMessage({data}){

    const user = auth().currentUser.toJSON();

    const isMyMessage = useMemo(() => {
        return data?.user?._id === user.uid
    }, [data])

    return(
        <View style={styles.container}>
            <View 
                style={[
                    styles.messageBox,
                    {
                        backgroundColor: isMyMessage ? '#EAE8E8' : '#FAF6F0',
                        marginLeft: isMyMessage ? 50 : 0,
                        marginRight: isMyMessage ? 0 : 50,
                    }
                ]}
            >
                { !isMyMessage && 
                    <Text style={styles.name}>{data?.user?.displayName}</Text>
                }
                <Text style={styles.message}>{data.text}</Text>
            </View>
        </View>
    )
}

export default ChatMessage;

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    messageBox: {
        borderRadius: 5,
        padding: 10,
    },
    name: {
        color: '#121212',
        fontWeight: 'bold',
        marginBottom: 5,
    },
    message: {
        color: '#757575',
    }
})
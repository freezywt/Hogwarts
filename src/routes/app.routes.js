import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import SignIn from '../pages/SignIn';
import Chat from '../pages/Chat';
import Messages from '../pages/Messages';
import Search from '../pages/Search';

const AppStack = createNativeStackNavigator();

function AppRoutes(){
    return(
        <AppStack.Navigator initialRouteName='Chat'>
            <AppStack.Screen 
                name="SignIn"
                component={SignIn}
                options={ 
                    {
                       headerStyle: {
                        backgroundColor: '#2E303D',
                        borderBottomWidth: 1, 
                       }, 
                       headerTintColor: '#DCDCDC',
                       headerTitle: 'Login',
                    }
                }
            />
            <AppStack.Screen 
                name='Chat'
                component={Chat}
                options={{
                    headerShown: false,
                }}
            />
            <AppStack.Screen 
                name='Messages'
                component={Messages}
                options={ 
                    {
                       headerStyle: {
                        backgroundColor: '#2E303D',
                        borderBottomWidth: 1, 
                       }, 
                       headerTintColor: '#DCDCDC',
                       headerTitle: 'Voltar',
                    }
                }
            />
            <AppStack.Screen 
                name='Search'
                component={Search}
                options={ 
                    {
                       headerStyle: {
                        backgroundColor: '#2E303D',
                        borderBottomWidth: 1, 
                       }, 
                       headerTintColor: '#DCDCDC',
                       headerTitle: 'Procurando alguma casa?',
                    }
                }
            />
        </AppStack.Navigator>
    )
}

export default AppRoutes;
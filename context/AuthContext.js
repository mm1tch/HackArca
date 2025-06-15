import React, { createContext, useState, useEffect, useContext } from 'react';
import * as SecureStore from 'expo-secure-store';
import { jwtDecode } from 'jwt-decode'; // For decoding the JWT on the client side
import { View, ActivityIndicator } from 'react-native';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [userToken, setUserToken] = useState(null);
    const [isAdmin, setIsAdmin] = useState(false);
    const [userName, setUserName] = useState(null);

    useEffect(() => {
        const loadToken = async () => {
            try {
                const token = await SecureStore.getItemAsync('userToken');
                if (token) {
                    setUserToken(token);
                    const decodedToken = jwtDecode(token);
                    setIsAdmin(decodedToken.isAdmin || false);
                    setUserName(decodedToken.username || 'Guest');
                }
            } catch (e) {
                console.error('Failed to load token:', e);
            } finally {
                setIsLoading(false);
            }
        };
        loadToken();
    }, []);

    const authContext = React.useMemo(() => ({
        signIn: async (token) => {
            await SecureStore.setItemAsync('userToken', token);
            setUserToken(token);
            const decodedToken = jwtDecode(token);
            setIsAdmin(decodedToken.isAdmin || false);
            setUserName(decodedToken.username || 'Guest');
        },
        signOut: async () => {
            await SecureStore.deleteItemAsync('userToken');
            setUserToken(null);
            setIsAdmin(false);
            setUserName(null);
        },
        userToken,
        isAdmin,
        userName,
        isLoading,
    }), [userToken, isAdmin, userName, isLoading]);

    if (isLoading) {
        return (
            <View style={{ flex:1, justifyContent:'center', alignItems:'center' }}>
                <ActivityIndicator size="large" />
            </View>
        );
    }

    return (
        <AuthContext.Provider value={authContext}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

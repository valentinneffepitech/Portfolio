import AsyncStorage from '@react-native-async-storage/async-storage';
import React, { useEffect, useState } from 'react';

const AuthContext = React.createContext(false);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(false);

    const [country, setCountry] = useState("fr");

    const [update, setUpdate] = useState(0);

    async function retrieveUserFromStorage() {
        try {
            const storedUser = await AsyncStorage.getItem('user');
            if (storedUser !== null) {
                return storedUser;
            }
            return false;
        } catch (error) {
            console.error(error);
        }
    }

    const refresh = () => {
        setUpdate(prev => prev + 1);
    }

    const setAuthInfo = async (name, token = "", hash = "") => {
        if (name == false) {
            setUser(false);
            await AsyncStorage.removeItem('user')
            return;
        }
        setUser({ name, token, hash });
        await AsyncStorage.setItem('user', JSON.stringify(user));
        return true;
    };

    return (
        <AuthContext.Provider value={{ user: user, authenticate: setAuthInfo, country: country, localise: setCountry, checkIfUser: retrieveUserFromStorage, update: update, refresh: refresh }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;
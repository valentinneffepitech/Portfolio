import React, { createContext, useContext, useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";

export const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);

    const login = () => {
        setUser(true);
    }

    const logout = () => {
        setUser(null);
    }

    return (
        <AuthContext.Provider
            value={{ user, login, logout }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export function RequireAuth({ children }) {
    const nav = useNavigate();

    const { user } = useContext(AuthContext);

    useEffect(() => {
        if (!user) {
            nav('/login');
        }
    }, [user, nav]);

    if (!user) return null;

    return children;
}
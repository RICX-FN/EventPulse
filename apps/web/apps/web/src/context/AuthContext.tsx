import React, { useState, type ReactNode } from 'react';
import { AuthContext, type User } from './auth-context';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(() => {
        if (typeof window === 'undefined') {
            return null;
        }

        const storedToken = localStorage.getItem('@EventPulse:token');
        const storedUser = localStorage.getItem('@EventPulse:user');

        if (!storedToken || !storedUser) {
            return null;
        }

        try {
            return JSON.parse(storedUser) as User;
        } catch {
            return null;
        }
    });
    const [loading] = useState(false);

    const login = (token: string, userData: User) => {
        localStorage.setItem('@EventPulse:token', token);
        localStorage.setItem('@EventPulse:user', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('@EventPulse:token');
        localStorage.removeItem('@EventPulse:user');
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useSegments } from 'expo-router';
import React, { createContext, useContext, useEffect, useState } from 'react';

type User = {
    name: string;
} | null;

type AuthContextType = {
    user: User;
    signIn: (name: string) => Promise<void>;
    signOut: () => Promise<void>;
    isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    signIn: async () => { },
    signOut: async () => { },
    isLoading: true,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const segments = useSegments();

    useEffect(() => {
        const loadUser = async () => {
            try {
                const storedUser = await AsyncStorage.getItem('user');
                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
            } catch (e) {
                console.error('Failed to load user', e);
            } finally {
                setIsLoading(false);
            }
        };

        loadUser();
    }, []);

    useEffect(() => {
        if (isLoading) return;

        const inAuthGroup = segments[0] === '(auth)';

        if (!user && !inAuthGroup) {
            // If user is not signed in and not in the auth group, redirect to landing
            // We'll handle this navigation logic in individual pages or a protected route component
            // for better control, but for this simple flow, we can also do it here.
            // However, let's stick to the plan of checking auth state in _layout or pages.
        } else if (user && (segments[0] !== 'home')) {
            // If user is signed in, redirect to home if not already there
            // Actually, let's keep it simple. The requirement says:
            // "If the app detects the credentials already exist in local storage, skip the login page and go directly to the home page."
        }
    }, [user, isLoading, segments]);

    const signIn = async (name: string) => {
        const newUser = { name };
        setUser(newUser);
        await AsyncStorage.setItem('user', JSON.stringify(newUser));
        router.replace('/home');
    };

    const signOut = async () => {
        setUser(null);
        await AsyncStorage.removeItem('user');
        router.replace('/');
    };

    return (
        <AuthContext.Provider value={{ user, signIn, signOut, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
}

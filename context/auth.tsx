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



        if (user && segments[0] !== 'home') {
            // If user is signed in and not in home, redirect to home
            // This handles the "skip landing/login" requirement
            router.replace('/home');
        } else if (!user && segments[0] === 'home') {
            // If user is not signed in and tries to access home, redirect to landing
            router.replace('/');
        }
    }, [user, isLoading, segments]);

    const signIn = async (name: string) => {
        // Hardcoded validation
        if (name === 'Samii') { // Password check should be done in Login component before calling this, or here.
            // The prompt says "Login Page ... Hardcoded credentials ... If credentials are incorrect...".
            // It's cleaner to keep the credential check in the Login component for the password specific error
            // OR to pass password here. The current `signIn` signature only takes `name`.
            // Let's update `signIn` to take nothing or just `name` after validation is done in UI,
            // OR update it to validation.
            // The existing `signIn` takes `name`.
            // The current `login.tsx` does validity check BEFORE calling `signIn`.
            // "if (name === 'Samii' && password === '%TGBnhy6') { await signIn(name); }"
            // This is fine. I will keep `signIn` as just setting the user.

            const newUser = { name };
            setUser(newUser);
            await AsyncStorage.setItem('user', JSON.stringify(newUser));
            router.replace('/home');
        }
    };

    const signOut = async () => {
        setUser(null);
        await AsyncStorage.removeItem('user');
        router.replace('/');
    };

    return (
        <AuthContext.Provider value={{ user, signIn, signOut, isLoading }}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
}

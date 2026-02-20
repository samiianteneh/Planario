import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter, useSegments } from 'expo-router';
import React, { createContext, useContext, useEffect, useState } from 'react';

type User = {
    name: string;
} | null;

type Account = {
    name: string;
    password: string;
} | null;

type AuthContextType = {
    user: User;
    account: Account;
    register: (name: string, password: string) => Promise<void>;
    login: (name: string, password: string) => Promise<string | null>;
    signOut: () => Promise<void>;
    isLoading: boolean;
};

const AuthContext = createContext<AuthContextType>({
    user: null,
    account: null,
    register: async () => { },
    login: async () => { return null; },
    signOut: async () => { },
    isLoading: true,
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User>(null);
    const [account, setAccount] = useState<Account>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();
    const segments = useSegments();

    useEffect(() => {
        const loadInitialData = async () => {
            try {
                const [storedUser, storedAccount] = await Promise.all([
                    AsyncStorage.getItem('user'),
                    AsyncStorage.getItem('account')
                ]);

                if (storedUser) {
                    setUser(JSON.parse(storedUser));
                }
                if (storedAccount) {
                    setAccount(JSON.parse(storedAccount));
                }
            } catch (e) {
                console.error('Failed to load initial data', e);
            } finally {
                setIsLoading(false);
            }
        };

        loadInitialData();
    }, []);

    useEffect(() => {
        if (isLoading) return;

        if (!user && segments[0] === 'home') {
            // If user is not signed in and tries to access home, redirect to landing
            router.replace('/');
        }
    }, [user, isLoading, segments]);

    const analyzePlans = async () => {
        try {
            const storedPlans = await AsyncStorage.getItem('plans');
            if (!storedPlans) return;

            let plans: any[];
            try {
                plans = JSON.parse(storedPlans);
                if (!Array.isArray(plans)) throw new Error('Plans is not an array');
            } catch (e) {
                console.error('Failed to parse plans, resetting to empty array:', e);
                await AsyncStorage.setItem('plans', JSON.stringify([]));
                return;
            }

            const now = new Date();
            const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const thirtyDaysLimit = 30;

            const filteredPlans = plans.filter((plan: any) => {
                if (!plan || !plan.date) return false;

                const planDate = new Date(plan.date);
                if (isNaN(planDate.getTime())) return false;

                // Normalize plan date to start of its day
                const normalizedPlanDate = new Date(planDate.getFullYear(), planDate.getMonth(), planDate.getDate());

                // Calculate difference in days
                // Positive means plan is in the past
                // Negative means plan is in the future
                const diffTime = today.getTime() - normalizedPlanDate.getTime();
                const diffDays = diffTime / (1000 * 60 * 60 * 24);

                // Keep if it's in the future OR it was within the last 30 days
                return diffDays <= thirtyDaysLimit;
            });

            await AsyncStorage.setItem('plans', JSON.stringify(filteredPlans));
        } catch (e) {
            console.error('Critical error in analyzePlans:', e);
        }
    };

    const register = async (name: string, password: string) => {
        const trimmedName = name.trim();
        const newAccount = { name: trimmedName, password };
        const newUser = { name: trimmedName };

        await AsyncStorage.setItem('account', JSON.stringify(newAccount));
        await AsyncStorage.setItem('user', JSON.stringify(newUser));

        setAccount(newAccount);
        setUser(newUser);

        await analyzePlans();
        router.replace('/home');
    };

    const login = async (name: string, password: string): Promise<string | null> => {
        const trimmedName = name.trim();

        const storedAccount = await AsyncStorage.getItem('account');
        if (!storedAccount) return 'No account found';

        const accountData = JSON.parse(storedAccount);

        if (trimmedName === accountData.name && password === accountData.password) {
            const newUser = { name: accountData.name };
            await AsyncStorage.setItem('user', JSON.stringify(newUser));
            setUser(newUser);

            await analyzePlans();
            router.replace('/home');
            return null;
        } else {
            return 'Invalid credentials';
        }
    };

    const signOut = async () => {
        setUser(null);
        await AsyncStorage.removeItem('user');
        router.replace('/');
    };

    return (
        <AuthContext.Provider value={{ user, account, register, login, signOut, isLoading }}>
            {!isLoading && children}
        </AuthContext.Provider>
    );
}

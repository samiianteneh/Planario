import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useAuth } from '../context/auth';

export default function Login() {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [nameError, setNameError] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const { signIn } = useAuth();
    const router = useRouter();

    const handleLogin = async () => {
        // Reset errors
        setNameError('');
        setPasswordError('');

        let isValid = true;

        if (!name.trim()) {
            setNameError('Empty Name');
            isValid = false;
        }

        if (!password.trim()) {
            setPasswordError('Empty Password');
            isValid = false;
        }

        if (!isValid) return;

        if (name === 'Samii' && password === '%TGBnhy6') {
            await signIn(name);
        } else {
            // Determine which one is wrong or both
            // The prompt says: "incorect name, pr incorect password"
            // Since we don't have a backend to tell us which one, and for security it's usually better to be vague,
            // BUT the user specifically asked for "Incorrect Name" or "Incorrect Password".
            // Since I have hardcoded credentials, I can know EXACTLY which one is wrong.

            if (name !== 'Samii') {
                setNameError('Incorrect Name');
            } else if (password !== '%TGBnhy6') {
                setPasswordError('Incorrect Password');
            }
        }
    };

    return (
        <View className="flex-1 bg-gray-900">
            <StatusBar style="light" />
            <ImageBackground
                source={require('../assets/images/landing-bg.png')}
                className="flex-1"
                resizeMode="cover"
                blurRadius={5}
            >
                <KeyboardAvoidingView
                    behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                    className="flex-1 justify-center px-8"
                >
                    <View className="bg-black/40 p-8 rounded-3xl border border-white/10 backdrop-blur-md">
                        <Text className="text-white text-3xl font-bold text-center mb-8 tracking-wider">
                            LOGIN
                        </Text>

                        <View className="space-y-4">
                            <View>
                                <Text className="text-gray-300 ml-1 mb-2 text-sm font-medium">Name</Text>
                                <TextInput
                                    className={`bg-white/10 text-white p-4 rounded-xl border ${nameError ? 'border-red-500' : 'border-white/10'} focus:border-teal-500/50`}
                                    placeholder="Enter your name"
                                    placeholderTextColor="#6b7280"
                                    value={name}
                                    onChangeText={(text) => {
                                        setName(text);
                                        if (nameError) setNameError('');
                                    }}
                                    autoCapitalize="none"
                                />
                                {nameError ? <Text className="text-red-500 text-sm mt-1 ml-1">{nameError}</Text> : null}
                            </View>

                            <View>
                                <Text className="text-gray-300 ml-1 mb-2 text-sm font-medium">Password</Text>
                                <View className="relative">
                                    <TextInput
                                        className={`bg-white/10 text-white p-4 rounded-xl border ${passwordError ? 'border-red-500' : 'border-white/10'} focus:border-teal-500/50 pr-12`}
                                        placeholder="Enter your password"
                                        placeholderTextColor="#6b7280"
                                        secureTextEntry={!showPassword}
                                        value={password}
                                        onChangeText={(text) => {
                                            setPassword(text);
                                            if (passwordError) setPasswordError('');
                                        }}
                                    />
                                    <TouchableOpacity
                                        className="absolute right-4 top-4"
                                        onPress={() => setShowPassword(!showPassword)}
                                    >
                                        <Ionicons
                                            name={showPassword ? 'eye-off' : 'eye'}
                                            size={24}
                                            color="#6b7280"
                                        />
                                    </TouchableOpacity>
                                </View>
                                {passwordError ? <Text className="text-red-500 text-sm mt-1 ml-1">{passwordError}</Text> : null}
                            </View>

                            <TouchableOpacity
                                className="bg-teal-600 p-4 rounded-xl mt-6 active:bg-teal-700"
                                onPress={handleLogin}
                            >
                                <Text className="text-white text-center font-bold text-lg tracking-wide">
                                    LOG IN
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </KeyboardAvoidingView>
            </ImageBackground>
        </View>
    );
}

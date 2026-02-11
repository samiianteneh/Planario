import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    Alert,
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
    const { signIn } = useAuth();

    const handleLogin = async () => {
        if (name === 'Samii' && password === '%TGBnhy6') {
            await signIn(name);
        } else {
            Alert.alert('Login Failed', 'Invalid credentials');
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
                            WELCOME BACK
                        </Text>

                        <View className="space-y-4">
                            <View>
                                <Text className="text-gray-300 ml-1 mb-2 text-sm font-medium">Name</Text>
                                <TextInput
                                    className="bg-white/10 text-white p-4 rounded-xl border border-white/10 focus:border-teal-500/50"
                                    placeholder="Enter your name"
                                    placeholderTextColor="#6b7280"
                                    value={name}
                                    onChangeText={setName}
                                    autoCapitalize="none"
                                />
                            </View>

                            <View>
                                <Text className="text-gray-300 ml-1 mb-2 text-sm font-medium">Password</Text>
                                <TextInput
                                    className="bg-white/10 text-white p-4 rounded-xl border border-white/10 focus:border-teal-500/50"
                                    placeholder="Enter your password"
                                    placeholderTextColor="#6b7280"
                                    secureTextEntry
                                    value={password}
                                    onChangeText={setPassword}
                                />
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

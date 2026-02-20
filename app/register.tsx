import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import {
    ImageBackground,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Text,
    TextInput,
    TouchableOpacity,
    View
} from 'react-native';
import { useAuth } from '../context/auth';

export default function Register() {
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [errors, setErrors] = useState({
        name: '',
        password: '',
        confirmPassword: ''
    });

    const { register } = useAuth();
    const router = useRouter();

    const handleRegister = async () => {
        // Reset errors
        setErrors({ name: '', password: '', confirmPassword: '' });

        let hasError = false;
        const newErrors = { name: '', password: '', confirmPassword: '' };

        if (!name.trim()) {
            newErrors.name = 'Name is required';
            hasError = true;
        }

        if (!password) {
            newErrors.password = 'Password is required';
            hasError = true;
        }

        if (password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
            hasError = true;
        }

        if (hasError) {
            setErrors(newErrors);
            return;
        }

        await register(name, password);
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
                    className="flex-1"
                >
                    <ScrollView contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', paddingHorizontal: 32 }}>
                        <View className="bg-black/40 p-8 rounded-3xl border border-white/10 backdrop-blur-md">
                            <Text className="text-white text-3xl font-bold text-center mb-8 tracking-wider">
                                REGISTER
                            </Text>

                            <View className="space-y-4">
                                <View>
                                    <Text className="text-gray-300 ml-1 mb-2 text-sm font-medium">Name</Text>
                                    <TextInput
                                        className={`bg-white/10 text-white p-4 rounded-xl border ${errors.name ? 'border-red-500' : 'border-white/10'} focus:border-teal-500/50`}
                                        placeholder="Enter your name"
                                        placeholderTextColor="#6b7280"
                                        value={name}
                                        onChangeText={(text) => {
                                            setName(text);
                                            if (errors.name) setErrors({ ...errors, name: '' });
                                        }}
                                        autoCapitalize="none"
                                    />
                                    {errors.name ? <Text className="text-red-500 text-sm mt-1 ml-1">{errors.name}</Text> : null}
                                </View>

                                <View>
                                    <Text className="text-gray-300 ml-1 mb-2 text-sm font-medium">Password</Text>
                                    <View className="relative">
                                        <TextInput
                                            className={`bg-white/10 text-white p-4 rounded-xl border ${errors.password ? 'border-red-500' : 'border-white/10'} focus:border-teal-500/50 pr-12`}
                                            placeholder="Enter your password"
                                            placeholderTextColor="#6b7280"
                                            secureTextEntry={!showPassword}
                                            value={password}
                                            onChangeText={(text) => {
                                                setPassword(text);
                                                if (errors.password) setErrors({ ...errors, password: '' });
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
                                    {errors.password ? <Text className="text-red-500 text-sm mt-1 ml-1">{errors.password}</Text> : null}
                                </View>

                                <View>
                                    <Text className="text-gray-300 ml-1 mb-2 text-sm font-medium">Confirm Password</Text>
                                    <View className="relative">
                                        <TextInput
                                            className={`bg-white/10 text-white p-4 rounded-xl border ${errors.confirmPassword ? 'border-red-500' : 'border-white/10'} focus:border-teal-500/50 pr-12`}
                                            placeholder="Confirm your password"
                                            placeholderTextColor="#6b7280"
                                            secureTextEntry={!showConfirmPassword}
                                            value={confirmPassword}
                                            onChangeText={(text) => {
                                                setConfirmPassword(text);
                                                if (errors.confirmPassword) setErrors({ ...errors, confirmPassword: '' });
                                            }}
                                        />
                                        <TouchableOpacity
                                            className="absolute right-4 top-4"
                                            onPress={() => setShowConfirmPassword(!showConfirmPassword)}
                                        >
                                            <Ionicons
                                                name={showConfirmPassword ? 'eye-off' : 'eye'}
                                                size={24}
                                                color="#6b7280"
                                            />
                                        </TouchableOpacity>
                                    </View>
                                    {errors.confirmPassword ? <Text className="text-red-500 text-sm mt-1 ml-1">{errors.confirmPassword}</Text> : null}
                                </View>

                                <TouchableOpacity
                                    className="bg-teal-600 p-4 rounded-xl mt-6 active:bg-teal-700"
                                    onPress={handleRegister}
                                >
                                    <Text className="text-white text-center font-bold text-lg tracking-wide">
                                        REGISTER
                                    </Text>
                                </TouchableOpacity>

                                <TouchableOpacity
                                    onPress={() => router.push('/')}
                                    className="mt-4"
                                >
                                    <Text className="text-gray-400 text-center text-sm">
                                        Back to Landing
                                    </Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </ScrollView>
                </KeyboardAvoidingView>
            </ImageBackground>
        </View>
    );
}

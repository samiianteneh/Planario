import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Alert, ImageBackground, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PasswordChange() {
    const { top } = useSafeAreaInsets();
    const router = useRouter();
    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: ''
    });
    const [errors, setErrors] = useState({
        current: '',
        new: '',
        confirm: ''
    });

    const handleSave = () => {
        // Reset errors
        const newErrors = { current: '', new: '', confirm: '' };
        let hasError = false;

        if (!passwords.current) {
            newErrors.current = 'Current password is required';
            hasError = true;
        }
        if (!passwords.new) {
            newErrors.new = 'New password is required';
            hasError = true;
        }
        if (!passwords.confirm) {
            newErrors.confirm = 'Please confirm your new password';
            hasError = true;
        } else if (passwords.new !== passwords.confirm) {
            newErrors.confirm = 'Passwords do not match';
            hasError = true;
        }

        if (hasError) {
            setErrors(newErrors);
            return;
        }

        // Simulating success
        Alert.alert("Success", "Password changed successfully.", [
            { text: "OK", onPress: () => router.back() }
        ]);
    };

    return (
        <View className="flex-1">
            <StatusBar style="light" />
            <ImageBackground
                source={require('../../../assets/images/landing-bg.png')}
                className="flex-1"
                resizeMode="cover"
                blurRadius={5}
            >
                <View style={{ paddingTop: top + 20, paddingHorizontal: 20 }} className="flex-1">
                    <View className="flex-row items-center mb-8">
                        <TouchableOpacity onPress={() => router.back()} className="bg-white/10 p-2 rounded-full mr-4">
                            <Ionicons name="arrow-back" size={24} color="white" />
                        </TouchableOpacity>
                        <Text className="text-white text-2xl font-bold">Change Password</Text>
                    </View>

                    <View className="space-y-4">
                        <View>
                            <Text className="text-white/60 text-sm mb-2 ml-1">Current Password</Text>
                            <TextInput
                                secureTextEntry
                                placeholder="Enter current password"
                                placeholderTextColor="rgba(255,255,255,0.3)"
                                className={`bg-white/5 border ${errors.current ? 'border-red-500' : 'border-white/10'} p-4 rounded-2xl text-white`}
                                value={passwords.current}
                                onChangeText={(t) => {
                                    setPasswords(p => ({ ...p, current: t }));
                                    if (errors.current) setErrors(e => ({ ...e, current: '' }));
                                }}
                            />
                            {errors.current ? <Text className="text-red-500 text-xs mt-1 ml-1">{errors.current}</Text> : null}
                        </View>

                        <View>
                            <Text className="text-white/60 text-sm mb-2 ml-1">New Password</Text>
                            <TextInput
                                secureTextEntry
                                placeholder="Enter new password"
                                placeholderTextColor="rgba(255,255,255,0.3)"
                                className={`bg-white/5 border ${errors.new ? 'border-red-500' : 'border-white/10'} p-4 rounded-2xl text-white`}
                                value={passwords.new}
                                onChangeText={(t) => {
                                    setPasswords(p => ({ ...p, new: t }));
                                    if (errors.new) setErrors(e => ({ ...e, new: '' }));
                                }}
                            />
                            {errors.new ? <Text className="text-red-500 text-xs mt-1 ml-1">{errors.new}</Text> : null}
                        </View>

                        <View>
                            <Text className="text-white/60 text-sm mb-2 ml-1">Confirm New Password</Text>
                            <TextInput
                                secureTextEntry
                                placeholder="Confirm new password"
                                placeholderTextColor="rgba(255,255,255,0.3)"
                                className={`bg-white/5 border ${errors.confirm ? 'border-red-500' : 'border-white/10'} p-4 rounded-2xl text-white`}
                                value={passwords.confirm}
                                onChangeText={(t) => {
                                    setPasswords(p => ({ ...p, confirm: t }));
                                    if (errors.confirm) setErrors(e => ({ ...e, confirm: '' }));
                                }}
                            />
                            {errors.confirm ? <Text className="text-red-500 text-xs mt-1 ml-1">{errors.confirm}</Text> : null}
                        </View>

                        <TouchableOpacity
                            onPress={handleSave}
                            className="bg-teal-600 p-5 rounded-2xl mt-6 items-center"
                        >
                            <Text className="text-white font-bold text-lg">Update Password</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
        </View>
    );
}

import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Alert, ImageBackground, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PlanTimeSetting() {
    const { top } = useSafeAreaInsets();
    const router = useRouter();
    const [selectedTime, setSelectedTime] = useState('08:00 AM');
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const loadSavedTime = async () => {
            try {
                const savedTime = await AsyncStorage.getItem('plan_reminder_time');
                if (savedTime) {
                    setSelectedTime(savedTime);
                }
            } catch (e) {
                console.error('Failed to load plan reminder time', e);
            } finally {
                setIsLoading(false);
            }
        };
        loadSavedTime();
    }, []);

    const handleSave = async () => {
        // Basic time validation (HH:MM AM/PM)
        const timeRegex = /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?(AM|PM)$/i;
        if (!timeRegex.test(selectedTime)) {
            Alert.alert("Invalid Format", "Please enter time in HH:MM AM/PM format (e.g., 08:30 AM)");
            return;
        }

        try {
            await AsyncStorage.setItem('plan_reminder_time', selectedTime);
            Alert.alert("Success", `Plan reminder set for ${selectedTime.toUpperCase()}`, [
                { text: "OK", onPress: () => router.back() }
            ]);
        } catch (e) {
            Alert.alert("Error", "Failed to save settings.");
        }
    };

    if (isLoading) return null;

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
                    <View className="mb-8 pl-12">
                        <Text className="text-white text-3xl font-bold">Reminder Time</Text>
                    </View>

                    <Text className="text-white/60 text-sm mb-2 ml-1">Manual Time Entry</Text>
                    <View className="relative mb-8">
                        <TextInput
                            placeholder="e.g., 08:00 AM"
                            placeholderTextColor="rgba(255,255,255,0.3)"
                            className="bg-white/5 border border-white/10 p-5 rounded-2xl text-white text-xl font-bold text-center"
                            value={selectedTime}
                            onChangeText={setSelectedTime}
                            autoCapitalize="characters"
                        />
                        <View className="absolute left-5 top-5">
                            <Ionicons name="time-outline" size={24} color="#2dd4bf" />
                        </View>
                    </View>

                    <Text className="text-white/40 text-xs leading-relaxed px-1">
                        Enter your preferred time for daily planning reminders. Format should be HH:MM AM/PM.
                    </Text>

                    <TouchableOpacity
                        onPress={handleSave}
                        className="bg-teal-600 p-5 rounded-2xl mt-auto mb-10 items-center"
                    >
                        <Text className="text-white font-bold text-lg">Save Preference</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </View>
    );
}

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Alert, ImageBackground, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PlanTimeSetting() {
    const { top } = useSafeAreaInsets();
    const router = useRouter();
    const [selectedTime, setSelectedTime] = useState('08:00 AM');

    const times = ['06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM'];

    const handleSave = () => {
        Alert.alert("Success", `Plan reminder set for ${selectedTime}`, [
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
                        <Text className="text-white text-2xl font-bold">Reminder Time</Text>
                    </View>

                    <Text className="text-white/60 text-base mb-6 px-1">
                        Select when you'd like to receive your daily plan notification.
                    </Text>

                    <View className="space-y-3">
                        {times.map((time) => (
                            <TouchableOpacity
                                key={time}
                                onPress={() => setSelectedTime(time)}
                                className={`flex-row items-center justify-between p-5 rounded-2xl border ${selectedTime === time
                                        ? 'bg-teal-600/20 border-teal-500'
                                        : 'bg-white/5 border-white/5'
                                    }`}
                            >
                                <Text className={`text-lg ${selectedTime === time ? 'text-teal-400 font-bold' : 'text-white'}`}>
                                    {time}
                                </Text>
                                {selectedTime === time && (
                                    <Ionicons name="checkmark-circle" size={24} color="#2dd4bf" />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>

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

import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Alert, ImageBackground, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ReportPeriodSetting() {
    const { top } = useSafeAreaInsets();
    const router = useRouter();
    const [selectedPeriod, setSelectedPeriod] = useState('Evening (8 PM)');

    const periods = [
        'Evening (6 PM)',
        'Evening (8 PM)',
        'Late Night (10 PM)',
        'Next Morning (8 AM)'
    ];

    const handleSave = () => {
        Alert.alert("Success", `Report alert set for ${selectedPeriod}`, [
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
                        <Text className="text-white text-2xl font-bold">Report Period</Text>
                    </View>

                    <Text className="text-white/60 text-base mb-6 px-1">
                        When should we remind you to report your daily progress?
                    </Text>

                    <View className="space-y-3">
                        {periods.map((period) => (
                            <TouchableOpacity
                                key={period}
                                onPress={() => setSelectedPeriod(period)}
                                className={`flex-row items-center justify-between p-5 rounded-2xl border ${selectedPeriod === period
                                        ? 'bg-purple-600/20 border-purple-500'
                                        : 'bg-white/5 border-white/5'
                                    }`}
                            >
                                <Text className={`text-lg ${selectedPeriod === period ? 'text-purple-400 font-bold' : 'text-white'}`}>
                                    {period}
                                </Text>
                                {selectedPeriod === period && (
                                    <Ionicons name="checkmark-circle" size={24} color="#a855f7" />
                                )}
                            </TouchableOpacity>
                        ))}
                    </View>

                    <TouchableOpacity
                        onPress={handleSave}
                        className="bg-purple-600 p-5 rounded-2xl mt-auto mb-10 items-center"
                    >
                        <Text className="text-white font-bold text-lg">Save Preference</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </View>
    );
}

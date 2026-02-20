import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Alert, ImageBackground, Platform, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ReportPeriodSetting() {
    const { top } = useSafeAreaInsets();
    const router = useRouter();
    const [date, setDate] = useState(new Date());
    const [showPicker, setShowPicker] = useState(Platform.OS === 'ios');
    const [isLoading, setIsLoading] = useState(true);

    const formatTime = (date: Date) => {
        let hours = date.getHours();
        const minutes = date.getMinutes();
        const ampm = hours >= 12 ? 'PM' : 'AM';
        hours = hours % 12;
        hours = hours ? hours : 12;
        const strMinutes = minutes < 10 ? '0' + minutes : minutes;
        const strHours = hours < 10 ? '0' + hours : hours;
        return `${strHours}:${strMinutes} ${ampm}`;
    };

    const parseTime = (timeStr: string) => {
        const [time, ampm] = timeStr.split(' ');
        let [hours, minutes] = time.split(':').map(Number);
        if (ampm?.toUpperCase() === 'PM' && hours < 12) hours += 12;
        if (ampm?.toUpperCase() === 'AM' && hours === 12) hours = 0;
        const d = new Date();
        d.setHours(hours, minutes, 0, 0);
        return d;
    };

    useEffect(() => {
        const loadSavedTime = async () => {
            try {
                const savedTime = await AsyncStorage.getItem('report_alert_time');
                if (savedTime) {
                    setDate(parseTime(savedTime));
                }
            } catch (e) {
                console.error('Failed to load report alert time', e);
            } finally {
                setIsLoading(false);
            }
        };
        loadSavedTime();
    }, []);

    const onChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
        const currentDate = selectedDate || date;
        setShowPicker(Platform.OS === 'ios');
        setDate(currentDate);
    };

    const handleSave = async () => {
        const timeStr = formatTime(date);
        try {
            await AsyncStorage.setItem('report_alert_time', timeStr);
            Alert.alert("Success", `Report alert set for ${timeStr}`, [
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
                        <Text className="text-white text-3xl font-bold">Report Period</Text>
                    </View>

                    <Text className="text-white/60 text-sm mb-4 ml-1">Select Time</Text>

                    <View className="bg-white/5 border border-white/10 p-6 rounded-3xl items-center mb-6">
                        {Platform.OS === 'android' && (
                            <TouchableOpacity
                                onPress={() => setShowPicker(true)}
                                className="flex-row items-center bg-purple-600/20 px-6 py-4 rounded-2xl border border-purple-500/50"
                            >
                                <Ionicons name="notifications-outline" size={24} color="#a855f7" className="mr-3" />
                                <Text className="text-white text-2xl font-bold ml-2">
                                    {formatTime(date)}
                                </Text>
                            </TouchableOpacity>
                        )}

                        {showPicker && (
                            <DateTimePicker
                                value={date}
                                mode="time"
                                is24Hour={false}
                                display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                onChange={onChange}
                                textColor="white"
                                themeVariant="dark"
                                style={{ height: 200, width: '100%' }}
                            />
                        )}
                    </View>

                    <Text className="text-white/40 text-xs leading-relaxed px-4 text-center">
                        Pick a time to review and report your daily progress.
                    </Text>

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

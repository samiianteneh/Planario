import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Alert, ImageBackground, Platform, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function PlanTimeSetting() {
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
                const savedTime = await AsyncStorage.getItem('plan_reminder_time');
                if (savedTime) {
                    setDate(parseTime(savedTime));
                }
            } catch (e) {
                console.error('Failed to load plan reminder time', e);
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
            await AsyncStorage.setItem('plan_reminder_time', timeStr);
            Alert.alert("Success", `Plan reminder set for ${timeStr}`, [
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

                    <View className="flex-1 justify-center pb-20">
                        <Text className="text-white/60 text-sm mb-4 text-center uppercase tracking-widest">Select Time</Text>

                        <View className="bg-white/5 border border-white/10 p-8 rounded-[40px] items-center mb-8 shadow-2xl">
                            {Platform.OS === 'web' ? (
                                <View className="items-center w-full">
                                    <View className="w-full max-w-[200px]">
                                        <input
                                            type="time"
                                            value={date.toTimeString().slice(0, 5)}
                                            onChange={(e) => {
                                                const [hours, minutes] = e.target.value.split(':');
                                                const newDate = new Date(date);
                                                newDate.setHours(parseInt(hours), parseInt(minutes));
                                                setDate(newDate);
                                            }}
                                            style={{
                                                width: '100%',
                                                padding: '12px',
                                                borderRadius: '12px',
                                                backgroundColor: 'rgba(255,255,255,0.05)',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                color: 'white',
                                                fontSize: '18px',
                                                textAlign: 'center',
                                                cursor: 'pointer'
                                            }}
                                        />
                                    </View>
                                </View>
                            ) : Platform.OS === 'android' ? (
                                <TouchableOpacity
                                    onPress={() => setShowPicker(true)}
                                    className="flex-row items-center bg-teal-600/20 px-8 py-5 rounded-2xl border border-teal-500/50"
                                >
                                    <Ionicons name="time-outline" size={28} color="#2dd4bf" />
                                    <Text className="text-white text-3xl font-bold ml-3">
                                        {formatTime(date)}
                                    </Text>
                                </TouchableOpacity>
                            ) : Platform.OS === 'ios' ? (
                                <View className="flex-row items-center mb-4 opacity-60">
                                    <Ionicons name="time-outline" size={20} color="#2dd4bf" />
                                    <Text className="text-white text-sm font-medium ml-2">Adjust with wheel below</Text>
                                </View>
                            ) : null}

                            {showPicker && Platform.OS !== 'web' && (
                                <DateTimePicker
                                    value={date}
                                    mode="time"
                                    is24Hour={false}
                                    display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                                    onChange={onChange}
                                    textColor="white"
                                    themeVariant="dark"
                                    style={{ height: 220, width: '100%' }}
                                />
                            )}
                        </View>

                        <Text className="text-white/40 text-sm leading-relaxed px-10 text-center">
                            Set your daily notification time to stay consistent with your goals.
                        </Text>
                    </View>

                    <TouchableOpacity
                        onPress={handleSave}
                        className="bg-teal-600 p-5 rounded-2xl mb-10 items-center shadow-lg active:opacity-80"
                    >
                        <Text className="text-white font-bold text-lg">Save Preference</Text>
                    </TouchableOpacity>
                </View>
            </ImageBackground>
        </View>
    );
}

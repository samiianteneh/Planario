import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { Alert, ImageBackground, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function Setting() {
    const { top } = useSafeAreaInsets();
    const router = useRouter();

    const loadDefaultPlans = async () => {
        const defaultData = [
            { "tasks": [{ "id": 1, "title": "gbhnb", "status": "Pending" }, { "id": 2, "title": "nm", "status": "Pending" }], "date": "February 20, 2026 at 02:56:02 PM", "status": "Unreported", "rate": 0 },
            { "tasks": [{ "id": 1, "title": "test 1", "status": "Achieved" }, { "id": 2, "title": "test 2", "status": "Achieved" }, { "id": 3, "title": "test 3", "status": "Achieved" }, { "id": 4, "title": "test 4", "status": "Achieved" }, { "id": 5, "title": "test 5", "status": "Achieved" }, { "id": 6, "title": "test 6", "status": "Achieved" }], "date": "February 21, 2026 at 09:58:51 PM", "status": "Reported", "rate": 90 },
            { "tasks": [{ "id": 1, "title": "Task: Research competitor features", "status": "Achieved" }, { "id": 2, "title": "Task: Research competitor features", "status": "Achieved" }, { "id": 3, "title": "Task: Research competitor features", "status": "Failed" }, { "id": 4, "title": "Task: Research competitor features", "status": "Failed" }], "date": "February 13 2026, 5:32:55 PM", "status": "Reported", "rate": 50 },
            { "tasks": [{ "id": 1, "title": "Task: Research competitor features", "status": "Achieved" }, { "id": 2, "title": "Task: Research competitor features", "status": "Achieved" }, { "id": 3, "title": "Task: Research competitor features", "status": "Failed" }, { "id": 4, "title": "Task: Research competitor features", "status": "Pending" }], "date": "February 12 2026, 5:32:55 PM", "status": "Reported", "rate": 50 },
            { "tasks": [{ "id": 1, "title": "test 1", "status": "Achieved" }, { "id": 2, "title": "test 2", "status": "Achieved" }, { "id": 3, "title": "test 3", "status": "Pending" }, { "id": 4, "title": "test 4", "status": "Pending" }, { "id": 5, "title": "test 5", "status": "Pending" }, { "id": 6, "title": "test 6", "status": "Pending" }], "date": "February 11, 2026 at 09:58:51 PM", "status": "Reported", "rate": 0 },
            { "tasks": [{ "id": 1, "title": "Task: Research competitor features", "status": "Achieved" }, { "id": 2, "title": "Task: Research competitor features", "status": "Achieved" }, { "id": 3, "title": "Task: Research competitor features", "status": "Failed" }, { "id": 4, "title": "Task: Research competitor features", "status": "Failed" }], "date": "February 10 2026, 5:32:55 PM", "status": "Reported", "rate": 50 }
        ];

        Alert.alert(
            "Load Default Plans",
            "This will overwrite your existing plans. Are you sure?",
            [
                { text: "Cancel", style: "cancel" },
                {
                    text: "Load",
                    onPress: async () => {
                        try {
                            await AsyncStorage.setItem('plans', JSON.stringify(defaultData));
                            Alert.alert("Success", "Default plans have been loaded.");
                        } catch (e) {
                            Alert.alert("Error", "Failed to save plans.");
                        }
                    }
                }
            ]
        );
    };

    const SettingItem = ({ title, icon, onPres, color = "text-white" }: { title: string, icon: any, onPres: () => void, color?: string }) => (
        <TouchableOpacity
            onPress={onPres}
            className="flex-row items-center justify-between p-5 mb-3 bg-white/5 rounded-2xl border border-white/5"
        >
            <View className="flex-row items-center">
                <View className="bg-white/10 p-2 rounded-xl mr-4">
                    <Ionicons name={icon} size={22} color="white" />
                </View>
                <Text className={`${color} text-lg font-medium`}>{title}</Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="rgba(255,255,255,0.3)" />
        </TouchableOpacity>
    );

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
                        <Text className="text-white text-3xl font-bold">Settings</Text>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View className="mb-6">
                            <Text className="text-white/40 text-xs font-bold uppercase mb-3 ml-1 tracking-widest">Account</Text>
                            <SettingItem
                                title="Change Password"
                                icon="lock-closed-outline"
                                onPres={() => router.push('/home/setting/password')}
                            />
                        </View>

                        <View className="mb-6">
                            <Text className="text-white/40 text-xs font-bold uppercase mb-3 ml-1 tracking-widest">Notifications</Text>
                            <SettingItem
                                title="Plan Reminder Time"
                                icon="time-outline"
                                onPres={() => router.push('/home/setting/plan-time')}
                            />
                            <SettingItem
                                title="Report Alert Period"
                                icon="notifications-outline"
                                onPres={() => router.push('/home/setting/report-period')}
                            />
                        </View>

                        <View className="mb-6">
                            <Text className="text-white/40 text-xs font-bold uppercase mb-3 ml-1 tracking-widest">Data Management</Text>
                            <SettingItem
                                title="Load Default Plans"
                                icon="cloud-download-outline"
                                onPres={loadDefaultPlans}
                                color="text-teal-400"
                            />
                        </View>

                        <View className="items-center py-6 opacity-30">
                            <Text className="text-white text-xs">Planario v1.0.0</Text>
                        </View>
                    </ScrollView>
                </View>
            </ImageBackground>
        </View>
    );
}

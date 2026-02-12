import { Ionicons } from '@expo/vector-icons';
import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { ImageBackground, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Mock Data based on image
const plans = [
    {
        tasks: [
            {
                id: 1,
                title: 'Task: Research competitor features',
                associated: 'Associated KR: Complete development by Q2 end',
                status: 'Achieved', // Green
                icon: 'checkmark-circle-outline',
                iconColor: '#22c55e', // green-500
            },
            {
                id: 2,
                title: 'Task: Research competitor features',
                associated: 'Associated KR: Complete development by Q2 end',
                status: 'Achieved', // Green
                icon: 'checkmark-circle-outline',
                iconColor: '#22c55e',
            },
            {
                id: 3,
                title: 'Task: Research competitor features',
                associated: 'Associated KR: Complete development by Q2 end',
                status: 'Failed', // Red
                icon: 'close-circle-outline', // X with circle
                iconColor: '#ef4444', // red-500
            },
            {
                id: 4,
                title: 'Task: Research competitor features',
                associated: 'Associated KR: Complete development by Q2 end',
                status: 'Pending', // Yellow
                icon: 'time-outline', // Clock
                iconColor: '#eab308', // yellow-500
            },
        ],
        date: "February 12 2026, 5:32:55 PM",
        status: "Unreported"
    },
    {
        tasks: [
            {
                id: 1,
                title: 'Task: Research competitor features',
                associated: 'Associated KR: Complete development by Q2 end',
                status: 'Achieved', // Green
                icon: 'checkmark-circle-outline',
                iconColor: '#22c55e', // green-500
            },
            {
                id: 2,
                title: 'Task: Research competitor features',
                associated: 'Associated KR: Complete development by Q2 end',
                status: 'Achieved', // Green
                icon: 'checkmark-circle-outline',
                iconColor: '#22c55e',
            },
            {
                id: 3,
                title: 'Task: Research competitor features',
                associated: 'Associated KR: Complete development by Q2 end',
                status: 'Failed', // Red
                icon: 'close-circle-outline', // X with circle
                iconColor: '#ef4444', // red-500
            },
            {
                id: 4,
                title: 'Task: Research competitor features',
                associated: 'Associated KR: Complete development by Q2 end',
                status: 'Pending', // Yellow
                icon: 'time-outline', // Clock
                iconColor: '#eab308', // yellow-500
            },
        ],
        date: "February 11 2026, 5:32:55 PM",
        status: "Reported"
    }
]


export default function Plan() {
    const { top } = useSafeAreaInsets();
    const hasUnreported: boolean = plans.some(
        (item: any) => item.status === "Unreported"
    );

    return (
        <View className="flex-1">
            <StatusBar style="light" />
            <ImageBackground
                source={require('../../assets/images/landing-bg.png')}
                className="flex-1"
                resizeMode="cover"
                blurRadius={5}
            >


                <View style={{ paddingTop: top + 10, paddingHorizontal: 16, paddingBottom: 20 }} className="flex-1">
                    {/* Header */}
                    <View className="flex-row justify-between items-center mb-6 pl-12">
                        {/* pl-12 to avoid overlap with menu button from layout */}
                        <Text className="text-white text-3xl font-bold">Planning</Text>

                    </View>

                    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                        {/* Plan Card */}
                        <View className="rounded-3xl p-5 mb-6 shadow-sm">
                            {/* Plan Header */}
                            <View className="flex-row justify-between items-center mb-1">
                                <Text className="text-white text-lg font-bold">Plan</Text>
                                <TouchableOpacity className="bg-white/10 px-4 py-2 rounded-lg">

                                    <Text className="text-white font-medium">
                                        {hasUnreported ? "Report" : "Plan"}
                                    </Text>
                                </TouchableOpacity>
                            </View>
                            <View className="space-y-4">

                                {
                                    plans.map((plan) => (
                                        <View className='border border-gray-100 rounded-2xl p-4'>
                                            <View className="flex-row items-center mb-4">
                                                <Text className="text-gray-400 text-xs font-medium ml-2">{plan.date}</Text>
                                            </View>



                                            {/* Tasks List */}
                                            <View className="space-y-2">
                                                {plan.tasks.map((task) => (
                                                    <View key={task.id} className="border border-gray-100 rounded-2xl p-4">
                                                        <View className="flex-row justify-between items-start mb-2">
                                                            <View className="flex-row items-start flex-1 mr-2">
                                                                <Ionicons name={task.icon as any} size={24} color={task.iconColor} style={{ marginTop: 2 }} />
                                                                <View className="ml-3 flex-1">
                                                                    <Text className="text-gray-300 font-bold text-base mb-1">{task.title}</Text>
                                                                </View>
                                                            </View>
                                                            <TouchableOpacity>
                                                                {plan.status === "Unreported" ? (
                                                                    <Ionicons name="ellipsis-vertical" size={20} color="#9ca3af" />
                                                                ) : ""}
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                ))}
                                            </View>
                                        </View>
                                    ))
                                }
                            </View>

                        </View>


                    </ScrollView>
                </View>
            </ImageBackground>
        </View>
    );
}

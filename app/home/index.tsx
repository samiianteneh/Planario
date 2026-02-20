import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFocusEffect } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import React, { useCallback, useState } from 'react';
import { ImageBackground, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface Task {
    id: number;
    title: string;
    status: string;
}

interface Plan {
    tasks: Task[];
    date: string;
    status: string;
    rate: number;
}

export default function Dashboard() {
    const { top } = useSafeAreaInsets();
    const [stats, setStats] = useState({
        avgRate: 0,
        totalPlans: 0,
        totalTasks: 0,
        achievedTasks: 0,
        failedTasks: 0,
        achieveRate: 0,
        failRate: 0,
        highestRate: 0,
        lowestRate: 100,
        reportedCount: 0,
    });
    const [loading, setLoading] = useState(true);

    useFocusEffect(
        useCallback(() => {
            loadStats();
        }, [])
    );

    const loadStats = async () => {
        try {
            setLoading(true);
            const storedPlans = await AsyncStorage.getItem('plans');
            if (storedPlans) {
                const plans: Plan[] = JSON.parse(storedPlans);
                const reportedPlans = plans.filter(p => p.status === 'Reported');

                if (reportedPlans.length > 0) {
                    let totalRate = 0;
                    let totalTasks = 0;
                    let achievedTasks = 0;
                    let failedTasks = 0;
                    let highest = 0;
                    let lowest = 100;

                    reportedPlans.forEach(plan => {
                        totalRate += plan.rate;
                        totalTasks += plan.tasks.length;
                        achievedTasks += plan.tasks.filter(t => t.status === 'Achieved').length;
                        failedTasks += plan.tasks.filter(t => t.status === 'Failed').length;
                        if (plan.rate > highest) highest = plan.rate;
                        if (plan.rate < lowest) lowest = plan.rate;
                    });

                    setStats({
                        avgRate: Math.round(totalRate / reportedPlans.length),
                        totalPlans: plans.length,
                        totalTasks,
                        achievedTasks,
                        failedTasks,
                        achieveRate: totalTasks > 0 ? Math.round((achievedTasks / totalTasks) * 100) : 0,
                        failRate: totalTasks > 0 ? Math.round((failedTasks / totalTasks) * 100) : 0,
                        highestRate: highest,
                        lowestRate: lowest,
                        reportedCount: reportedPlans.length,
                    });
                } else {
                    setStats(prev => ({ ...prev, totalPlans: plans.length }));
                }
            }
        } catch (error) {
            console.error('Failed to load stats:', error);
        } finally {
            setLoading(false);
        }
    };

    const getMotivation = (rate: number) => {
        if (rate >= 90) return "Legendary! You're crushing your goals.";
        if (rate >= 80) return "Excellent work! Keep up the momentum.";
        if (rate >= 60) return "Good progress. Aim higher tomorrow!";
        if (rate >= 40) return "Every step counts. Stay focused.";
        return "New day, new chance. Let's step it up!";
    };

    const StatCard = ({ title, value, icon, color }: { title: string, value: string | number, icon: any, color: string }) => (
        <View className="bg-white/10 p-4 rounded-3xl flex-1 items-center justify-center border border-white/5">
            <View className={`p-2 rounded-full mb-2 ${color}/20`}>
                <Ionicons name={icon} size={20} color={color} />
            </View>
            <Text className="text-white/60 text-xs font-medium mb-1">{title}</Text>
            <Text className="text-white text-lg font-bold">{value}</Text>
        </View>
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
                <ScrollView
                    className="flex-1"
                    contentContainerStyle={{ paddingTop: top + 20, paddingHorizontal: 20, paddingBottom: 40 }}
                >
                    {/* Header */}
                    <View className="mb-8 pl-12">
                        <Text className="text-white/60 text-lg">Your Progress</Text>
                        {/* <Text className="text-white text-3xl font-bold">Dashboard</Text> */}
                    </View>

                    {/* Circular Score Highlight */}
                    <View className="items-center mb-8">
                        <View className="w-52 h-52 items-center justify-center rounded-full border-4 border-teal-500/30 bg-teal-500/10 shadow-xl shadow-teal-500/50">
                            <View className="items-center">
                                <Text className="text-teal-400 text-5xl font-black">{stats.avgRate}%</Text>
                                <Text className="text-white/60 text-sm font-medium">Avg. Success</Text>
                            </View>
                        </View>
                        <Text className="text-white/80 text-center italic mt-6 px-4">
                            "{getMotivation(stats.avgRate)}"
                        </Text>
                    </View>

                    {/* Stats Grid */}
                    <View className="flex-row gap-4 mb-4">
                        <StatCard
                            title="Achieve Rate"
                            value={`${stats.achieveRate}%`}
                            icon="shield-checkmark-outline"
                            color="#22c55e"
                        />
                        <StatCard
                            title="Failed Rate"
                            value={`${stats.failRate}%`}
                            icon="close-circle-outline"
                            color="#ef4444"
                        />
                    </View>

                    <View className="flex-row gap-4 mb-4">
                        <StatCard
                            title="Highest Score"
                            value={`${stats.highestRate}%`}
                            icon="trending-up-outline"
                            color="#22c55e"
                        />
                        <StatCard
                            title="Lowest Score"
                            value={`${stats.lowestRate === 100 && stats.reportedCount === 0 ? 0 : stats.lowestRate}%`}
                            icon="trending-down-outline"
                            color="#ef4444"
                        />
                    </View>

                    {/* <View className="flex-row gap-4 mb-6">
                        <StatCard
                            title="Total Tasks"
                            value={stats.achievedTasks}
                            icon="checkmark-done-circle-outline"
                            color="#06b6d4"
                        />
                        <StatCard
                            title="Total Plans"
                            value={stats.totalPlans}
                            icon="calendar-outline"
                            color="#a855f7"
                        />
                    </View> */}

                    {/* Summary Card */}
                    <View className="bg-white/10 p-6 rounded-3xl border border-white/5">
                        <Text className="text-white text-lg font-bold mb-4">Task Distribution</Text>

                        <View className="space-y-4">
                            <View>
                                <View className="flex-row justify-between mb-2">
                                    <Text className="text-white/70 text-sm">Status: Achieved vs Failed</Text>
                                    <Text className="text-white font-medium">
                                        {stats.achievedTasks} <Text className="text-green-500">A</Text> / {stats.failedTasks} <Text className="text-red-500">F</Text> / {stats.totalTasks} <Text className="text-white/50">T</Text>
                                    </Text>
                                </View>
                                <View className="h-3 bg-gray-400 rounded-full overflow-hidden flex-row">
                                    <View
                                        className="h-full bg-green-500"
                                        style={{ width: `${stats.totalTasks > 0 ? (stats.achievedTasks / stats.totalTasks) * 100 : 0}%` }}
                                    />
                                    <View
                                        className="h-full bg-red-500"
                                        style={{ width: `${stats.totalTasks > 0 ? (stats.failedTasks / stats.totalTasks) * 100 : 0}%` }}
                                    />
                                </View>
                            </View>

                            <View className="flex-row justify-between items-center py-2 border-t border-white/5">
                                <View className="flex-row items-center">
                                    <View className="w-3 h-3 rounded-full bg-green-500 mr-2" />
                                    <Text className="text-white/60 text-sm">Reported Plans</Text>
                                </View>
                                <Text className="text-white font-bold">{stats.reportedCount}</Text>
                            </View>

                            <View className="flex-row justify-between items-center py-2 border-t border-white/5">
                                <View className="flex-row items-center">
                                    <View className="w-3 h-3 rounded-full bg-yellow-500 mr-2" />
                                    <Text className="text-white/60 text-sm">Unreported</Text>
                                </View>
                                <Text className="text-white font-bold">{stats.totalPlans - stats.reportedCount}</Text>
                            </View>
                        </View>
                    </View>

                </ScrollView>
            </ImageBackground>
        </View>
    );
}

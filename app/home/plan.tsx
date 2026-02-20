import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { ImageBackground, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import EditPlanModal from '../../components/EditPlanModal';
import PlanModal from '../../components/PlanModal';
import ReportModal from '../../components/ReportModal';
import StatusChangeModal from '../../components/StatusChangeModal';

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

export default function Plan() {
    const { top } = useSafeAreaInsets();
    const [plans, setPlans] = useState<Plan[]>([]);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedTask, setSelectedTask] = useState<{ planIndex: number; taskIndex: number } | null>(null);
    const [modalPosition, setModalPosition] = useState({ x: 0, y: 0 });
    const [editPlanModalVisible, setEditPlanModalVisible] = useState(false);
    const [selectedPlanIndex, setSelectedPlanIndex] = useState<number | null>(null);
    const [expandedTasks, setExpandedTasks] = useState<Set<string>>(new Set());
    const [reportModalVisible, setReportModalVisible] = useState(false);
    const [reporPlanVisible, setPlanModalVisible] = useState(false);
    const [reportPlanIndex, setReportPlanIndex] = useState<number | null>(null);

    useEffect(() => {
        loadPlans();
    }, []);

    const loadPlans = async () => {
        try {
            const storedPlans = await AsyncStorage.getItem('plans');
            if (storedPlans) {
                try {
                    setPlans(JSON.parse(storedPlans));
                } catch (e) {
                    console.error("Error parsing stored plans:", e);
                    // Invalid JSON format in storage
                }
            }
        } catch (error) {
            console.error('Failed to load plans:', error);
        }
    };



    const updateTaskStatus = async (planIndex: number, taskIndex: number, newStatus: string) => {
        const updatedPlans = [...plans];
        updatedPlans[planIndex].tasks[taskIndex].status = newStatus;

        // Update state
        setPlans(updatedPlans);

        // Update AsyncStorage
        try {
            await AsyncStorage.setItem('plans', JSON.stringify(updatedPlans));
        } catch (error) {
            console.error('Failed to update plans:', error);
        }

        // Close modal
        setModalVisible(false);
        setSelectedTask(null);
    };

    const openStatusModal = (planIndex: number, taskIndex: number, event: any) => {
        event.target.measure((x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
            setModalPosition({ x: pageX, y: pageY + height });
            setSelectedTask({ planIndex, taskIndex });
            setModalVisible(true);
        });
    };

    const openEditPlanModal = (planIndex: number) => {
        setSelectedPlanIndex(planIndex);
        setEditPlanModalVisible(true);
    };

    const handleSavePlan = async (updatedTasks: Task[]) => {
        if (selectedPlanIndex === null) return;

        const updatedPlans = [...plans];
        updatedPlans[selectedPlanIndex].tasks = updatedTasks;

        // Update state
        setPlans(updatedPlans);

        // Update AsyncStorage
        try {
            await AsyncStorage.setItem('plans', JSON.stringify(updatedPlans));
        } catch (error) {
            console.error('Failed to update plans:', error);
        }

        setEditPlanModalVisible(false);
        setSelectedPlanIndex(null);
    };

    const toggleTaskExpansion = (planIndex: number, taskId: number) => {
        const key = `${planIndex}-${taskId}`;
        setExpandedTasks(prev => {
            const newSet = new Set(prev);
            if (newSet.has(key)) {
                newSet.delete(key);
            } else {
                newSet.add(key);
            }
            return newSet;
        });
    };

    const openReportModal = (planIndex: number) => {
        setReportPlanIndex(planIndex);
        setReportModalVisible(true);
    };
    const openPlanModal = () => {
        setPlanModalVisible(true);
    };

    const handleReport = async (updatedTasks: Task[]) => {
        if (reportPlanIndex === null) return;

        const updatedPlans = [...plans];
        updatedPlans[reportPlanIndex].tasks = updatedTasks;
        updatedPlans[reportPlanIndex].status = 'Reported';

        // Calculate rate: (achieved tasks / total tasks) * 100
        const achievedCount = updatedTasks.filter(task => task.status === 'Achieved').length;
        const totalCount = updatedTasks.length;
        const rate = totalCount > 0 ? Math.round((achievedCount / totalCount) * 100) : 0;
        updatedPlans[reportPlanIndex].rate = rate;

        // Update state
        setPlans(updatedPlans);

        // Update AsyncStorage
        try {
            await AsyncStorage.setItem('plans', JSON.stringify(updatedPlans));
        } catch (error) {
            console.error('Failed to update plans:', error);
        }

        setReportModalVisible(false);
        setReportPlanIndex(null);
    };

    const handlePlan = async (newTasks: Task[]) => {
        // Create new plan with current date
        const now = new Date();
        const formattedDate = now.toLocaleString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit',
            hour12: true
        });

        const newPlan: Plan = {
            tasks: newTasks,
            date: formattedDate,
            status: 'Unreported',
            rate: 0
        };

        const updatedPlans = [newPlan, ...plans];
        setPlans(updatedPlans);

        // Save to AsyncStorage
        try {
            await AsyncStorage.setItem('plans', JSON.stringify(updatedPlans));
        } catch (error) {
            console.error('Failed to save new plan:', error);
        }

        setPlanModalVisible(false);
    };

    const hasUnreported: boolean = plans.some(
        (item: any) => item.status === "Unreported"
    );
    const icon = (ststus: string) => {
        if (ststus === 'Pending')
            return <Ionicons name="time-outline" size={24} color="#eab308" style={{ marginTop: 2 }} />
        if (ststus === 'Achieved')
            return <Ionicons name="checkmark-circle-outline" size={24} color="#22c55e" style={{ marginTop: 2 }} />
        if (ststus === 'Failed')
            return <Ionicons name="close-circle-outline" size={24} color="#ef4444" style={{ marginTop: 2 }} />
    }
    const Rate = (rate: number) => {
        if (rate >= 80) {
            return <Text className="text-green-500 text-xs font-medium ml-2">{rate} %</Text>;
        }
        else if (rate >= 50 && rate < 80) {
            return <Text className="text-yellow-500 text-xs font-medium ml-2">{rate} %</Text>;
        }
        else if (rate >= 0 && rate < 50) {
            return <Text className="text-red-500 text-xs font-medium ml-2">{rate} %</Text>;
        }
        else { return }
    }

    const currentTaskStatus = selectedTask ? plans[selectedTask.planIndex]?.tasks[selectedTask.taskIndex]?.status : null;

    return (
        <View className="flex-1">
            <StatusBar style="light" />

            <ReportModal
                visible={reportModalVisible}
                onClose={() => setReportModalVisible(false)}
                tasks={reportPlanIndex !== null ? plans[reportPlanIndex]?.tasks || [] : []}
                onReport={handleReport}
            />
            <PlanModal
                visible={reporPlanVisible}
                onClose={() => setPlanModalVisible(false)}
                onSave={handlePlan}
            />

            <EditPlanModal
                visible={editPlanModalVisible}
                onClose={() => setEditPlanModalVisible(false)}
                tasks={selectedPlanIndex !== null ? plans[selectedPlanIndex]?.tasks || [] : []}
                onSave={handleSavePlan}
            />

            <StatusChangeModal
                visible={modalVisible}
                onClose={() => setModalVisible(false)}
                currentStatus={currentTaskStatus}
                onStatusChange={(status) => selectedTask && updateTaskStatus(selectedTask.planIndex, selectedTask.taskIndex, status)}
                position={modalPosition}
            />
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
                        <Text className="text-white text-3xl font-bold">Plans</Text>


                    </View>

                    <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
                        {/* Plan Card */}
                        <View className="rounded-3xl p-5 mb-6 shadow-sm">
                            {/* Plan Header */}
                            <View className="flex-row justify-between items-center mb-1">
                                <Text className="text-white text-lg font-bold"></Text>

                                {plans.some(p => p.status === "Unreported") ? (
                                    <TouchableOpacity
                                        onPress={() => {
                                            const unreportedIndex = plans.findIndex(p => p.status === "Unreported");
                                            if (unreportedIndex !== -1) openReportModal(unreportedIndex);
                                        }}
                                        className="bg-white/10 px-4 py-2 rounded-lg"
                                    >
                                        <Text className="text-white font-medium">Report</Text>
                                    </TouchableOpacity>
                                ) : (<TouchableOpacity
                                    onPress={() => {

                                        openPlanModal();
                                    }}
                                    className="bg-white/10 px-4 py-2 rounded-lg"
                                >
                                    <Text className="text-white font-medium">Plan</Text>
                                </TouchableOpacity>)

                                }
                            </View>
                            <View className="space-y-4">

                                {plans.length === 0 ? (
                                    <View className="py-8 items-center">
                                        <Text className="text-gray-400 text-center mb-4">No plans found. Go to Settings to load default plans.</Text>
                                    </View>
                                ) : (
                                    plans.map((plan, index) => (
                                        <View key={index} className='border border-gray-100 rounded-2xl p-4'>
                                            <View className="flex-row justify-between items-center mb-4">
                                                <Text className="text-gray-400 text-xs font-medium ml-2">{plan.date}</Text>
                                                {plan.status == "Unreported"
                                                    ?
                                                    <TouchableOpacity onPress={() => openEditPlanModal(index)}>
                                                        <Ionicons name="create-outline" size={20} color="#9ca3af" />
                                                    </TouchableOpacity>
                                                    :
                                                    Rate(plan?.rate)}
                                            </View>



                                            {/* Tasks List */}
                                            <View className="space-y-2">
                                                {plan.tasks.map((task) => (
                                                    <View key={task.id} className="border border-gray-100 rounded-2xl p-4">
                                                        <View className="flex-row justify-between items-start mb-2">
                                                            <TouchableOpacity
                                                                className="flex-row items-start flex-1 mr-2"
                                                                onPress={() => toggleTaskExpansion(index, task.id)}
                                                                activeOpacity={0.7}
                                                            >
                                                                {icon(task?.status)}
                                                                <View className="ml-3 flex-1">
                                                                    <Text
                                                                        className="text-gray-300 text-base mb-1"
                                                                        numberOfLines={expandedTasks.has(`${index}-${task.id}`) ? undefined : 2}
                                                                    >
                                                                        {task.title}
                                                                    </Text>
                                                                </View>
                                                            </TouchableOpacity>
                                                            <TouchableOpacity onPress={(e) => plan.status === "Unreported" && openStatusModal(index, task.id - 1, e)}>
                                                                {plan.status === "Unreported" ? (
                                                                    <Ionicons name="options-outline" size={20} color="#9ca3af" />
                                                                ) : ""}
                                                            </TouchableOpacity>
                                                        </View>
                                                    </View>
                                                ))
                                                }
                                            </View>
                                        </View>
                                    ))
                                )}
                            </View>

                        </View>


                    </ScrollView>
                </View>
            </ImageBackground>
        </View>
    );
}

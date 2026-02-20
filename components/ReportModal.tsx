import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Modal, ScrollView, Text, TouchableOpacity, View } from 'react-native';

interface Task {
    id: number;
    title: string;
    status: string;
}

interface ReportModalProps {
    visible: boolean;
    onClose: () => void;
    tasks: Task[];
    onReport: (updatedTasks: Task[]) => void;
}

export default function ReportModal({
    visible,
    onClose,
    tasks,
    onReport
}: ReportModalProps) {
    const [reportTasks, setReportTasks] = useState<Task[]>(tasks);

    // Update local state when tasks prop changes
    React.useEffect(() => {
        setReportTasks(tasks);
    }, [tasks]);

    const toggleTaskStatus = (index: number, newStatus: 'Achieved' | 'Failed') => {
        const updated = [...reportTasks];
        updated[index].status = newStatus;
        setReportTasks(updated);
    };

    const canReport = () => {
        // All tasks must be either Achieved or Failed (not Pending)
        return reportTasks.every(task => task.status === 'Achieved' || task.status === 'Failed');
    };

    const handleReport = () => {
        if (!canReport()) return;
        onReport(reportTasks);
        onClose();
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View className="flex-1 bg-black/50 justify-center items-center p-4">
                <View className="bg-gray-800 rounded-2xl p-6 border border-gray-700 w-full max-w-md">
                    <Text className="text-white font-bold text-xl mb-4">Report Plan</Text>

                    <ScrollView className="max-h-96 mb-4">
                        {reportTasks.map((task, index) => (
                            <View key={task.id} className="mb-4">
                                <Text className="text-gray-300 font-semibold text-base mb-3">Task: {task.title}</Text>
                                <View className="flex-row items-center gap-6">
                                    <TouchableOpacity
                                        onPress={() => toggleTaskStatus(index, 'Achieved')}
                                        className="flex-row items-center"
                                    >
                                        <View className={`w-6 h-6 rounded-md border-2 items-center justify-center mr-2 ${task.status === 'Achieved'
                                            ? 'bg-green-500 border-green-500'
                                            : 'bg-white border-gray-300'
                                            }`}>
                                            {task.status === 'Achieved' && (
                                                <Ionicons name="checkmark" size={16} color="white" />
                                            )}
                                        </View>
                                        <Text className="text-gray-400">Achieve</Text>
                                    </TouchableOpacity>

                                    <TouchableOpacity
                                        onPress={() => toggleTaskStatus(index, 'Failed')}
                                        className="flex-row items-center"
                                    >
                                        <View className={`w-6 h-6 rounded-md border-2 items-center justify-center mr-2 ${task.status === 'Failed'
                                            ? 'bg-red-500 border-red-500'
                                            : 'bg-white border-gray-300'
                                            }`}>
                                            {task.status === 'Failed' && (
                                                <Ionicons name="close" size={16} color="white" />
                                            )}
                                        </View>
                                        <Text className="text-gray-400">Fail</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        ))}
                    </ScrollView>

                    <View className="flex-row gap-3">
                        <TouchableOpacity
                            onPress={onClose}
                            className="flex-1 bg-white border border-gray-300 p-3 rounded-xl"
                        >
                            <Text className="text-gray-700 text-center font-medium">Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleReport}
                            disabled={!canReport()}
                            className={`flex-1 p-3 rounded-xl ${canReport() ? 'bg-blue-600' : 'bg-gray-300'
                                }`}
                        >
                            <Text className={`text-center font-bold ${canReport() ? 'text-white' : 'text-gray-500'
                                }`}>
                                Report
                            </Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

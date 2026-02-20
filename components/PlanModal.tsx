import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import { Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Task {
    id: number;
    title: string;
    status: string;
}

interface PlanModalProps {
    visible: boolean;
    onClose: () => void;
    onSave: (tasks: Task[]) => void;
}

export default function PlanModal({
    visible,
    onClose,
    onSave
}: PlanModalProps) {
    const [tasks, setTasks] = useState<Task[]>([{ id: 1, title: '', status: 'Pending' }]);
    const scrollViewRef = useRef<ScrollView>(null);

    // Reset tasks when modal opens
    React.useEffect(() => {
        if (visible) {
            setTasks([{ id: 1, title: '', status: 'Pending' }]);
        }
    }, [visible]);

    const updateTaskTitle = (index: number, newTitle: string) => {
        const updated = [...tasks];
        updated[index].title = newTitle;
        setTasks(updated);
    };

    const addNewTask = () => {
        const maxId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) : 0;
        const newTask: Task = {
            id: maxId + 1,
            title: '',
            status: 'Pending'
        };
        setTasks([...tasks, newTask]);

        // Scroll to bottom after adding new task
        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    const deleteTask = (index: number) => {
        // Don't allow deleting if only one task remains
        if (tasks.length === 1) return;
        const updated = tasks.filter((_, i) => i !== index);
        setTasks(updated);
    };

    const handleSave = () => {
        // Filter out empty tasks
        const validTasks = tasks.filter(task => task.title.trim() !== '');
        if (validTasks.length === 0) return;

        onSave(validTasks);
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
                    <View className="flex-row justify-between items-center mb-4">
                        <Text className="text-white font-bold text-xl">Create Plan</Text>
                        <TouchableOpacity
                            onPress={addNewTask}
                            className="bg-teal-600 p-2 rounded-lg"
                        >
                            <Ionicons name="add" size={24} color="white" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView ref={scrollViewRef} className="max-h-96 mb-4">
                        {tasks.map((task, index) => (
                            <View key={task.id} className="mb-4">

                                <View className="flex-row justify-between items-center mb-2">
                                    <TextInput
                                        value={task.title}
                                        onChangeText={(text) => updateTaskTitle(index, text)}
                                        className="bg-gray-700 text-white p-3 rounded-xl border border-gray-600 w-[90%]"
                                        placeholder="Enter task title..."
                                        placeholderTextColor="#9ca3af"
                                        multiline
                                    />
                                    {tasks.length > 1 && (
                                        <TouchableOpacity
                                            onPress={() => deleteTask(index)}
                                            className="bg-red-600 p-1 rounded"
                                        >
                                            <Ionicons name="close" size={16} color="white" />
                                        </TouchableOpacity>
                                    )}
                                </View>
                            </View>
                        ))}
                    </ScrollView>

                    <View className="flex-row gap-3">
                        <TouchableOpacity
                            onPress={onClose}
                            className="flex-1 bg-gray-700 p-3 rounded-xl"
                        >
                            <Text className="text-white text-center font-medium">Cancel</Text>
                        </TouchableOpacity>
                        <TouchableOpacity
                            onPress={handleSave}
                            className="flex-1 bg-teal-600 p-3 rounded-xl"
                        >
                            <Text className="text-white text-center font-bold">Save</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

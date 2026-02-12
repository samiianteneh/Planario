import { Ionicons } from '@expo/vector-icons';
import React, { useRef, useState } from 'react';
import { Modal, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';

interface Task {
    id: number;
    title: string;
    status: string;
}

interface EditPlanModalProps {
    visible: boolean;
    onClose: () => void;
    tasks: Task[];
    onSave: (updatedTasks: Task[]) => void;
}

export default function EditPlanModal({
    visible,
    onClose,
    tasks,
    onSave
}: EditPlanModalProps) {
    const [editedTasks, setEditedTasks] = useState<Task[]>(tasks);
    const scrollViewRef = useRef<ScrollView>(null);

    // Update local state when tasks prop changes
    React.useEffect(() => {
        setEditedTasks(tasks);
    }, [tasks]);

    const updateTaskTitle = (index: number, newTitle: string) => {
        const updated = [...editedTasks];
        updated[index].title = newTitle;
        setEditedTasks(updated);
    };

    const addNewTask = () => {
        const maxId = editedTasks.length > 0 ? Math.max(...editedTasks.map(t => t.id)) : 0;
        const newTask: Task = {
            id: maxId + 1,
            title: '',
            status: 'Pending'
        };
        setEditedTasks([...editedTasks, newTask]);

        // Scroll to bottom after adding new task
        setTimeout(() => {
            scrollViewRef.current?.scrollToEnd({ animated: true });
        }, 100);
    };

    const deleteTask = (index: number) => {
        const updated = editedTasks.filter((_, i) => i !== index);
        setEditedTasks(updated);
    };

    const handleSave = () => {
        onSave(editedTasks);
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
                        <Text className="text-white font-bold text-xl">Edit Plan</Text>
                        <TouchableOpacity
                            onPress={addNewTask}
                            className="bg-teal-600 p-2 rounded-lg"
                        >
                            <Ionicons name="add" size={24} color="white" />
                        </TouchableOpacity>
                    </View>

                    <ScrollView ref={scrollViewRef} className="max-h-96 mb-4">
                        {editedTasks.map((task, index) => (
                            <View key={task.id} className="mb-4">

                                <View className="flex-row justify-between items-center mb-2">
                                    <TextInput
                                        value={task.title}
                                        onChangeText={(text) => updateTaskTitle(index, text)}
                                        className="bg-gray-700 text-white p-3 rounded-xl border border-gray-600 w-[90%]"
                                        placeholder="Enter task title..."
                                        placeholderTextColor="#9ca3af"
                                        multiline
                                    />                                    <TouchableOpacity
                                        onPress={() => deleteTask(index)}
                                        className="bg-red-600 p-1 rounded"
                                    >
                                        <Ionicons name="close" size={16} color="white" />
                                    </TouchableOpacity>
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

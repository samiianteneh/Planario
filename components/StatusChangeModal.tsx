import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';

interface StatusChangeModalProps {
    visible: boolean;
    onClose: () => void;
    currentStatus: string | null;
    onStatusChange: (status: string) => void;
    position?: { x: number; y: number };
}

export default function StatusChangeModal({
    visible,
    onClose,
    currentStatus,
    onStatusChange,
    position = { x: 0, y: 0 }
}: StatusChangeModalProps) {
    const statuses = ['Achieved', 'Pending', 'Failed'];

    const getStatusColor = (status: string) => {
        if (status === 'Achieved') return 'bg-green-600';
        if (status === 'Pending') return 'bg-yellow-600';
        if (status === 'Failed') return 'bg-red-600';
        return 'bg-gray-700';
    };

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <TouchableOpacity
                className="flex-1"
                activeOpacity={1}
                onPress={onClose}
            >
                <View className="flex-1 bg-black/50">
                    <TouchableOpacity
                        activeOpacity={1}
                        onPress={(e) => e.stopPropagation()}
                        style={{
                            position: 'absolute',
                            top: position.y,
                            right: 80,
                        }}
                    >
                        <View className="bg-gray-800 rounded-2xl p-4 border border-gray-700 min-w-[180px] shadow-lg">
                            <Text className="text-white font-bold text-base mb-3">Change Status</Text>

                            {statuses.map((status) => (
                                <TouchableOpacity
                                    key={status}
                                    onPress={() => onStatusChange(status)}
                                    className={`p-3 rounded-xl mb-2 ${currentStatus === status
                                        ? getStatusColor(status)
                                        : 'bg-gray-700 active:bg-gray-600'
                                        }`}
                                >
                                    <View className="flex-row items-center justify-between">
                                        <Text
                                            className={`font-medium ${currentStatus === status
                                                ? 'text-white'
                                                : 'text-gray-300'
                                                }`}
                                        >
                                            {status}
                                        </Text>
                                        {currentStatus === status && (
                                            <Ionicons name="checkmark" size={18} color="white" />
                                        )}
                                    </View>
                                </TouchableOpacity>
                            ))}
                        </View>
                    </TouchableOpacity>
                </View>
            </TouchableOpacity>
        </Modal>
    );
}

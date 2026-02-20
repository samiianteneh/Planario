import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, Text, TouchableOpacity, View } from 'react-native';

interface ConfirmationModalProps {
    visible: boolean;
    title: string;
    description: string;
    confirmText?: string;
    cancelText?: string;
    onConfirm: () => void;
    onCancel: () => void;
    confirmColor?: string;
    icon?: keyof typeof Ionicons.glyphMap;
}

export default function ConfirmationModal({
    visible,
    title,
    description,
    confirmText = 'Confirm',
    cancelText = 'Cancel',
    onConfirm,
    onCancel,
    confirmColor = 'bg-teal-600',
    icon = 'help-circle-outline'
}: ConfirmationModalProps) {
    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onCancel}
        >
            <View className="flex-1 bg-black/60 justify-center items-center p-6">
                <View className="bg-gray-900/95 rounded-[32px] p-8 border border-white/10 w-full max-w-sm shadow-2xl">
                    <View className={`self-center mb-6 p-4 rounded-full bg-white/5`}>
                        <Ionicons name={icon} size={40} color="white" opacity={0.8} />
                    </View>

                    <Text className="text-white font-bold text-2xl text-center mb-2 tracking-tight">
                        {title}
                    </Text>

                    <Text className="text-white/60 text-center mb-8 leading-relaxed">
                        {description}
                    </Text>

                    <View className="flex-row gap-3">
                        <TouchableOpacity
                            onPress={onCancel}
                            className="flex-1 bg-white/5 p-4 rounded-2xl active:bg-white/10"
                        >
                            <Text className="text-white/60 text-center font-bold text-lg">{cancelText}</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            onPress={onConfirm}
                            className={`flex-1 ${confirmColor} p-4 rounded-2xl shadow-lg active:opacity-90`}
                        >
                            <Text className="text-white text-center font-bold text-lg">{confirmText}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
}

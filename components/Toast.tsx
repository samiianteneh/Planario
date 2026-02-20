import { Ionicons } from '@expo/vector-icons';
import React, { useEffect } from 'react';
import { Platform, Text, View } from 'react-native';
import Animated, {
    FadeInUp,
    FadeOutUp
} from 'react-native-reanimated';

interface ToastProps {
    visible: boolean;
    message: string;
    type?: 'success' | 'error' | 'info';
    onDismiss: () => void;
    duration?: number;
}

export default function Toast({
    visible,
    message,
    type = 'success',
    onDismiss,
    duration = 3000
}: ToastProps) {
    useEffect(() => {
        if (visible) {
            const timer = setTimeout(() => {
                onDismiss();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [visible, duration, onDismiss]);

    if (!visible) return null;

    const getColors = () => {
        switch (type) {
            case 'success': return { bg: 'bg-teal-600', icon: 'checkmark-circle' as const, border: 'border-teal-500/50' };
            case 'error': return { bg: 'bg-red-600', icon: 'alert-circle' as const, border: 'border-red-500/50' };
            default: return { bg: 'bg-blue-600', icon: 'information-circle' as const, border: 'border-blue-500/50' };
        }
    };

    const colors = getColors();

    if (Platform.OS === 'web') {
        // Simpler version for web to avoid potential reanimated web issues if not perfectly configured
        return (
            <View
                style={{
                    position: 'absolute',
                    top: 40,
                    left: 0,
                    right: 0,
                    alignItems: 'center',
                    zIndex: 9999
                }}
            >
                <View className={`${colors.bg} flex-row items-center px-6 py-4 rounded-2xl shadow-2xl border ${colors.border}`}>
                    <Ionicons name={colors.icon} size={24} color="white" />
                    <Text className="text-white font-bold ml-3 text-[16px]">{message}</Text>
                </View>
            </View>
        );
    }

    return (
        <Animated.View
            entering={FadeInUp.springify()}
            exiting={FadeOutUp}
            style={{
                position: 'absolute',
                top: 60,
                left: 20,
                right: 20,
                zIndex: 9999,
                alignItems: 'center'
            }}
        >
            <View className={`${colors.bg} flex-row items-center px-6 py-4 rounded-[20px] shadow-2xl border ${colors.border} w-full max-w-sm`}>
                <Ionicons name={colors.icon} size={24} color="white" />
                <Text className="text-white font-bold ml-3 text-[16px] flex-1">{message}</Text>
            </View>
        </Animated.View>
    );
}

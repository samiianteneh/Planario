import { Ionicons } from '@expo/vector-icons';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAuth } from '../context/auth';

export default function CustomDrawerContent(props: any) {
    const { signOut, user } = useAuth();
    const { top, bottom } = useSafeAreaInsets();

    return (
        <View style={{ flex: 1 }}>
            <DrawerContentScrollView
                {...props}
                contentContainerStyle={{ paddingTop: top }}
            >
                {/* Profile Section */}
                <View className="mb-6 px-4 pt-4 pb-6 border-b border-gray-200/10">
                    <View className="flex-row items-center space-x-3">
                        <View className="h-12 w-12 rounded-full bg-teal-600 items-center justify-center overflow-hidden">
                            {/* Placeholder image or initial if no image provided. 
                                 Prompt says "Profile section (image + name)". 
                                 I'll use a placeholder image or just a colored circle with initial if I don't have an asset. 
                                 Or I can use the user's name first letter. 
                                 Let's try to use a generic avatar from vector icons or just a view.
                             */}
                            <Ionicons name="person" size={24} color="white" />
                        </View>
                        <View>
                            <Text className="text-white text-lg font-bold">{user?.name}</Text>
                        </View>
                    </View>
                </View>

                {/* Drawer Items (Dashboard, Plan, Setting) */}
                <View className="px-2">
                    <DrawerItemList {...props} />
                </View>

            </DrawerContentScrollView>

            {/* Logout Section */}
            <View
                className="p-4 border-t border-gray-200/10"
                style={{ paddingBottom: bottom + 20 }}
            >
                <TouchableOpacity
                    onPress={() => signOut()}
                    className="flex-row items-center space-x-3 px-4 py-3 rounded-xl active:bg-red-500/10"
                >
                    <Ionicons name="log-out-outline" size={24} color="#ef4444" />
                    <Text className="text-red-500 font-medium ml-3">Logout</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

import { StatusBar } from 'expo-status-bar';
import { Text, TouchableOpacity, View } from 'react-native';
import { useAuth } from '../context/auth';

export default function Home() {
    const { user, signOut } = useAuth();

    return (
        <View className="flex-1 bg-gray-50 items-center justify-center p-6">
            <StatusBar style="dark" />
            <View className="w-full max-w-sm bg-white p-8 rounded-3xl shadow-xl items-center">
                <View className="w-20 h-20 bg-teal-100 rounded-full items-center justify-center mb-6">
                    <Text className="text-3xl">👋</Text>
                </View>

                <Text className="text-3xl font-bold text-gray-900 mb-2">
                    Welcome Home
                </Text>

                <Text className="text-gray-500 text-lg mb-8 text-center">
                    Hello, <Text className="font-semibold text-teal-600">{user?.name || 'User'}</Text>!
                    {"\n"}You are successfully logged in.
                </Text>

                <TouchableOpacity
                    onPress={signOut}
                    className="w-full bg-red-50 py-4 rounded-xl border border-red-100 active:bg-red-100"
                >
                    <Text className="text-red-500 text-center font-semibold text-lg">
                        Sign Out
                    </Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

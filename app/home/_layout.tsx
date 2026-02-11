import { Ionicons } from '@expo/vector-icons';
import { Drawer } from 'expo-router/drawer';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import CustomDrawerContent from '../../components/CustomDrawerContent';

export default function HomeLayout() {
    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <Drawer
                drawerContent={(props) => <CustomDrawerContent {...props} />}
                screenOptions={{
                    headerShown: true, // Show header globally
                    headerTitle: '', // Hide default title
                    headerTransparent: true, // Make header transparent to float over the background
                    headerTintColor: '#fff', // White menu icon
                    headerStyle: {
                        backgroundColor: 'transparent',
                    },
                    drawerStyle: {
                        backgroundColor: '#111827', // dark bg for drawer
                        width: 280,
                    },
                    drawerActiveTintColor: '#2dd4bf', // teal-400
                    drawerActiveBackgroundColor: 'rgba(45, 212, 191, 0.1)',
                    drawerInactiveTintColor: '#9ca3af', // gray-400
                    drawerLabelStyle: {
                        marginLeft: 0,
                        fontSize: 15,
                    },
                    drawerItemStyle: {
                        borderRadius: 12,
                        marginVertical: 4,
                    },
                }}
            >
                <Drawer.Screen
                    name="index"
                    options={{
                        drawerLabel: 'Dashboard',
                        title: 'Dashboard',
                        drawerIcon: ({ color, size }) => (
                            <Ionicons name="grid-outline" size={size} color={color} />
                        ),
                    }}
                />
                <Drawer.Screen
                    name="plan"
                    options={{
                        drawerLabel: 'Plan',
                        title: 'Plan',
                        drawerIcon: ({ color, size }) => (
                            <Ionicons name="calendar-outline" size={size} color={color} />
                        ),
                    }}
                />
                <Drawer.Screen
                    name="setting"
                    options={{
                        drawerLabel: 'Setting',
                        title: 'Setting',
                        drawerIcon: ({ color, size }) => (
                            <Ionicons name="settings-outline" size={size} color={color} />
                        ),
                    }}
                />
            </Drawer>
        </GestureHandlerRootView>
    );
}

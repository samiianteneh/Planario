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
                    headerShown: false, // We will handle headers in screens or hide them as per design "dashboard content itself should be empty (placeholder only)"
                    // But usually we need a button to open drawer. 
                    // If headers are hidden, how does user open drawer? 
                    // "Dashboard content itself should be empty (placeholder only). Layout must include a sidebar (drawer navigation)."
                    // Usually a hamburger menu is strictly required. 
                    // I will enable header but make it transparent or styled to match the background?
                    // Or I check if I should add a custom header. 
                    // "Background styling... Landing page image as background for... all pages after login."
                    // So the header might clash.
                    // I'll keep header SHOWN but transparent/styled so users can open the drawer. 
                    // OR I rely on swipe. But a button is better.
                    headerStyle: {
                        backgroundColor: 'transparent',
                    },
                    headerTintColor: '#fff',
                    headerTitleStyle: {
                        fontWeight: 'bold',
                    },
                    headerTransparent: true, // Make header transparent to float over the background
                    drawerStyle: {
                        backgroundColor: '#111827', // dark bg for drawer
                        width: 280,
                    },
                    drawerActiveTintColor: '#2dd4bf', // teal-400
                    drawerInactiveTintColor: '#9ca3af', // gray-400
                    drawerLabelStyle: {
                        marginLeft: -20, // Adjust label position if icon is used
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

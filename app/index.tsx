import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ImageBackground, Text, TouchableOpacity, View } from 'react-native';

export default function Landing() {
  const router = useRouter();

  const handleTap = async () => {
    try {
      const storedUser = await AsyncStorage.getItem('user');
      if (storedUser) {
        // User is logged in, go to home
        router.push('/home');
      } else {
        // No user, go to login
        router.push('/login');
      }
    } catch (error) {
      console.error('Failed to check user:', error);
      // On error, default to login
      router.push('/login');
    }
  };

  return (
    <View className="flex-1">
      <StatusBar style="light" />
      <TouchableOpacity
        activeOpacity={1}
        onPress={handleTap}
        className="flex-1"
      >
        <ImageBackground
          source={require('../assets/images/landing-bg.png')}
          className="flex-1 justify-end pb-20 items-center"
          resizeMode="cover"
        >
          <View className="items-center px-4">
            <Text className="text-white text-5xl font-bold tracking-widest text-center mb-2">
              PLANARIO
            </Text>
            <Text className="text-gray-300 text-lg text-center font-light tracking-wide mb-8">
              Your planning companion
            </Text>

            <View className="animate-bounce mt-4">
              <Text className="text-white/70 text-sm tracking-[4px] uppercase">
                Tap anywhere to begin
              </Text>
            </View>
          </View>
        </ImageBackground>
      </TouchableOpacity>
    </View>
  );
}

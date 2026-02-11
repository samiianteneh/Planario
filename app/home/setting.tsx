import React from 'react';
import { ImageBackground, Text, View } from 'react-native';

export default function Setting() {
    return (
        <View className="flex-1">
            <ImageBackground
                source={require('../../assets/images/landing-bg.png')}
                className="flex-1"
                resizeMode="cover"
                blurRadius={5}
            >
                <View className="flex-1 justify-center items-center">
                    <Text className="text-white/50 text-xl font-light">Setting Placeholder</Text>
                </View>
            </ImageBackground>
        </View>
    );
}

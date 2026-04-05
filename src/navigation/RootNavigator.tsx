import React, { useState, useEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import SplashScreen from '../components/SplashScreen';
import { useAuthStore } from '../stores/authStore';
import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import { Loading } from '../components/common/Loading';

const Stack = createNativeStackNavigator();

export default function RootNavigator() {
  const [showSplash, setShowSplash] = useState(true);
  const { isAuthenticated, isInitialized } = useAuthStore();

  const handleSplashFinish = () => {
    setShowSplash(false);
  };

  if (showSplash) {
    return (
      <View style={styles.container}>
        <SplashScreen onFinish={handleSplashFinish} />
      </View>
    );
  }

  if (!isInitialized) {
    return (
      <View style={styles.container}>
        <Loading size="large" color="#002c28" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {isAuthenticated ? (
          <Stack.Screen name="Main" component={MainNavigator} />
        ) : (
          <Stack.Screen name="Auth" component={AuthNavigator} />
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
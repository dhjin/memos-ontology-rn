import React, { useEffect, useState } from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import { LoginScreen } from '../screens/LoginScreen';
import { MainTabs } from './MainTabs';
import { MemoDetailScreen } from '../screens/MemoDetailScreen';
import { MemoEditScreen } from '../screens/MemoEditScreen';
import { RootStackParamList } from '../types';
import { settingsStore } from '../store/settingsStore';

const Stack = createStackNavigator<RootStackParamList>();

export const AppNavigator = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    checkLogin();
  }, []);

  const checkLogin = async () => {
    const loggedIn = await settingsStore.isLoggedIn();
    setIsLoggedIn(loggedIn);
    setIsLoading(false);
  };

  if (isLoading) return null;

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {!isLoggedIn ? (
        <Stack.Screen name="Login" component={LoginScreen} />
      ) : (
        <>
          <Stack.Screen name="Main" component={MainTabs} />
          <Stack.Screen name="MemoDetail" component={MemoDetailScreen} options={{ headerShown: true, title: 'Memo Detail' }} />
          <Stack.Screen name="MemoEdit" component={MemoEditScreen} options={{ headerShown: true, title: 'Edit Memo' }} />
        </>
      )}
    </Stack.Navigator>
  );
};

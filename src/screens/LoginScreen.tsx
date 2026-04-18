import React, { useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Title } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { settingsStore } from '../store/settingsStore';
import { memosApi } from '../api/memosApi';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export const LoginScreen = ({ navigation }: Props) => {
  const [serverUrl, setServerUrl] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!serverUrl || !username || !password) {
      Alert.alert('Missing Fields', 'Please fill in all fields');
      return;
    }
    if (!/^https?:\/\/.+/.test(serverUrl)) {
      Alert.alert('Invalid URL', 'Server URL must start with http:// or https://');
      return;
    }
    setLoading(true);
    try {
      await settingsStore.setServerUrl(serverUrl);
      await memosApi.login(username, password);
      await settingsStore.setLoggedIn(true);
      navigation.replace('Main');
    } catch (e) {
      Alert.alert('Login Failed', memosApi.userFriendlyError(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Title style={styles.title}>Memos Ontology</Title>
      <TextInput
        label="Server URL"
        value={serverUrl}
        onChangeText={setServerUrl}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="url"
        placeholder="http://192.168.1.100:8080"
      />
      <TextInput
        label="Username"
        value={username}
        onChangeText={setUsername}
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        label="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
      />
      <Button mode="contained" onPress={handleLogin} loading={loading} disabled={loading} style={styles.button}>
        Login
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, justifyContent: 'center' },
  title: { textAlign: 'center', marginBottom: 30 },
  input: { marginBottom: 15 },
  button: { marginTop: 10 },
});

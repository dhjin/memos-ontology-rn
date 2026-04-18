import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert, ScrollView } from 'react-native';
import { TextInput, Button, Title, Divider } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { settingsStore } from '../store/settingsStore';
import { memosApi } from '../api/memosApi';
import { RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Main'>;

export const SettingsScreen = ({ navigation }: Props) => {
  const [serverUrl, setServerUrl] = useState('');
  const [fusekiUrl, setFusekiUrl] = useState('');
  const [fusekiUser, setFusekiUser] = useState('');
  const [fusekiPass, setFusekiPass] = useState('');

  useEffect(() => {
    const load = async () => {
      setServerUrl(await settingsStore.getServerUrl());
      setFusekiUrl(await settingsStore.getFusekiUrl());
      setFusekiUser(await settingsStore.getFusekiUser());
      setFusekiPass(await settingsStore.getFusekiPassword());
    };
    load();
  }, []);

  const handleSave = async () => {
    await settingsStore.setServerUrl(serverUrl);
    await settingsStore.setFusekiUrl(fusekiUrl);
    await settingsStore.setFusekiUser(fusekiUser);
    await settingsStore.setFusekiPassword(fusekiPass);
    Alert.alert('Saved', 'Settings have been saved.');
  };

  const handleLogout = async () => {
    // Call server logout to invalidate session, then clear local state
    await memosApi.logout();
    await settingsStore.setLoggedIn(false);
    navigation.replace('Login');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Title>Memos Server</Title>
      <TextInput
        label="Server URL"
        value={serverUrl}
        onChangeText={setServerUrl}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="url"
        placeholder="http://192.168.1.100:8080"
      />

      <Divider style={styles.divider} />

      <Title>Fuseki (SPARQL)</Title>
      <TextInput
        label="Fuseki URL"
        value={fusekiUrl}
        onChangeText={setFusekiUrl}
        style={styles.input}
        autoCapitalize="none"
        keyboardType="url"
        placeholder="http://192.168.1.100:30030"
      />
      <TextInput
        label="Username"
        value={fusekiUser}
        onChangeText={setFusekiUser}
        style={styles.input}
        autoCapitalize="none"
      />
      <TextInput
        label="Password"
        value={fusekiPass}
        onChangeText={setFusekiPass}
        secureTextEntry
        style={styles.input}
      />

      <Button mode="contained" onPress={handleSave} style={styles.button}>
        Save All Settings
      </Button>

      <Button mode="outlined" onPress={handleLogout} style={styles.logout} textColor="red">
        Logout
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: { marginBottom: 15 },
  divider: { marginVertical: 20 },
  button: { marginTop: 10 },
  logout: { marginTop: 30, borderColor: 'red' },
});

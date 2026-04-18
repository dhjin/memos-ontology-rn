import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, Alert } from 'react-native';
import { TextInput, Button, SegmentedButtons } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { memosApi } from '../api/memosApi';
import { EpistemicStatus, RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'MemoEdit'>;

export const MemoEditScreen = ({ navigation }: Props) => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [status, setStatus] = useState<EpistemicStatus>('A');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!title || !content) {
      Alert.alert('Missing Fields', 'Title and Content are required');
      return;
    }
    setLoading(true);
    try {
      await memosApi.saveMemo(title, content, status);
      navigation.goBack();
    } catch (e) {
      Alert.alert('Save Failed', memosApi.userFriendlyError(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput label="Title" value={title} onChangeText={setTitle} style={styles.input} />
      <TextInput
        label="Content"
        value={content}
        onChangeText={setContent}
        multiline
        numberOfLines={10}
        style={styles.input}
      />

      <View style={styles.statusContainer}>
        <SegmentedButtons
          value={status}
          onValueChange={v => setStatus(v as EpistemicStatus)}
          buttons={[
            { value: 'A', label: 'Asserted' },
            { value: 'P', label: 'Presumed' },
            { value: 'D', label: 'Defeasible' },
            { value: 'X', label: 'Unknown' },
          ]}
        />
      </View>

      <Button mode="contained" onPress={handleSave} loading={loading} disabled={loading} style={styles.button}>
        Save Memo
      </Button>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20 },
  input: { marginBottom: 15 },
  statusContainer: { marginBottom: 20 },
  button: { marginTop: 10 },
});

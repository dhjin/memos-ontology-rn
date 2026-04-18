import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { TextInput, Button, Card, Title, Paragraph, List } from 'react-native-paper';
import { memosApi } from '../api/memosApi';
import { Memo } from '../types';

interface NlqResult {
  answer: string;
  results: Memo[];
}

export const NlqScreen = () => {
  const [query, setQuery] = useState('');
  const [answer, setAnswer] = useState('');
  const [results, setResults] = useState<Memo[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!query) return;
    setLoading(true);
    try {
      const data: NlqResult = await memosApi.nlQuery(query);
      setAnswer(data.answer);
      setResults(data.results || []);
    } catch (e) {
      Alert.alert('Query Error', memosApi.userFriendlyError(e));
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.searchBox}>
        <TextInput
          label="Ask anything about your memos..."
          value={query}
          onChangeText={setQuery}
          style={styles.input}
        />
        <Button mode="contained" onPress={handleSearch} loading={loading} disabled={loading}>
          Query
        </Button>
      </View>

      {answer ? (
        <Card style={styles.card}>
          <Card.Content>
            <Title>AI Answer</Title>
            <Paragraph>{answer}</Paragraph>
          </Card.Content>
        </Card>
      ) : null}

      <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <List.Item title={item.title} description={item.content} />
        )}
        ListHeaderComponent={results.length > 0 ? <Title style={styles.listHeader}>Related Memos</Title> : null}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  searchBox: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  input: { flex: 1, marginRight: 10 },
  card: { marginBottom: 15 },
  listHeader: { padding: 10 },
});

import React, { useState } from 'react';
import { View, StyleSheet, FlatList, Alert } from 'react-native';
import { TextInput, Button, Title, List, SegmentedButtons, Text } from 'react-native-paper';
import { fusekiApi } from '../api/fusekiApi';

interface SparqlBinding {
  [key: string]: { value: string };
}

export const OntologyScreen = () => {
  const [tab, setTab] = useState('sparql');
  const [query, setQuery] = useState('SELECT * WHERE { ?s ?p ?o } LIMIT 10');
  const [results, setResults] = useState<SparqlBinding[]>([]);
  const [loading, setLoading] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [implications, setImplications] = useState<string[]>([]);
  const [implLoading, setImplLoading] = useState(false);

  const runSparql = async () => {
    setLoading(true);
    try {
      const data = await fusekiApi.sparqlQuery(query);
      setResults(data.results?.bindings || []);
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'SPARQL query failed';
      Alert.alert('SPARQL Error', 'Failed to execute query. Check your Fuseki connection in settings.');
      console.error('[OntologyScreen] SPARQL error:', msg);
    } finally {
      setLoading(false);
    }
  };

  const fetchImplications = async () => {
    if (!keyword.trim()) return;
    setImplLoading(true);
    try {
      const data = await fusekiApi.getImplications(keyword);
      const found = (data.results?.bindings || [])
        .map((b: SparqlBinding) => b.implication?.value)
        .filter(Boolean);
      setImplications(found);
    } catch (e: unknown) {
      Alert.alert('Error', 'Failed to fetch implications. Check Fuseki settings.');
      console.error('[OntologyScreen] implications error:', e);
    } finally {
      setImplLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <SegmentedButtons
        value={tab}
        onValueChange={setTab}
        buttons={[
          { value: 'sparql', label: 'SPARQL' },
          { value: 'browser', label: 'Implications' },
        ]}
        style={styles.tabs}
      />

      {tab === 'sparql' ? (
        <View style={{ flex: 1 }}>
          <TextInput
            multiline
            numberOfLines={5}
            value={query}
            onChangeText={setQuery}
            style={styles.editor}
          />
          <Button mode="contained" onPress={runSparql} loading={loading} style={styles.button}>
            Execute Query
          </Button>
          <FlatList
            data={results}
            keyExtractor={(_, index) => `sparql-${index}`}
            style={styles.resultList}
            renderItem={({ item }) => (
              <List.Item
                title={item.s?.value || '(no subject)'}
                description={`${item.p?.value ?? ''} → ${item.o?.value ?? ''}`}
              />
            )}
            ListEmptyComponent={!loading ? <Text style={styles.empty}>No results</Text> : null}
          />
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <View style={styles.searchRow}>
            <TextInput
              label="Keyword"
              value={keyword}
              onChangeText={setKeyword}
              style={styles.searchInput}
            />
            <Button mode="contained" onPress={fetchImplications} loading={implLoading}>
              Search
            </Button>
          </View>
          <FlatList
            data={implications}
            keyExtractor={(item) => item}
            style={styles.resultList}
            renderItem={({ item }) => (
              <List.Item title={item} left={props => <List.Icon {...props} icon="arrow-right-bold" />} />
            )}
            ListEmptyComponent={!implLoading ? <Text style={styles.empty}>Enter a keyword to browse implications</Text> : null}
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 10 },
  tabs: { marginBottom: 15 },
  editor: { marginBottom: 10 },
  button: { marginBottom: 15 },
  resultList: { flex: 1 },
  searchRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  searchInput: { flex: 1, marginRight: 10 },
  empty: { textAlign: 'center', color: '#888', marginTop: 20 },
});

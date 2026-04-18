import React, { useEffect, useState } from 'react';
import { ScrollView, StyleSheet, Alert } from 'react-native';
import { Title, Paragraph, Subheading, Divider, List, ActivityIndicator } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { memosApi } from '../api/memosApi';
import { fusekiApi } from '../api/fusekiApi';
import { Memo, RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'MemoDetail'>;

export const MemoDetailScreen = ({ route }: Props) => {
  const { memoId } = route.params;
  const [memo, setMemo] = useState<Memo | null>(null);
  const [implications, setImplications] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        // Fetch single memo by ID (O(1) instead of O(N) full list fetch)
        const found = await memosApi.getMemo(memoId);
        if (found) {
          setMemo(found);
          try {
            const fusekiData = await fusekiApi.getImplications(found.title);
            const results = fusekiData.results.bindings
              .map((b: Record<string, { value: string }>) => b.implication?.value)
              .filter(Boolean);
            setImplications(results);
          } catch {
            // Fuseki errors are non-critical; silently skip
          }
        }
      } catch (e) {
        Alert.alert('Error', memosApi.userFriendlyError(e));
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [memoId]);

  if (loading) return <ActivityIndicator style={styles.loader} size="large" />;
  if (!memo) return null;

  return (
    <ScrollView style={styles.container}>
      <Title>{memo.title}</Title>
      <Subheading>Status: {memo.epistemic_status} | {memo.timestamp}</Subheading>
      <Divider style={styles.divider} />
      <Paragraph style={styles.content}>{memo.content}</Paragraph>

      <Divider style={styles.divider} />
      <Title>Implications (from Ontology)</Title>
      {implications.length > 0 ? (
        implications.map((imp) => (
          <List.Item key={imp} title={imp} left={props => <List.Icon {...props} icon="arrow-right-bold" />} />
        ))
      ) : (
        <Paragraph>No implications found in ontology.</Paragraph>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15 },
  loader: { flex: 1, justifyContent: 'center', marginTop: 60 },
  divider: { marginVertical: 15 },
  content: { fontSize: 16, lineHeight: 24 },
});

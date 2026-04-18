import React, { useEffect, useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, Alert, RefreshControl } from 'react-native';
import { List, FAB, Badge, Text, ActivityIndicator } from 'react-native-paper';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { memosApi } from '../api/memosApi';
import { Memo, EpistemicStatus, RootStackParamList } from '../types';

type Props = NativeStackScreenProps<RootStackParamList, 'Main'>;

const getStatusColor = (status: EpistemicStatus) => {
  switch (status) {
    case 'A': return 'green';
    case 'P': return 'blue';
    case 'D': return 'orange';
    case 'X': return 'grey';
    default: return 'grey';
  }
};

export const HomeScreen = ({ navigation }: Props) => {
  const [memos, setMemos] = useState<Memo[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchMemos = useCallback(async () => {
    try {
      const data = await memosApi.getMemos();
      setMemos(data);
    } catch (e) {
      Alert.alert('Error', memosApi.userFriendlyError(e));
    }
  }, []);

  useEffect(() => {
    fetchMemos().finally(() => setLoading(false));
  }, [fetchMemos]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchMemos();
    setRefreshing(false);
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete Memo', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete', style: 'destructive', onPress: async () => {
          try {
            await memosApi.deleteMemo(id);
            setMemos(prev => prev.filter(m => m.id !== id));
          } catch (e) {
            Alert.alert('Error', memosApi.userFriendlyError(e));
          }
        }
      }
    ]);
  };

  const renderItem = ({ item }: { item: Memo }) => (
    <List.Item
      title={item.title}
      description={item.content.substring(0, 50) + (item.content.length > 50 ? '...' : '')}
      onPress={() => navigation.navigate('MemoDetail', { memoId: item.id })}
      onLongPress={() => handleDelete(item.id)}
      right={() => (
        <View style={styles.badgeContainer}>
          <Badge style={{ backgroundColor: getStatusColor(item.epistemic_status) }}>
            {item.epistemic_status}
          </Badge>
        </View>
      )}
    />
  );

  if (loading) {
    return <ActivityIndicator style={styles.loader} size="large" />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={memos}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        ListEmptyComponent={<Text style={styles.empty}>No memos yet. Tap + to create one.</Text>}
      />
      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => navigation.navigate('MemoEdit', {})}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  loader: { flex: 1, justifyContent: 'center', marginTop: 60 },
  badgeContainer: { justifyContent: 'center', paddingRight: 10 },
  fab: { position: 'absolute', margin: 16, right: 0, bottom: 0 },
  empty: { textAlign: 'center', marginTop: 40, color: '#888' },
});

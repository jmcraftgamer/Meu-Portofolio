import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { CATEGORIES } from '../types';

const CATEGORY_ICONS: Record<string, string> = {
  Limpeza: '[L]',
  Higiene: '[H]',
  Mercearia: '[M]',
  Biscoitos: '[B]',
  Acougue: '[A]',
};

interface Props {
  navigation: any;
}

export default function CategoriesScreen({ navigation }: Props) {
  const handleCategory = (cat: string) => {
    navigation.navigate('HomeTab', { screen: 'Home', params: { category: cat } });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Categorias</Text>
        <Text style={styles.subtitle}>Escolha uma categoria para explorar</Text>
      </View>

      <FlatList
        data={CATEGORIES as unknown as string[]}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => handleCategory(item)}>
            <Text style={styles.icon}>{CATEGORY_ICONS[item]}</Text>
            <View style={styles.info}>
              <Text style={styles.categoryName}>{item}</Text>
              <Text style={styles.categoryDesc}>Ver produtos</Text>
            </View>
            <Text style={styles.arrow}>{'>'}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#c62828', padding: 20 },
  title: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  subtitle: { color: '#ffcdd2', fontSize: 14, marginTop: 4 },
  list: { padding: 16 },
  card: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  icon: { fontSize: 28, width: 48, height: 48, backgroundColor: '#fce4ec', borderRadius: 24, textAlign: 'center', lineHeight: 48, color: '#c62828' },
  info: { flex: 1, marginLeft: 16 },
  categoryName: { fontSize: 16, fontWeight: '600', color: '#333' },
  categoryDesc: { fontSize: 13, color: '#999', marginTop: 2 },
  arrow: { fontSize: 20, color: '#ccc' },
});

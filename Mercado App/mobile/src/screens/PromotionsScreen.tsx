import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, ActivityIndicator, Alert
} from 'react-native';
import { Product } from '../types';
import { products as productsApi } from '../services/api';
import { useCart } from '../contexts/CartContext';

export default function PromotionsScreen() {
  const [productList, setProductList] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const { addItem } = useCart();

  useEffect(() => {
    productsApi.promotions()
      .then(setProductList)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  const handleAdd = (product: Product) => {
    addItem(product);
    Alert.alert('Adicionado', `${product.name} foi adicionado ao carrinho`);
  };

  const renderProduct = ({ item }: { item: Product }) => (
    <View style={styles.card}>
      <View style={styles.imagePlaceholder}>
        <Text style={styles.placeholderText}>[*]</Text>
        <View style={styles.promoBadge}>
          <Text style={styles.promoBadgeText}>PROMO</Text>
        </View>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
        <View style={styles.priceRow}>
          <Text style={styles.oldPrice}>R$ {item.price.toFixed(2)}</Text>
          <Text style={styles.promoPrice}>R$ {item.promo_price?.toFixed(2)}</Text>
        </View>
        <TouchableOpacity
          style={[styles.addButton, item.stock === 0 && styles.disabledButton]}
          onPress={() => handleAdd(item)}
          disabled={item.stock === 0}
        >
          <Text style={styles.addButtonText}>
            {item.stock === 0 ? 'Indisponivel' : 'Adicionar'}
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#c62828" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Promocoes</Text>
        <Text style={styles.subtitle}>Ofertas especiais para voce</Text>
      </View>

      <FlatList
        data={productList}
        renderItem={renderProduct}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.center}>
            <Text style={styles.emptyText}>Nenhuma promocao no momento</Text>
          </View>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { backgroundColor: '#c62828', padding: 20 },
  title: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  subtitle: { color: '#ffcdd2', fontSize: 14, marginTop: 4 },
  list: { padding: 8 },
  row: { justifyContent: 'space-between' },
  card: { backgroundColor: '#fff', borderRadius: 12, margin: 6, flex: 1, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3, overflow: 'hidden' },
  imagePlaceholder: { height: 120, backgroundColor: '#f0f0f0', justifyContent: 'center', alignItems: 'center' },
  placeholderText: { fontSize: 24, color: '#ccc' },
  promoBadge: { position: 'absolute', top: 8, left: 8, backgroundColor: '#c62828', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4 },
  promoBadgeText: { color: '#fff', fontSize: 10, fontWeight: 'bold' },
  cardBody: { padding: 10 },
  productName: { fontSize: 13, fontWeight: '600', color: '#333', marginBottom: 4 },
  priceRow: { marginBottom: 6 },
  oldPrice: { fontSize: 11, color: '#999', textDecorationLine: 'line-through' },
  promoPrice: { fontSize: 18, fontWeight: 'bold', color: '#c62828' },
  addButton: { backgroundColor: '#c62828', paddingVertical: 8, borderRadius: 8, alignItems: 'center' },
  disabledButton: { backgroundColor: '#ccc' },
  addButtonText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  emptyText: { fontSize: 16, color: '#999' },
});

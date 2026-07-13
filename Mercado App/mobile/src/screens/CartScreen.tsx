import React, { useState } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, Alert, TextInput, ScrollView
} from 'react-native';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { orders as ordersApi } from '../services/api';

export default function CartScreen() {
  const { items, updateQuantity, removeItem, totalPrice, clearCart } = useCart();
  const { user } = useAuth();
  const [checkout, setCheckout] = useState(false);
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [notes, setNotes] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!address || !phone) {
      Alert.alert('Erro', 'Preencha endereco e telefone');
      return;
    }
    setSubmitting(true);
    try {
      await ordersApi.create({
        items: items.map((i) => ({ product_id: i.product.id, quantity: i.quantity })),
        address, phone, notes,
      });
      clearCart();
      Alert.alert('Sucesso', 'Pedido realizado com sucesso!');
      setCheckout(false);
    } catch (err: any) {
      Alert.alert('Erro', err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const getPrice = (item: typeof items[0]) =>
    item.product.is_promotion && item.product.promo_price
      ? item.product.promo_price : item.product.price;

  if (items.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.emptyIcon}>[  ]</Text>
        <Text style={styles.emptyTitle}>Carrinho vazio</Text>
        <Text style={styles.emptySub}>Adicione produtos para comecar</Text>
      </View>
    );
  }

  if (checkout) {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.title}>Finalizar Pedido</Text>
        </View>
        <View style={styles.form}>
          <Text style={styles.label}>Endereco *</Text>
          <TextInput
            style={styles.input}
            value={address}
            onChangeText={setAddress}
            placeholder="Rua, numero, bairro..."
            multiline
          />
          <Text style={styles.label}>Telefone *</Text>
          <TextInput
            style={styles.input}
            value={phone}
            onChangeText={setPhone}
            placeholder="(xx) xxxxx-xxxx"
            keyboardType="phone-pad"
          />
          <Text style={styles.label}>Observacoes</Text>
          <TextInput
            style={styles.input}
            value={notes}
            onChangeText={setNotes}
            placeholder="Opcional"
            multiline
          />
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total</Text>
            <Text style={styles.totalValue}>R$ {totalPrice.toFixed(2)}</Text>
          </View>
          <TouchableOpacity
            style={[styles.submitButton, submitting && { opacity: 0.6 }]}
            onPress={handleSubmit}
            disabled={submitting}
          >
            <Text style={styles.submitButtonText}>
              {submitting ? 'Enviando...' : 'Confirmar Pedido'}
            </Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.backButton} onPress={() => setCheckout(false)}>
            <Text style={styles.backButtonText}>Voltar</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Carrinho</Text>
        <Text style={styles.subtitle}>{items.length} item(ns)</Text>
      </View>

      <FlatList
        data={items}
        renderItem={({ item }) => (
          <View style={styles.cartItem}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName} numberOfLines={1}>{item.product.name}</Text>
              <Text style={styles.itemPrice}>R$ {getPrice(item).toFixed(2)}</Text>
            </View>
            <View style={styles.qtyControl}>
              <TouchableOpacity onPress={() => updateQuantity(item.product.id, item.quantity - 1)} style={styles.qtyBtn}>
                <Text>-</Text>
              </TouchableOpacity>
              <Text style={styles.qtyText}>{item.quantity}</Text>
              <TouchableOpacity onPress={() => updateQuantity(item.product.id, item.quantity + 1)} style={styles.qtyBtn}>
                <Text>+</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.itemTotal}>
              R$ {(getPrice(item) * item.quantity).toFixed(2)}
            </Text>
            <TouchableOpacity onPress={() => removeItem(item.product.id)} style={styles.removeBtn}>
              <Text style={styles.removeBtnText}>X</Text>
            </TouchableOpacity>
          </View>
        )}
        keyExtractor={(item) => item.product.id.toString()}
        contentContainerStyle={styles.list}
      />

      <View style={styles.footer}>
        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Total</Text>
          <Text style={styles.totalValue}>R$ {totalPrice.toFixed(2)}</Text>
        </View>
        <TouchableOpacity
          style={styles.checkoutButton}
          onPress={() => {
            if (!user) {
              Alert.alert('Login', 'Faca login para finalizar');
              return;
            }
            setCheckout(true);
          }}
        >
          <Text style={styles.checkoutButtonText}>Finalizar Pedido</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  emptyIcon: { fontSize: 48, color: '#ccc', marginBottom: 12 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: '#666' },
  emptySub: { fontSize: 14, color: '#999', marginTop: 4 },
  header: { backgroundColor: '#c62828', padding: 20 },
  title: { color: '#fff', fontSize: 22, fontWeight: 'bold' },
  subtitle: { color: '#ffcdd2', fontSize: 14, marginTop: 4 },
  list: { padding: 16 },
  cartItem: { backgroundColor: '#fff', borderRadius: 12, padding: 12, marginBottom: 8, flexDirection: 'row', alignItems: 'center', shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
  itemInfo: { flex: 1 },
  itemName: { fontSize: 14, fontWeight: '500', color: '#333' },
  itemPrice: { fontSize: 13, color: '#c62828', fontWeight: '600', marginTop: 2 },
  qtyControl: { flexDirection: 'row', alignItems: 'center', marginHorizontal: 8 },
  qtyBtn: { width: 28, height: 28, borderRadius: 14, borderWidth: 1, borderColor: '#ddd', justifyContent: 'center', alignItems: 'center' },
  qtyText: { marginHorizontal: 8, fontSize: 14, fontWeight: '600' },
  itemTotal: { fontSize: 14, fontWeight: '700', color: '#333', marginRight: 8, width: 70, textAlign: 'right' },
  removeBtn: { padding: 4 },
  removeBtnText: { color: '#ef4444', fontWeight: 'bold', fontSize: 16 },
  footer: { backgroundColor: '#fff', padding: 16, borderTopWidth: 1, borderTopColor: '#eee' },
  totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  totalLabel: { fontSize: 16, fontWeight: '600', color: '#333' },
  totalValue: { fontSize: 22, fontWeight: 'bold', color: '#c62828' },
  checkoutButton: { backgroundColor: '#c62828', paddingVertical: 14, borderRadius: 12, alignItems: 'center' },
  checkoutButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  form: { padding: 16 },
  label: { fontSize: 14, fontWeight: '600', color: '#333', marginBottom: 6, marginTop: 12 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 14 },
  submitButton: { backgroundColor: '#c62828', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 20 },
  submitButtonText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  backButton: { alignItems: 'center', marginTop: 12 },
  backButtonText: { color: '#999', fontSize: 14 },
});

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, TextInput, Alert } from 'react-native';
import { Order, Message, STATUS_LABELS } from '../types';
import { orders as ordersApi, chat as chatApi, admin as adminApi } from '../services/api';
import { useAuth } from '../contexts/AuthContext';

export default function AdminOrdersScreen() {
  const [orderList, setOrderList] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [msgText, setMsgText] = useState('');
  const { user } = useAuth();
  const chatRef = useRef<FlatList>(null);

  const fetchOrders = useCallback(async () => {
    try {
      const data = await ordersApi.list();
      setOrderList(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const fetchMessages = useCallback(async (orderId: number) => {
    try {
      const data = await chatApi.list(orderId);
      setMessages(data);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    if (expandedOrder) {
      fetchMessages(expandedOrder);
      const timer = setInterval(() => fetchMessages(expandedOrder), 5000);
      return () => clearInterval(timer);
    }
  }, [expandedOrder, fetchMessages]);

  const handleSend = async () => {
    if (!msgText.trim() || !expandedOrder) return;
    try {
      const msg = await chatApi.send(expandedOrder, msgText.trim());
      setMessages((prev) => [...prev, msg]);
      setMsgText('');
    } catch (err) {
      console.error(err);
    }
  };

  const updateStatus = async (id: number, status: string) => {
    try {
      await adminApi.updateOrderStatus(id, status);
      fetchOrders();
    } catch (err) {
      console.error(err);
    }
  };

  const statusColors: Record<string, string> = {
    pending: '#f59e0b',
    preparing: '#3b82f6',
    out_for_delivery: '#8b5cf6',
    delivered: '#10b981',
    cancelled: '#ef4444',
  };

  const statusFlow = ['pending', 'preparing', 'out_for_delivery', 'delivered'] as const;

  const getNextStatus = (current: string) => {
    const idx = statusFlow.indexOf(current as any);
    if (idx >= 0 && idx < statusFlow.length - 1) return statusFlow[idx + 1];
    return null;
  };

  const renderOrder = ({ item }: { item: Order }) => {
    const next = getNextStatus(item.status);
    return (
      <View style={[styles.orderCard, { borderLeftColor: statusColors[item.status] || '#ccc', borderLeftWidth: 4 }]}>
        <View style={styles.orderHeader}>
          <View>
            <Text style={styles.orderTitle}>Pedido #{item.id}</Text>
            <Text style={styles.orderDate}>
              {new Date(item.created_at).toLocaleDateString('pt-BR', {
                day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit'
              })}
            </Text>
          </View>
          <View style={[styles.statusBadge, { backgroundColor: statusColors[item.status] + '20' }]}>
            <Text style={[styles.statusText, { color: statusColors[item.status] }]}>
              {STATUS_LABELS[item.status]}
            </Text>
          </View>
        </View>

        <View style={styles.itemsList}>
          {item.items.map((itm: any) => (
            <View key={itm.id} style={styles.itemRow}>
              <Text style={styles.itemName}>{itm.product_name} x{itm.quantity}</Text>
              <Text style={styles.itemPrice}>R$ {(itm.price * itm.quantity).toFixed(2)}</Text>
            </View>
          ))}
        </View>

        <View style={styles.orderFooter}>
          <Text style={styles.totalText}>Total: R$ {item.total.toFixed(2)}</Text>
        </View>

        <View style={styles.orderInfo}>
          <Text style={styles.infoText}>Nome: {item.delivery_name || `Cliente #${item.user_id}`}</Text>
          <Text style={styles.infoText}>Tel: {item.phone}</Text>
          <Text style={styles.infoText}>Endereco: {item.address}</Text>
          {item.troco ? <Text style={styles.infoText}>Troco para: R$ {item.troco}</Text> : null}
          {item.notes ? <Text style={styles.infoText}>Obs: {item.notes}</Text> : null}
        </View>

        <View style={styles.orderActions}>
          {next && item.status !== 'cancelled' && (
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: '#e53935' }]}
              onPress={() => updateStatus(item.id, next)}
            >
              <Text style={styles.actionBtnText}>
                {next === 'out_for_delivery' ? 'Notificar entrega' : STATUS_LABELS[next]}
              </Text>
            </TouchableOpacity>
          )}
          {item.status !== 'cancelled' && item.status !== 'delivered' && (
            <TouchableOpacity
              style={[styles.actionBtn, { backgroundColor: '#666' }]}
              onPress={() => {
                Alert.alert('Cancelar', 'Cancelar este pedido?', [
                  { text: 'Nao', style: 'cancel' },
                  { text: 'Sim', style: 'destructive', onPress: () => updateStatus(item.id, 'cancelled') },
                ]);
              }}
            >
              <Text style={styles.actionBtnText}>Cancelar</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.actionBtn, { backgroundColor: expandedOrder === item.id ? '#c62828' : '#4a5568' }]}
            onPress={() => {
              if (expandedOrder === item.id) {
                setExpandedOrder(null);
                setMessages([]);
              } else {
                setExpandedOrder(item.id);
              }
            }}
          >
            <Text style={styles.actionBtnText}>
              {expandedOrder === item.id ? 'Fechar chat' : 'Chat'}
            </Text>
          </TouchableOpacity>
        </View>

        {expandedOrder === item.id && (
          <View style={styles.chatSection}>
            <FlatList
              ref={chatRef}
              data={messages}
              keyExtractor={(msg) => msg.id.toString()}
              style={styles.messageList}
              ListEmptyComponent={<Text style={styles.emptyChat}>Nenhuma mensagem</Text>}
              renderItem={({ item: msg }) => {
                const isMe = msg.sender_role === user?.role;
                return (
                  <View style={[styles.msgBubble, isMe ? styles.msgMe : styles.msgOther]}>
                    <Text style={[styles.msgText, isMe && { color: '#fff' }]}>{msg.message}</Text>
                    <Text style={[styles.msgTime, isMe && { color: '#ffcdd2' }]}>
                      {new Date(msg.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                    </Text>
                  </View>
                );
              }}
            />
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                value={msgText}
                onChangeText={setMsgText}
                placeholder="Digite sua mensagem..."
                placeholderTextColor="#999"
              />
              <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
                <Text style={styles.sendBtnText}>Enviar</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Pedidos</Text>
        <Text style={styles.subtitle}>Gerencie pedidos dos clientes</Text>
      </View>
      <FlatList
        data={orderList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderOrder}
        contentContainerStyle={styles.list}
        refreshing={loading}
        onRefresh={fetchOrders}
        ListEmptyComponent={
          <Text style={styles.empty}>
            {loading ? 'Carregando...' : 'Nenhum pedido'}
          </Text>
        }
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
  empty: { textAlign: 'center', color: '#999', marginTop: 40, fontSize: 15 },
  orderCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.08, shadowRadius: 3, elevation: 2 },
  orderHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12 },
  orderTitle: { fontSize: 16, fontWeight: '600', color: '#333' },
  orderDate: { fontSize: 12, color: '#999', marginTop: 2 },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  statusText: { fontSize: 12, fontWeight: '600' },
  itemsList: { borderTopWidth: 1, borderTopColor: '#f0f0f0', paddingTop: 8, marginBottom: 8 },
  itemRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  itemName: { fontSize: 14, color: '#666', flex: 1 },
  itemPrice: { fontSize: 14, color: '#333', fontWeight: '500' },
  orderFooter: { borderTopWidth: 1, borderTopColor: '#f0f0f0', paddingTop: 8, flexDirection: 'row', justifyContent: 'flex-end' },
  totalText: { fontSize: 16, fontWeight: 'bold', color: '#c62828' },
  orderInfo: { borderTopWidth: 1, borderTopColor: '#f0f0f0', paddingTop: 8, marginBottom: 8 },
  infoText: { fontSize: 13, color: '#666', marginBottom: 2 },
  orderActions: { flexDirection: 'row', gap: 8, marginTop: 12, flexWrap: 'wrap' },
  actionBtn: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 8 },
  actionBtnText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  chatSection: { borderTopWidth: 1, borderTopColor: '#f0f0f0', marginTop: 12, paddingTop: 12 },
  messageList: { maxHeight: 200, marginBottom: 8 },
  emptyChat: { textAlign: 'center', color: '#999', padding: 20 },
  msgBubble: { maxWidth: '80%', padding: 10, borderRadius: 12, marginBottom: 8 },
  msgMe: { backgroundColor: '#c62828', alignSelf: 'flex-end', borderBottomRightRadius: 4 },
  msgOther: { backgroundColor: '#f0f0f0', alignSelf: 'flex-start', borderBottomLeftRadius: 4 },
  msgText: { fontSize: 14, color: '#333' },
  msgTime: { fontSize: 10, color: '#999', marginTop: 4, textAlign: 'right' },
  inputRow: { flexDirection: 'row', gap: 8 },
  input: { flex: 1, borderWidth: 1, borderColor: '#ddd', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 8, fontSize: 14, backgroundColor: '#fff' },
  sendBtn: { backgroundColor: '#c62828', paddingHorizontal: 16, borderRadius: 8, justifyContent: 'center' },
  sendBtnText: { color: '#fff', fontWeight: '600', fontSize: 14 },
});

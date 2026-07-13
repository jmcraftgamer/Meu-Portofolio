import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useAuth } from '../contexts/AuthContext';
import { useNavigation } from '@react-navigation/native';

export default function SettingsScreen() {
  const { user, logout } = useAuth();
  const navigation = useNavigation<any>();

  const handleLogout = () => {
    Alert.alert('Sair', 'Tem certeza?', [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Sair', style: 'destructive', onPress: logout },
    ]);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Configuracoes</Text>
        <Text style={styles.subtitle}>Sua conta e preferencias</Text>
      </View>

      <View style={styles.content}>
        {user ? (
          <>
            <View style={styles.profileCard}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{user.name.charAt(0).toUpperCase()}</Text>
              </View>
              <View style={styles.profileInfo}>
                <Text style={styles.profileName}>{user.name}</Text>
                <Text style={styles.profileEmail}>{user.email}</Text>
                <View style={styles.roleBadge}>
                  <Text style={styles.roleText}>{user.role === 'admin' ? 'Administrador' : 'Cliente'}</Text>
                </View>
              </View>
            </View>

            {user.role === 'admin' && (
              <TouchableOpacity style={styles.menuItem} onPress={() => navigation.navigate('AdminOrders')}>
                <Text style={styles.menuIcon}>[A]</Text>
                <Text style={styles.menuText}>Gerenciar Pedidos</Text>
                <Text style={styles.menuArrow}>{'>'}</Text>
              </TouchableOpacity>
            )}

            <TouchableOpacity style={styles.menuItem}>
              <Text style={styles.menuIcon}>[P]</Text>
              <Text style={styles.menuText}>Meus Pedidos</Text>
              <Text style={styles.menuArrow}>{'>'}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.menuItem, styles.logoutItem]} onPress={handleLogout}>
              <Text style={styles.menuIcon}>[S]</Text>
              <Text style={[styles.menuText, styles.logoutText]}>Sair da Conta</Text>
            </TouchableOpacity>
          </>
        ) : (
          <View style={styles.loginPrompt}>
            <Text style={styles.loginPromptText}>Faca login para acessar as configuracoes</Text>
            <TouchableOpacity style={styles.loginButton}>
              <Text style={styles.loginButtonText}>Entrar / Cadastrar</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { backgroundColor: '#c62828', padding: 20 },
  title: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  subtitle: { color: '#ffcdd2', fontSize: 14, marginTop: 4 },
  content: { padding: 16 },
  profileCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.1, shadowRadius: 4, elevation: 3 },
  avatar: { width: 56, height: 56, borderRadius: 28, backgroundColor: '#c62828', justifyContent: 'center', alignItems: 'center' },
  avatarText: { color: '#fff', fontSize: 24, fontWeight: 'bold' },
  profileInfo: { marginLeft: 16, flex: 1 },
  profileName: { fontSize: 18, fontWeight: '600', color: '#333' },
  profileEmail: { fontSize: 14, color: '#999', marginTop: 2 },
  roleBadge: { backgroundColor: '#fce4ec', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 4, alignSelf: 'flex-start', marginTop: 6 },
  roleText: { fontSize: 11, color: '#c62828', fontWeight: '600' },
  menuItem: { backgroundColor: '#fff', borderRadius: 12, padding: 16, flexDirection: 'row', alignItems: 'center', marginBottom: 8, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 2 },
  menuIcon: { fontSize: 20, width: 36, textAlign: 'center' },
  menuText: { flex: 1, fontSize: 15, color: '#333', marginLeft: 12 },
  menuArrow: { fontSize: 18, color: '#ccc' },
  logoutItem: { marginTop: 16 },
  logoutText: { color: '#ef4444' },
  loginPrompt: { backgroundColor: '#fff', borderRadius: 12, padding: 24, alignItems: 'center' },
  loginPromptText: { fontSize: 15, color: '#999', marginBottom: 16 },
  loginButton: { backgroundColor: '#c62828', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 },
  loginButtonText: { color: '#fff', fontSize: 15, fontWeight: '600' },
});

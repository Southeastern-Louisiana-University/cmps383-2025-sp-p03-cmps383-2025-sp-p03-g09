import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { baseUrl } from '@/constants/constants';

export default function UserPage() {
  const [userName, setUserName] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadUser = async () => {
      try {
        const res = await fetch(`${baseUrl}/api/authentication/me`, {
          credentials: 'include', 
        });

        if (res.ok) {
          const data = await res.json();
          setUserName(data.userName);
        } else if (res.status === 401) {
          setUserName(null);
        } else {
          throw new Error('Failed to load user');
        }
      } catch (error) {
        console.error('Error fetching user:', error);
        setUserName(null);
      } finally {
        setLoading(false);
      }
    };

    loadUser();
  }, []);

  const handleLoginPress = () => {
    router.push('/login');
  };

  const handleLogout = async () => {
    await fetch(`${baseUrl}/api/authentication/logout`, {
      method: 'POST',
      credentials: 'include',
    });
    setUserName(null);
    router.replace('/user');
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>User Profile</Text>

      <View style={styles.infoBox}>
        <Text style={styles.label}>Logged in as:</Text>
        <Text style={styles.value}>{userName ? userName : 'Guest User'}</Text>
      </View>

      {userName ? (
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Text style={styles.logoutButtonText}>Logout</Text>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity style={styles.loginButton} onPress={handleLoginPress}>
          <Text style={styles.loginButtonText}>Login</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a1a', padding: 24, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#10b981', marginBottom: 30 },
  infoBox: { width: '100%', backgroundColor: '#1f2937', padding: 20, borderRadius: 10, marginBottom: 40 },
  label: { fontSize: 16, color: '#aaa', marginBottom: 8 },
  value: { fontSize: 18, color: '#fff', fontWeight: 'bold' },
  logoutButton: { backgroundColor: '#ef4444', paddingVertical: 14, paddingHorizontal: 24, borderRadius: 8, marginTop: 20, width: '100%', alignItems: 'center' },
  logoutButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
  loginButton: { backgroundColor: '#3b82f6', paddingVertical: 14, paddingHorizontal: 24, borderRadius: 8, marginTop: 20, width: '100%', alignItems: 'center' },
  loginButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { baseUrl } from '@/constants/constants';


export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please enter both username and password.');
      return;
    }

    try {
      setLoading(true);

      const res = await fetch(`${baseUrl}/api/authentication/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include', 
        body: JSON.stringify({ userName: username, password }),
      });

      console.log('Login fetch response status:', res.status);

      if (!res.ok) {
        const text = await res.text();
        console.error('Server responded with error:', text);
        throw new Error(text || 'Login failed.');
      }

      router.replace('/user');
    } catch (error) {
      console.error('Login error:', error);
      if (error instanceof Error) {
        Alert.alert('Login Failed', error.message);
      } else {
        Alert.alert('Login Failed', 'Unknown error.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        placeholder="Username"
        placeholderTextColor="#888"
        style={styles.input}
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      <TextInput
        placeholder="Password"
        placeholderTextColor="#888"
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.loginButton} onPress={handleLogin} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.loginButtonText}>Login</Text>
        )}
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a1a', padding: 24, alignItems: 'center', justifyContent: 'center' },
  title: { fontSize: 28, fontWeight: 'bold', color: '#10b981', marginBottom: 30 },
  input: { width: '100%', backgroundColor: '#2d2d2d', padding: 14, borderRadius: 8, marginBottom: 20, color: '#fff' },
  loginButton: { backgroundColor: '#10b981', paddingVertical: 14, paddingHorizontal: 24, borderRadius: 8, width: '100%', alignItems: 'center' },
  loginButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold' },
});

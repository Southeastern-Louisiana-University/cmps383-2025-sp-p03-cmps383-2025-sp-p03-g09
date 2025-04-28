import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Stack } from 'expo-router';


interface Order {
  movieTitle: string;
  theaterId: number;
  seatLabels: string[];
  showtime: string;
  purchaseTime: string;
  foodItems: { name: string; quantity: number }[];
}

export default function PurchaseHistoryPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPurchaseHistory = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        const guestId = await AsyncStorage.getItem('guestId');

        let url = '';
        const headers: any = {
          'Content-Type': 'application/json'
        };

        if (token) {
          url = '/api/orders/user';
          headers['Authorization'] = `Bearer ${token}`;
        } else if (guestId) {
          url = `/api/orders/guest/${guestId}`;
        } else {
          throw new Error('No user or guest ID found.');
        }

        const res = await fetch(url, { headers });

        if (!res.ok) {
          throw new Error('Failed to fetch purchase history.');
        }

        const data = await res.json();

        const formatted = data.map((order: any) => ({
          movieTitle: order.ticket?.movie?.title || 'Unknown Movie',
          theaterId: order.theaterId,
          seatLabels: order.seats.map((seat: any) => `${rowToLetter(seat.row)}${seat.column}`),
          showtime: order.ticket?.showtime || '',
          purchaseTime: order.purchaseTime,
          foodItems: order.foodItems.map((fi: any) => ({
            name: fi.foodItem?.name || 'Unknown Food',
            quantity: fi.quantity
          })),
        }));

        setOrders(formatted.reverse());
      } catch (err) {
        console.error('Error loading purchase history:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPurchaseHistory();
  }, []);

  const rowToLetter = (row: string | number): string => {
    const num = typeof row === "string" ? parseInt(row, 10) : row;
    if (isNaN(num) || num <= 0) return "?";
    let result = "";
    let n = num;
    while (n > 0) {
      n--;
      result = String.fromCharCode((n % 26) + 65) + result;
      n = Math.floor(n / 26);
    }
    return result;
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Purchase History', headerStyle: { backgroundColor: '#000' }, headerTintColor: '#fff' }} />
      <ScrollView contentContainerStyle={styles.content}>
        {orders.length === 0 ? (
          <Text style={styles.noOrders}>No purchases yet.</Text>
        ) : (
          orders.map((order, idx) => (
            <View key={idx} style={styles.orderCard}>
              <Text style={styles.movieTitle}>{order.movieTitle}</Text>
              <Text style={styles.detailText}>Theater {order.theaterId}</Text>
              <Text style={styles.detailText}>Seats: {order.seatLabels.join(', ')}</Text>
              <Text style={styles.detailText}>Showtime: {new Date(order.showtime).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}</Text>
              {order.foodItems.length > 0 && (
                <Text style={styles.detailText}>
                  Food: {order.foodItems.map(fi => `${fi.name} x${fi.quantity}`).join(', ')}
                </Text>
              )}
              <Text style={styles.purchaseTime}>
                Purchased: {new Date(order.purchaseTime).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
              </Text>
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a1a' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a1a1a' },
  content: { padding: 20 },
  orderCard: { backgroundColor: '#1f2937', padding: 16, borderRadius: 8, marginBottom: 16 },
  movieTitle: { fontSize: 20, color: '#10b981', fontWeight: 'bold', marginBottom: 8 },
  detailText: { fontSize: 16, color: '#ccc', marginBottom: 4 },
  purchaseTime: { fontSize: 14, color: '#888', marginTop: 8, textAlign: 'right' },
  noOrders: { color: '#888', fontSize: 16, textAlign: 'center', marginTop: 50 }
});

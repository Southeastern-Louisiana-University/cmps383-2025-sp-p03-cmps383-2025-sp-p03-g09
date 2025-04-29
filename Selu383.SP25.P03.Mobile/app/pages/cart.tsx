import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
} from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { jwtDecode } from 'jwt-decode';
import { baseUrl } from '@/constants/constants';

const TICKET_PRICE = 12.99;

interface FoodItem {
  id: number;
  name: string;
  price: number;
}

interface Seat {
  id: number;
  row: string;
  column: number;
}

interface Movie {
  id: number;
  title: string;
}

interface DecodedToken {
  nameid: string;
  unique_name: string;
  role: string | string[];
  exp: number;
}

export default function CartPage() {
  const { movieId, locationId, theaterId, showtime, seatIds, foodItems } = useLocalSearchParams<{
    movieId: string;
    locationId: string;
    theaterId: string;
    showtime: string;
    seatIds: string;
    foodItems: string;
  }>();

  const [loading, setLoading] = useState(true);
  const [seatLabels, setSeatLabels] = useState<{ id: number; label: string }[]>([]);
  const [foodList, setFoodList] = useState<{ foodId: number; quantity: number }[]>([]);
  const [fullFoodItems, setFullFoodItems] = useState<FoodItem[]>([]);
  const [movieTitle, setMovieTitle] = useState('');

  const selectedSeatIds = seatIds ? seatIds.split(',').map(id => parseInt(id)) : [];

  useEffect(() => {
    const loadCartData = async () => {
      try {
        const parsedFood = foodItems ? JSON.parse(foodItems) : [];
        setFoodList(parsedFood);

        const movieRes = await fetch(`${baseUrl}/api/movies/${movieId}`);
        const movieData: Movie = await movieRes.json();
        setMovieTitle(movieData.title);

        const foodRes = await fetch(`${baseUrl}/api/fooditems`);
        const foodData: FoodItem[] = await foodRes.json();
        setFullFoodItems(foodData);

        const seatRes = await fetch(`${baseUrl}/api/seats/theater/${theaterId}`);
        const seatData: Seat[] = await seatRes.json();
        const matchingSeats = seatData
          .filter(seat => selectedSeatIds.includes(seat.id))
          .map(seat => ({ id: seat.id, label: `${rowToLetter(seat.row)}${seat.column}` }));
        setSeatLabels(matchingSeats);
      } catch (err) {
        console.error('Error loading cart data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadCartData();
  }, [movieId, locationId, theaterId, seatIds, foodItems]);

  const rowToLetter = (row: string | number): string => {
    const num = typeof row === 'string' ? parseInt(row, 10) : row;
    if (isNaN(num) || num <= 0) return '?';
    let result = '';
    let n = num;
    while (n > 0) {
      n--;
      result = String.fromCharCode((n % 26) + 65) + result;
      n = Math.floor(n / 26);
    }
    return result;
  };

  const calculateTotal = () => {
    let ticketTotal = seatLabels.length * TICKET_PRICE;
    let foodTotal = 0;
    for (const item of foodList) {
      const food = fullFoodItems.find(f => f.id === item.foodId);
      if (food) {
        foodTotal += food.price * item.quantity;
      }
    }
    return ticketTotal + foodTotal;
  };

  const removeSeat = (seatId: number) => {
    setSeatLabels(prev => prev.filter(s => s.id !== seatId));
  };

  const removeFoodItem = (foodId: number) => {
    setFoodList(prev => prev.filter(f => f.foodId !== foodId));
  };

  const confirmPurchase = async () => {
    if (seatLabels.length === 0) {
      alert('Please select at least one seat.');
      return;
    }
  
    try {
      const foodArray = foodList.flatMap(f => Array(f.quantity).fill(f.foodId));
  
      const payload: any = {
        movieId: Number(movieId),
        locationId: Number(locationId),
        theaterId: Number(theaterId),
        showtime,
        seatIds: seatLabels.map(seat => seat.id),
      };
  
      if (foodArray.length > 0) {
        payload.foodItemIds = foodArray;
      }
  
      const headers: any = {
        'Content-Type': 'application/json',
      };
  
      const guestId = await AsyncStorage.getItem('guestId');
      if (guestId) {
        headers['X-Guest-ID'] = guestId;
      }
  
      const res = await fetch(`${baseUrl}/api/orders`, {
        method: 'POST',
        headers,
        credentials: 'include',
        body: JSON.stringify(payload),
      });
  
      if (!res.ok) {
        const text = await res.text();
        console.error('Server Error Response:', text);
        throw new Error('Purchase failed.');
      }
  
      router.push({
        pathname: '/pages/purchaseconfirmation',
        params: {
          movieId,
          locationId,
          theaterId,
          showtime,
          seatIds: seatLabels.map(seat => seat.id).join(','),
          foodItems: JSON.stringify(foodList),
        },
      });
    } catch (error) {
      console.error('Error confirming purchase:', error);
      alert('Failed to complete purchase. Please try again.');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10b981" />
        <Text style={styles.loadingText}>Loading Cart...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Cart', headerStyle: { backgroundColor: '#000' }, headerTintColor: '#fff' }} />
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.movieTitle}>{movieTitle}</Text>
        <Text style={styles.theaterShowtime}>
          Theater {theaterId} • {new Date(showtime || '').toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
        </Text>

        <Text style={styles.sectionTitle}>Your Tickets</Text>
        {seatLabels.map(seat => (
          <View key={seat.id} style={styles.ticket}>
            <View style={styles.rowBetween}>
              <Text style={styles.ticketText}>{seat.label}</Text>
              <TouchableOpacity onPress={() => removeSeat(seat.id)}>
                <Text style={styles.removeButton}>Remove</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.ticketSubText}>
              Theater {theaterId} • {new Date(showtime || '').toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
            </Text>
          </View>
        ))}

        {foodList.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Concessions</Text>
            {foodList.map(item => {
              const food = fullFoodItems.find(f => f.id === item.foodId);
              if (!food) return null;
              return (
                <View key={item.foodId} style={styles.rowBetween}>
                  <Text style={styles.foodItem}>{food.name} x{item.quantity}</Text>
                  <TouchableOpacity onPress={() => removeFoodItem(item.foodId)}>
                    <Text style={styles.removeButton}>Remove</Text>
                  </TouchableOpacity>
                </View>
              );
            })}
          </>
        )}

        <Text style={styles.total}>
          Total: ${calculateTotal().toFixed(2)}
        </Text>

        <TouchableOpacity style={styles.confirmButton} onPress={confirmPurchase}>
          <Text style={styles.confirmButtonText}>Confirm Purchase</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a1a' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a1a1a' },
  loadingText: { color: '#fff', marginTop: 12 },
  content: { padding: 20 },
  movieTitle: { fontSize: 24, color: '#fff', fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
  theaterShowtime: { fontSize: 16, color: '#ccc', marginBottom: 24, textAlign: 'center' },
  sectionTitle: { fontSize: 22, color: '#fff', fontWeight: 'bold', marginBottom: 12 },
  ticket: { backgroundColor: '#1f2937', padding: 14, borderRadius: 10, marginBottom: 16 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  ticketText: { fontSize: 18, fontWeight: 'bold', color: '#10b981' },
  ticketSubText: { fontSize: 14, color: '#ccc' },
  foodItem: { fontSize: 16, color: '#ccc' },
  removeButton: { color: '#ef4444', fontSize: 14, fontWeight: 'bold' },
  total: { fontSize: 20, color: '#fff', fontWeight: 'bold', textAlign: 'center', marginTop: 20 },
  confirmButton: { backgroundColor: '#10b981', paddingVertical: 14, borderRadius: 8, marginTop: 30 },
  confirmButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
});

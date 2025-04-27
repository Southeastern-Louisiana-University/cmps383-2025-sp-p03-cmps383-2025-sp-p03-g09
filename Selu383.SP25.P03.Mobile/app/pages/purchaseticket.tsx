import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Alert,
  Image,
} from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';

const TICKET_PRICE = 12.99;

interface FoodItem {
  id: number;
  name: string;
  price: number;
  locationId: number;
  imageUrl?: string;
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

export default function PurchaseTicketPage() {
  const { movieId, locationId, theaterId, showtime, seatIds } = useLocalSearchParams<{
    movieId: string;
    locationId: string;
    theaterId: string;
    showtime: string;
    seatIds: string;
  }>();

  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [quantities, setQuantities] = useState<{ [foodId: number]: number }>({});
  const [loading, setLoading] = useState<boolean>(true);
  const [seatLabels, setSeatLabels] = useState<string[]>([]);
  const [movieTitle, setMovieTitle] = useState<string>('');

  const selectedSeatIds = seatIds ? seatIds.split(',').map(id => parseInt(id)) : [];

  useEffect(() => {
    const loadData = async () => {
      try {
        const movieRes = await fetch(`/api/movies/${movieId}`);
        const movieData: Movie = await movieRes.json();
        setMovieTitle(movieData.title);

        const foodRes = await fetch('/api/fooditems');
        const foodData: FoodItem[] = await foodRes.json();
        const filtered = foodData.filter(item => item.locationId === Number(locationId));
        const shuffled = filtered.sort(() => 0.5 - Math.random());
        setFoodItems(shuffled.slice(0, 3));

        const seatRes = await fetch(`/api/seats/theater/${theaterId}`);
        const seatData: Seat[] = await seatRes.json();
        const matchingSeats = seatData.filter(seat => selectedSeatIds.includes(seat.id));
        const labels = matchingSeats.map(seat => `${rowToLetter(seat.row)}${seat.column}`);
        setSeatLabels(labels);
      } catch (err) {
        console.error('Failed to load data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [movieId, locationId, theaterId, seatIds]);

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

  const addFoodItem = (foodId: number) => {
    setQuantities(prev => ({
      ...prev,
      [foodId]: (prev[foodId] || 0) + 1,
    }));
  };

  const removeFoodItem = (foodId: number) => {
    setQuantities(prev => ({
      ...prev,
      [foodId]: Math.max((prev[foodId] || 0) - 1, 0),
    }));
  };

  const calculateTotal = () => {
    let foodTotal = 0;
    for (const id in quantities) {
      const item = foodItems.find(f => f.id === parseInt(id));
      if (item) {
        foodTotal += item.price * (quantities[item.id] || 0);
      }
    }
    const ticketTotal = selectedSeatIds.length * TICKET_PRICE;
    return ticketTotal + foodTotal;
  };

  const continueToCart = () => {
    if (!seatIds) {
      Alert.alert('No seats selected', 'Please select seats first.');
      return;
    }

    router.push({
      pathname: '/pages/cart',
      params: {
        movieId,
        locationId,
        theaterId,
        showtime,
        seatIds: seatIds,
        foodItems: JSON.stringify(
          Object.entries(quantities)
            .filter(([_, qty]) => qty > 0)
            .map(([foodId, qty]) => ({ foodId: parseInt(foodId), quantity: qty }))
        ),
      },
    });
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10b981" />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Purchase Ticket', headerStyle: { backgroundColor: '#000' }, headerTintColor: '#fff' }} />
      
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.movieTitle}>{movieTitle}</Text>
        <Text style={styles.theaterShowtime}>
          Theater {theaterId} • {new Date(showtime || '').toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
        </Text>

        <Text style={styles.sectionTitle}>Selected Seats</Text>
        <Text style={styles.selectedSeats}>
          {seatLabels.join(', ') || 'None'}
        </Text>

        <Text style={styles.sectionTitle}>Want to add some food/drink?</Text>
        {foodItems.map(food => (
          <View key={food.id} style={styles.foodItem}>
            {food.imageUrl && (
              <Image
                source={{ uri: food.imageUrl }}
                style={styles.foodImage}
                resizeMode="cover"
              />
            )}
            <View style={styles.foodNamePrice}>
              <Text style={styles.foodName}>{food.name}</Text>
              <Text style={styles.foodPrice}>${food.price.toFixed(2)}</Text>
            </View>
            <View style={styles.foodControls}>
              <TouchableOpacity onPress={() => removeFoodItem(food.id)} style={styles.controlButton}>
                <Text style={styles.controlButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.foodQuantity}>{quantities[food.id] || 0}</Text>
              <TouchableOpacity onPress={() => addFoodItem(food.id)} style={styles.controlButton}>
                <Text style={styles.controlButtonText}>+</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))}

        <Text style={styles.total}>
          Total: ${calculateTotal().toFixed(2)}
        </Text>

        <TouchableOpacity style={styles.continueButton} onPress={continueToCart}>
          <Text style={styles.continueButtonText}>Continue to Cart</Text>
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
  selectedSeats: { fontSize: 16, color: '#ccc', marginBottom: 24 },
  foodItem: { backgroundColor: '#1f2937', padding: 12, borderRadius: 8, marginBottom: 16 },
  foodImage: { width: '100%', height: 120, borderRadius: 8, marginBottom: 8 },
  foodNamePrice: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  foodName: { color: '#fff', fontSize: 16 },
  foodPrice: { color: '#10b981', fontSize: 16 },
  foodControls: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 },
  controlButton: { backgroundColor: '#10b981', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 4 },
  controlButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  foodQuantity: { color: '#fff', fontSize: 16, marginHorizontal: 8 },
  total: { fontSize: 20, color: '#fff', fontWeight: 'bold', textAlign: 'center', marginTop: 20 },
  continueButton: { backgroundColor: '#ef4444', paddingVertical: 14, borderRadius: 8, marginTop: 30 },
  continueButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
});

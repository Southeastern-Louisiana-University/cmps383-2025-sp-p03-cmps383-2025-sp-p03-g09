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

export default function PurchaseConfirmationPage() {
  const { movieId, locationId, theaterId, showtime, seatIds, foodItems } = useLocalSearchParams<{
    movieId: string;
    locationId: string;
    theaterId: string;
    showtime: string;
    seatIds: string;
    foodItems: string;
  }>();

  const [loading, setLoading] = useState(true);
  const [seatLabels, setSeatLabels] = useState<string[]>([]);
  const [foodList, setFoodList] = useState<{ foodId: number; quantity: number }[]>([]);
  const [fullFoodItems, setFullFoodItems] = useState<FoodItem[]>([]);
  const [movieTitle, setMovieTitle] = useState('');

  const selectedSeatIds = seatIds ? seatIds.split(',').map(id => parseInt(id)) : [];

  useEffect(() => {
    const loadData = async () => {
      try {
        const parsedFood = foodItems ? JSON.parse(foodItems) : [];
        setFoodList(parsedFood);

        // Fetch movie title
        const movieRes = await fetch(`${baseUrl}/api/movies/${movieId}`, {
          credentials: 'include',
        });        const movieData: Movie = await movieRes.json();
        setMovieTitle(movieData.title);

        // Fetch all food items
        const foodRes = await fetch(`${baseUrl}/api/fooditems`, {
          credentials: 'include',
        });        const foodData: FoodItem[] = await foodRes.json();
        setFullFoodItems(foodData);

        // Fetch seat info
        const seatRes = await fetch(`${baseUrl}/api/seats/theater/${theaterId}`, {
          credentials: 'include',
        });        
        const seatData: Seat[] = await seatRes.json();
        const matchingSeats = seatData.filter(seat => selectedSeatIds.includes(seat.id));
        const labels = matchingSeats.map(seat => `${rowToLetter(seat.row)}${seat.column}`);
        setSeatLabels(labels);
      } catch (err) {
        console.error('Error loading confirmation data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
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
    let ticketTotal = selectedSeatIds.length * TICKET_PRICE;
    let foodTotal = 0;
    for (const item of foodList) {
      const food = fullFoodItems.find(f => f.id === item.foodId);
      if (food) {
        foodTotal += food.price * item.quantity;
      }
    }
    return ticketTotal + foodTotal;
  };

  const returnHome = () => {
    router.push('/');
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10b981" />
        <Text style={styles.loadingText}>Finalizing your order...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Purchase Complete', headerStyle: { backgroundColor: '#000' }, headerTintColor: '#fff' }} />
      
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.successMessage}>Purchase Successful!</Text>
        <Text style={styles.successSubtext}>Enjoy your movie!</Text>

        <Text style={styles.movieTitle}>{movieTitle}</Text>
        <Text style={styles.theaterShowtime}>
          Theater {theaterId} • {new Date(showtime || '').toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
        </Text>

        <Text style={styles.sectionTitle}>Your Tickets</Text>
        {seatLabels.map((seat, index) => (
          <View key={index} style={styles.ticket}>
            <Text style={styles.ticketText}>{seat}</Text>
            <Text style={styles.ticketSubText}>Theater {theaterId} • {new Date(showtime || '').toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}</Text>
          </View>
        ))}

        {foodList.length > 0 && (
          <>
            <Text style={styles.sectionTitle}>Concessions</Text>
            {foodList.map(item => {
              const food = fullFoodItems.find(f => f.id === item.foodId);
              if (!food) return null;
              return (
                <Text key={item.foodId} style={styles.foodItem}>
                  {food.name} x{item.quantity}
                </Text>
              );
            })}
          </>
        )}

        <Text style={styles.total}>
          Total Paid: ${calculateTotal().toFixed(2)}
        </Text>

        <TouchableOpacity style={styles.returnButton} onPress={returnHome}>
          <Text style={styles.returnButtonText}>Return Home</Text>
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
  successMessage: { fontSize: 28, color: '#10b981', fontWeight: 'bold', textAlign: 'center', marginBottom: 8 },
  successSubtext: { fontSize: 18, color: '#ccc', textAlign: 'center', marginBottom: 20 },
  movieTitle: { fontSize: 24, color: '#fff', fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
  theaterShowtime: { fontSize: 16, color: '#ccc', marginBottom: 24, textAlign: 'center' },
  sectionTitle: { fontSize: 22, color: '#fff', fontWeight: 'bold', marginBottom: 12 },
  ticket: { backgroundColor: '#1f2937', padding: 14, borderRadius: 10, marginBottom: 16, alignItems: 'center' },
  ticketText: { fontSize: 18, fontWeight: 'bold', color: '#10b981' },
  ticketSubText: { fontSize: 14, color: '#ccc', marginTop: 4 },
  foodItem: { fontSize: 16, color: '#ccc', marginBottom: 8 },
  total: { fontSize: 20, color: '#fff', fontWeight: 'bold', textAlign: 'center', marginTop: 20 },
  returnButton: { backgroundColor: '#10b981', paddingVertical: 14, borderRadius: 8, marginTop: 30 },
  returnButtonText: { color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
});

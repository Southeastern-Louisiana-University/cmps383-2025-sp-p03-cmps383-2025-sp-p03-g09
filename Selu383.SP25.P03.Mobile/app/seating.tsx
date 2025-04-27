import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
  Dimensions,
} from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

const SCREEN_WIDTH = Dimensions.get('window').width;
const TOTAL_COLUMNS = 13;
const HORIZONTAL_PADDING = 32;
const GAP_BETWEEN_SEATS = 6;
const SEAT_SIZE = (SCREEN_WIDTH - HORIZONTAL_PADDING - (GAP_BETWEEN_SEATS * (TOTAL_COLUMNS - 1))) / TOTAL_COLUMNS;

interface Seat {
  id: number;
  row: string;
  column: number;
  isReserved: boolean;
}

interface Movie {
  id: number;
  title: string;
}

export default function SeatSelectionScreen() {
  const { movieId, locationId, theaterId, showtime } = useLocalSearchParams<{
    movieId: string;
    locationId: string;
    theaterId: string;
    showtime: string;
  }>();

  const [movieTitle, setMovieTitle] = useState<string>('');
  const [seats, setSeats] = useState<Seat[]>([]);
  const [takenSeatIds, setTakenSeatIds] = useState<number[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (movieId) {
          const movieRes = await fetch(`/api/movies/${movieId}`);
          const movieData: Movie = await movieRes.json();
          setMovieTitle(movieData.title);
        }

        if (theaterId) {
          const seatRes = await fetch(`/api/seats/theater/${theaterId}`);
          const seatData: Seat[] = await seatRes.json();
          setSeats(seatData);

          const reservedSeats = seatData.filter(seat => seat.isReserved).map(seat => seat.id);
          setTakenSeatIds(reservedSeats);
        }
      } catch (error) {
        console.error('Failed to load data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [movieId, theaterId, showtime]);

  useFocusEffect(
    React.useCallback(() => {
      const reloadSeats = async () => {
        try {
          if (theaterId) {
            const seatRes = await fetch(`/api/seats/theater/${theaterId}`);
            const seatData: Seat[] = await seatRes.json();
            setSeats(seatData);

            const reservedSeats = seatData.filter(seat => seat.isReserved).map(seat => seat.id);
            setTakenSeatIds(reservedSeats);
          }
        } catch (error) {
          console.error('Failed to reload seats:', error);
        }
      };

      reloadSeats();
    }, [theaterId, showtime])
  );

  const toggleSeat = (seat: Seat) => {
    const isSelected = selectedSeats.some(s => s.id === seat.id);

    if (isSelected) {
      setSelectedSeats(selectedSeats.filter(s => s.id !== seat.id));
    } else {
      if (selectedSeats.length >= 6) {
        Alert.alert("Limit Reached", "You can only select up to 6 seats.");
        return;
      }
      if (!takenSeatIds.includes(seat.id)) {
        setSelectedSeats([...selectedSeats, seat]);
      }
    }
  };

  const confirmSeats = () => {
    if (selectedSeats.length === 0) {
      Alert.alert("No Seats Selected", "Please select at least one seat.");
      return;
    }

    router.push({
      pathname: '/pages/purchaseticket',
      params: {
        movieId,
        locationId,
        theaterId,
        showtime,
        seatIds: selectedSeats.map(seat => seat.id).join(','),
      },
    });
  };

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

  const renderSeatGrid = () => {
    const grouped: { [row: string]: Seat[] } = {};
    seats.forEach(seat => {
      if (!grouped[seat.row]) grouped[seat.row] = [];
      grouped[seat.row].push(seat);
    });

    return (
      <View style={styles.seatGrid}>
        {Object.keys(grouped).sort().map(row => (
          <View key={row} style={styles.seatRow}>
            {grouped[row].sort((a, b) => a.column - b.column).map(seat => {
              const isSelected = selectedSeats.some(s => s.id === seat.id);
              const isTaken = takenSeatIds.includes(seat.id);

              return (
                <TouchableOpacity
                  key={seat.id}
                  style={[
                    styles.seat,
                    isSelected && styles.selectedSeat,
                    isTaken && styles.reservedSeat
                  ]}
                  onPress={() => toggleSeat(seat)}
                  disabled={isTaken}
                >
                  <Text style={styles.seatText}>
                    {rowToLetter(seat.row)}{seat.column}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10b981" />
        <Text style={styles.loadingText}>Loading seats...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Seat Selection', headerStyle: { backgroundColor: '#000' }, headerTintColor: '#fff' }} />
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
          <Text style={styles.title}>{movieTitle || 'Loading Movie...'}</Text>
          <Text style={styles.subtitle}>
            Showtime: {showtime ? new Date(showtime).toLocaleString('en-US', { month: 'long', day: 'numeric', hour: 'numeric', minute: '2-digit' }) : 'N/A'}
          </Text>

          {/* Seat Legend */}
          <View style={styles.legend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendIcon, styles.availableIcon]} />
              <Text style={styles.legendText}>Available</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendIcon, styles.selectedIcon]} />
              <Text style={styles.legendText}>Selected</Text>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendIcon, styles.reservedIcon]} />
              <Text style={styles.legendText}>Unavailable</Text>
            </View>
          </View>

          {/* Screen Indicator */}
          <View style={styles.screenIndicator}>
            <Text style={styles.screenText}>SCREEN</Text>
          </View>

          {/* Seat Grid */}
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {renderSeatGrid()}
          </ScrollView>

          {/* Selection Summary */}
          <View style={styles.summary}>
            <Text style={styles.summaryText}>
              Selected Seats: {selectedSeats.map(seat => `${rowToLetter(seat.row)}${seat.column}`).join(', ') || 'None'}
            </Text>
            <Text style={styles.summaryPrice}>
              Total: ${(selectedSeats.length * 12.99).toFixed(2)}
            </Text>
          </View>

          <TouchableOpacity
            style={[styles.confirmButton, selectedSeats.length === 0 && styles.disabledButton]}
            onPress={confirmSeats}
            disabled={selectedSeats.length === 0}
          >
            <Text style={styles.confirmButtonText}>Confirm Seats</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#1a1a1a' },
  scrollView: { flex: 1 },
  content: { padding: 16, alignItems: 'center' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1a1a1a' },
  loadingText: { color: '#fff', marginTop: 12 },
  title: { fontSize: 24, color: '#fff', fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
  subtitle: { fontSize: 16, color: '#ccc', marginBottom: 20, textAlign: 'center' },
  legend: { flexDirection: 'row', justifyContent: 'center', marginBottom: 24, gap: 16 },
  legendItem: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  legendIcon: { width: 16, height: 16, borderRadius: 4 },
  availableIcon: { backgroundColor: '#10b981' },
  selectedIcon: { backgroundColor: '#3b82f6' },
  reservedIcon: { backgroundColor: '#4b5563' },
  legendText: { color: '#ffffff', fontSize: 14 },
  screenIndicator: { width: '80%', height: 30, backgroundColor: '#333', borderRadius: 4, justifyContent: 'center', alignItems: 'center', marginBottom: 40 },
  screenText: { color: '#ffffff', fontSize: 12, fontWeight: 'bold' },
  seatGrid: { gap: 8, marginBottom: 24 },
  seatRow: { flexDirection: 'row', gap: 6, justifyContent: 'center' },
  seat: { width: SEAT_SIZE, height: SEAT_SIZE, backgroundColor: '#10b981', borderRadius: 4, justifyContent: 'center', alignItems: 'center', margin: 2 },
  reservedSeat: { backgroundColor: '#4b5563' },
  selectedSeat: { backgroundColor: '#3b82f6' },
  seatText: { color: '#fff', fontSize: SEAT_SIZE > 24 ? 12 : 9, fontWeight: 'bold' },
  summary: { width: '100%', marginTop: 20, marginBottom: 20 },
  summaryText: { color: '#fff', fontSize: 16, textAlign: 'center', marginBottom: 8 },
  summaryPrice: { color: '#fff', fontSize: 18, fontWeight: 'bold', textAlign: 'center' },
  confirmButton: { backgroundColor: '#ef4444', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8, marginTop: 20, width: '100%', alignItems: 'center' },
  disabledButton: { backgroundColor: '#9ca3af' },
  confirmButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
});

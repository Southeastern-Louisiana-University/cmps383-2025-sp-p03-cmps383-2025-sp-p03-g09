import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  ScrollView,
  Alert,
  Dimensions
} from 'react-native';
import { Stack, useLocalSearchParams, router } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';

interface Seat {
  id: string;
  row: string;
  number: number;
  isAvailable: boolean;
  isSelected: boolean;
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const SEAT_SIZE = Math.min(32, (SCREEN_WIDTH - 80) / 13); // Ensure seats fit screen width

export default function SeatSelectionScreen() {
  const params = useLocalSearchParams();
  const { movieId, showtimeId } = params;
  
  const [seats, setSeats] = useState<Seat[]>([]);
  const [selectedSeats, setSelectedSeats] = useState<Seat[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Generate seat grid data
  useEffect(() => {
    generateSeatGrid();
  }, []);

  const generateSeatGrid = () => {
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    const seatsPerRow = 13;
    const generatedSeats: Seat[] = [];

    rows.forEach(row => {
      for (let seatNum = 1; seatNum <= seatsPerRow; seatNum++) {
        const id = `${row}${seatNum}`;
        // Randomly make some seats unavailable to simulate already booked seats
        // In a real app, this would come from your API
        const isAvailable = Math.random() > 0.1; // 10% chance a seat is unavailable
        
        generatedSeats.push({
          id,
          row,
          number: seatNum,
          isAvailable,
          isSelected: false
        });
      }
    });

    setSeats(generatedSeats);
    setLoading(false);
  };

  const handleSeatClick = (clickedSeat: Seat) => {
    if (!clickedSeat.isAvailable) return;

    const updatedSeats = seats.map(seat => {
      if (seat.id === clickedSeat.id) {
        return { ...seat, isSelected: !seat.isSelected };
      }
      return seat;
    });

    setSeats(updatedSeats);

    // Update selected seats list
    const newSelectedSeats = updatedSeats.filter(seat => seat.isSelected);
    setSelectedSeats(newSelectedSeats);
  };

  const confirmSelection = () => {
    if (selectedSeats.length === 0) {
      Alert.alert('No Seats Selected', 'Please select at least one seat.');
      return;
    }

    // In a real app, you would send this to your API
    console.log('Selected seats:', selectedSeats);
    
    // Navigate to checkout page with selected seats
    router.push({
      pathname: '/tickets',
      params: {
        movieId: movieId,
        showtimeId: showtimeId,
        seats: selectedSeats.map(s => s.id).join(',')
      }
    });
  };

  const renderSeatGrid = () => {
    const rowGroups: { [key: string]: Seat[] } = {};
    
    // Group seats by row
    seats.forEach(seat => {
      if (!rowGroups[seat.row]) {
        rowGroups[seat.row] = [];
      }
      rowGroups[seat.row].push(seat);
    });

    return (
      <View style={styles.seatGrid}>
        {Object.keys(rowGroups).map(rowKey => (
          <View key={rowKey} style={styles.seatRow}>
            {rowGroups[rowKey].map(seat => (
              <TouchableOpacity
                key={seat.id}
                style={[
                  styles.seat,
                  !seat.isAvailable && styles.unavailableSeat,
                  seat.isSelected && styles.selectedSeat
                ]}
                onPress={() => handleSeatClick(seat)}
                disabled={!seat.isAvailable}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.seatText,
                  !seat.isAvailable && styles.unavailableSeatText
                ]}>
                  {seat.id}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10b981" />
        <Text style={styles.loadingText}>Loading seat map...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Seat Selection',
          headerStyle: { backgroundColor: '#000000' },
          headerTintColor: '#ffffff',
        }}
      />
      
      <ScrollView style={styles.scrollView}>
        <View style={styles.contentContainer}>
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
              <View style={[styles.legendIcon, styles.unavailableIcon]} />
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
              Selected Seats: {selectedSeats.map(seat => seat.id).join(', ')}
            </Text>
            <Text style={styles.summaryPrice}>
              Total: ${(selectedSeats.length * 12.99).toFixed(2)}
            </Text>
          </View>
          
          {/* Confirm Button */}
          <TouchableOpacity
            style={[
              styles.confirmButton,
              selectedSeats.length === 0 && styles.disabledButton
            ]}
            onPress={confirmSelection}
            disabled={selectedSeats.length === 0}
          >
            <Text style={styles.confirmButtonText}>
              Confirm Seats & Continue
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  scrollView: {
    flex: 1,
  },
  contentContainer: {
    padding: 16,
    alignItems: 'center',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
  },
  loadingText: {
    color: '#ffffff',
    marginTop: 12,
    fontSize: 16,
  },
  legend: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 24,
    gap: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendIcon: {
    width: 16,
    height: 16,
    borderRadius: 4,
  },
  availableIcon: {
    backgroundColor: '#10b981',
  },
  selectedIcon: {
    backgroundColor: '#3b82f6',
  },
  unavailableIcon: {
    backgroundColor: '#4b5563',
  },
  legendText: {
    color: '#ffffff',
    fontSize: 14,
  },
  screenIndicator: {
    width: '80%',
    height: 30,
    backgroundColor: '#333333',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 40,
  },
  screenText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  seatGrid: {
    gap: 8,
    marginBottom: 24,
  },
  seatRow: {
    flexDirection: 'row',
    gap: 6,
  },
  seat: {
    width: SEAT_SIZE,
    height: SEAT_SIZE,
    backgroundColor: '#10b981',
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 2,
  },
  selectedSeat: {
    backgroundColor: '#3b82f6',
  },
  unavailableSeat: {
    backgroundColor: '#4b5563',
  },
  seatText: {
    color: '#ffffff',
    fontSize: SEAT_SIZE > 24 ? 12 : 9,
    fontWeight: 'bold',
  },
  unavailableSeatText: {
    color: '#9ca3af',
  },
  summary: {
    width: '100%',
    marginTop: 20,
    marginBottom: 20,
  },
  summaryText: {
    color: '#ffffff',
    fontSize: 16,
    marginBottom: 8,
    textAlign: 'center',
  },
  summaryPrice: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  confirmButton: {
    backgroundColor: '#ef4444',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginTop: 20,
    width: '100%',
    alignItems: 'center',
  },
  disabledButton: {
    backgroundColor: '#9ca3af',
  },
  confirmButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
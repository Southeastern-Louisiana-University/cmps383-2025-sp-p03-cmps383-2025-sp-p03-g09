// tickets.tsx - This will be your tickets tab screen
import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { router } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { IconSymbol } from '@/components/ui/IconSymbol';

// Ticket data type
interface Ticket {
  id: string;
  movieTitle: string;
  date: string;
  time: string;
  seats: string[];
  confirmationCode: string;
}

// Sample data - replace with your API call or local storage retrieval
const SAMPLE_TICKETS: Ticket[] = [
  {
    id: '1',
    movieTitle: 'Interstellar',
    date: '2025-03-25',
    time: '7:30 PM',
    seats: ['D4', 'D5'],
    confirmationCode: 'INT78945'
  },
  {
    id: '2',
    movieTitle: 'The Dark Knight',
    date: '2025-04-02',
    time: '8:45 PM',
    seats: ['F7', 'F8', 'F9'],
    confirmationCode: 'DKN12456'
  },
  // Add more tickets as needed
];

export default function TicketsScreen() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // In a real app, fetch from an API or local storage
    // For now, use sample data
    setTimeout(() => {
      setTickets(SAMPLE_TICKETS);
      setLoading(false);
    }, 1000); // Simulate loading delay
  }, []);

  const renderTicket = ({ item }: { item: Ticket }) => {
    // Format date nicely
    const date = new Date(item.date);
    const formattedDate = date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });

    return (
      <TouchableOpacity
        style={styles.ticketCard}>
        <ThemedView style={styles.ticketHeader}>
          <ThemedText type="defaultSemiBold" numberOfLines={1} style={styles.movieTitle}>
            {item.movieTitle}
          </ThemedText>
          <IconSymbol name="ticket" size={24} color="#A1CEDC" />
        </ThemedView>

        <ThemedView style={styles.ticketDetails}>
          <ThemedView style={styles.detailRow}>
            <ThemedText style={styles.detailLabel}>Date:</ThemedText>
            <ThemedText style={styles.detailValue}>{formattedDate}</ThemedText>
          </ThemedView>

          <ThemedView style={styles.detailRow}>
            <ThemedText style={styles.detailLabel}>Time:</ThemedText>
            <ThemedText style={styles.detailValue}>{item.time}</ThemedText>
          </ThemedView>

          <ThemedView style={styles.detailRow}>
            <ThemedText style={styles.detailLabel}>Seats:</ThemedText>
            <ThemedText style={styles.detailValue}>{item.seats.join(', ')}</ThemedText>
          </ThemedView>

          <ThemedView style={styles.confirmationRow}>
            <ThemedText style={styles.confirmationLabel}>Confirmation:</ThemedText>
            <ThemedText type="defaultSemiBold" style={styles.confirmationCode}>
              {item.confirmationCode}
            </ThemedText>
          </ThemedView>
        </ThemedView>
      </TouchableOpacity>
    );
  };

  return (
    <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <ThemedText type="title" style={styles.headerTitle}>My Tickets</ThemedText>
      }>
      <ThemedView style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#0000ff" />
        ) : tickets.length > 0 ? (
          <FlatList
            data={tickets}
            renderItem={renderTicket}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.ticketList}
          />
        ) : (
          <ThemedView style={styles.emptyContainer}>
            <IconSymbol name="ticket" size={64} color="#ccc" />
            <ThemedText type="subtitle" style={styles.emptyText}>
              No tickets yet
            </ThemedText>
            <TouchableOpacity 
              style={styles.browseButton}
              onPress={() => router.push('/movies')}
            >
              <ThemedText style={styles.browseButtonText}>Browse Movies</ThemedText>
            </TouchableOpacity>
          </ThemedView>
        )}
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  headerTitle: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    fontSize: 28,
  },
  ticketList: {
    padding: 4,
  },
  ticketCard: {
    marginBottom: 16,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 12,
    backgroundColor: '#000000',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  movieTitle: {
    flex: 1,
    fontSize: 16,
  },
  ticketDetails: {
    padding: 16,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  detailLabel: {
    width: 60,
    color: '#666',
  },
  detailValue: {
    flex: 1,
  },
  confirmationRow: {
    flexDirection: 'row',
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  confirmationLabel: {
    width: 100,
    color: '#666',
  },
  confirmationCode: {
    flex: 1,
    color: '#A1CEDC',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    marginTop: 16,
    marginBottom: 24,
    color: '#888',
  },
  browseButton: {
    backgroundColor: '#A1CEDC',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  browseButtonText: {
    fontWeight: 'bold',
    color: '#fff',
  },
});
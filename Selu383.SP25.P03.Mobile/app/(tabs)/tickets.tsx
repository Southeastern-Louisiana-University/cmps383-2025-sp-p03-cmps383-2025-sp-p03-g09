import React, { useState, useEffect } from 'react';
import { StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, View, Platform } from 'react-native';
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
    setTimeout(() => {
      setTickets(SAMPLE_TICKETS);
      setLoading(false);
    }, 1000); 
  }, []);

  const renderTicket = ({ item }: { item: Ticket }) => {
    const date = new Date(item.date);
    const formattedDate = date.toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric'
    });

    return (
      <TouchableOpacity style={styles.ticketCard}>
        <ThemedView style={styles.ticketHeader}>
          <ThemedText type="defaultSemiBold" numberOfLines={1} style={styles.movieTitle}>
            {item.movieTitle}
          </ThemedText>
          <IconSymbol name="ticket" size={24} color="#10b981" />
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

          <View style={styles.divider} />
          
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
      headerBackgroundColor={{ light: '#10b981', dark: '#10b981' }}
      headerImage={
        <ThemedText type="title" style={styles.headerTitle}>My Tickets</ThemedText>
      }>
      <ThemedView style={styles.container}>
        {loading ? (
          <ActivityIndicator size="large" color="#10b981" />
        ) : tickets.length > 0 ? (
          <FlatList
            data={tickets}
            renderItem={renderTicket}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.ticketList}
          />
        ) : (
          <ThemedView style={styles.emptyContainer}>
            <IconSymbol name="ticket" size={64} color="#10b981" />
            <ThemedText type="subtitle" style={styles.emptyText}>
              No tickets yet
            </ThemedText>
            <TouchableOpacity 
              style={styles.browseButton}
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
    backgroundColor: '#121212',
  },
  headerTitle: {
    position: 'absolute',
    bottom: 150,
    left: 20,
    fontSize: 30,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  ticketList: {
    padding: 4,
  },
  ticketCard: {
    marginBottom: 24,
    borderRadius: 12,
    overflow: 'hidden',
    backgroundColor: '#10b981',
    borderWidth: 1,
    borderColor: '#10b981', 
  },
  ticketHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#10b981', 
  },
  movieTitle: {
    flex: 1,
    fontSize: 18,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  ticketDetails: {
    padding: 16,
  },
  detailRow: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  detailLabel: {
    width: 120,
    color: '#888',
    fontSize: 16,
  },
  detailValue: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: 'rgba(16, 185, 129, 0.3)', 
    marginVertical: 12,
  },
  confirmationRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  confirmationLabel: {
    width: 120,
    color: '#888',
    fontSize: 16,
  },
  confirmationCode: {
    flex: 1,
    color: '#10b981', 
    fontSize: 16,
    fontFamily: Platform.OS === 'ios' ? 'Courier' : 'monospace',
    letterSpacing: 1,
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
    backgroundColor: '#10b981', 
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  browseButtonText: {
    fontWeight: 'bold',
    color: '#fff',
  },
});
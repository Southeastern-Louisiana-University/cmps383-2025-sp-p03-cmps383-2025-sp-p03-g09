// app/(tabs)/index.tsx
import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity, FlatList, ActivityIndicator, Modal } from 'react-native';
import { router } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';

// Define types for our data
interface Movie {
  id: string;
  title: string;
  posterUrl: string;
  description: string;
  duration: number;
  rating: string;
  releaseDate?: string;
  youtubeUrl?: string;
  showtimes?: Showtime[];
}

interface Showtime {
  id: number;
  time: string;
  date: string;
  theater: string;
  availableSeats: number;
}

interface Location {
  id: number;
  name: string;
  address: string;
}

export default function HomeScreen() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [showLocationModal, setShowLocationModal] = useState(false);

  useEffect(() => {
    // Show location modal by default
    setShowLocationModal(true);

    const fetchData = async () => {
      setTimeout(() => {
        // Mock locations data
        const locationsData = [
          { id: 1, name: "Lion's Den New York", address: "570 2nd Ave, New York, NY 10016" },
          { id: 2, name: "Lion's Den New Orleans", address: '636 N Broad St, New Orleans, LA 70119' },
          { id: 3, name: "Lion's Den Los Angeles", address: '4020 Marlton Ave, Los Angeles, CA 90008' }
        ];
        
        const moviesData = [
          {
            id: '1',
            title: 'Captain America: Brave New World',
            posterUrl: 'https://i.imgur.com/kpvUnbB.jpeg',
            description: 'A thief who steals corporate secrets through dream-sharing technology. After meeting with newly elected U.S. President Thaddeus Ross, Sam finds himself in the middle of an international incident...',
            duration: 119,
            rating: 'PG-13',
            releaseDate: '2025-02-14',
            youtubeUrl: 'https://www.youtube.com/watch?v=5PSzFLV-EyQ',
            showtimes: [
              { id: 1, time: '12:00PM', date: '2025-04-09', theater: 'Theater 1', availableSeats: 120 },
              { id: 2, time: '3:00PM', date: '2025-04-09', theater: 'Theater 1', availableSeats: 110 },
              { id: 3, time: '6:00PM', date: '2025-04-09', theater: 'Theater 2', availableSeats: 90 },
              { id: 4, time: '9:00PM', date: '2025-04-09', theater: 'Theater 3', availableSeats: 150 }
            ]
          },
          {
            id: '2',
            title: 'Novocaine',
            posterUrl: 'https://i.imgur.com/lvhe19y.jpeg',
            description: 'When the girl of his dreams is kidnapped, everyman Nate turns his inability to feel pain into an unexpected strength in his fight to get her back.',
            duration: 109,
            rating: 'R',
            releaseDate: '2025-03-14',
            youtubeUrl: 'https://www.youtube.com/watch?v=99BLnkAlC1M',
            showtimes: [
              { id: 5, time: '1:00PM', date: '2025-04-09', theater: 'Theater 4', availableSeats: 130 },
              { id: 6, time: '4:00PM', date: '2025-04-09', theater: 'Theater 5', availableSeats: 120 },
              { id: 7, time: '7:00PM', date: '2025-04-09', theater: 'Theater 1', availableSeats: 100 },
              { id: 8, time: '10:00PM', date: '2025-04-09', theater: 'Theater 2', availableSeats: 85 }
            ]
          },
          {
            id: '3',
            title: 'Snow White',
            posterUrl: 'https://i.imgur.com/xCNOH4U.jpeg',
            description: 'Princess Snow White flees the castle when the Evil Queen, in her jealousy over Snow White\'s inner beauty, tries to kill her...',
            duration: 109,
            rating: 'PG',
            releaseDate: '2025-03-21',
            youtubeUrl: 'https://www.youtube.com/watch?v=KsSoo5K8CpA',
            showtimes: [
              { id: 9, time: '12:30PM', date: '2025-04-09', theater: 'Theater 3', availableSeats: 140 },
              { id: 10, time: '3:30PM', date: '2025-04-09', theater: 'Theater 4', availableSeats: 125 },
              { id: 11, time: '6:30PM', date: '2025-04-09', theater: 'Theater 5', availableSeats: 110 },
              { id: 12, time: '9:30PM', date: '2025-04-09', theater: 'Theater 1', availableSeats: 95 }
            ]
          }
        ];
        
        setLocations(locationsData);
        setMovies(moviesData);
        setLoading(false);
      }, 1000);
    };

    fetchData();
  }, []);

  const selectLocation = (location: Location) => {
    setSelectedLocation(location);
    setShowLocationModal(false);
  };

  // Movie Card Rendering
  const renderMovieCard = ({ item }: { item: Movie }) => (
    <TouchableOpacity style={styles.movieCard} onPress={() => router.push(`/movie/${item.id}`)}>
      <Image 
        source={{ uri: item.posterUrl }} 
        style={styles.moviePoster}
        defaultSource={require('@/assets/images/partial-react-logo.png')} // Placeholder
      />
      <View style={styles.movieDetails}>
        <Text style={styles.movieTitle} numberOfLines={1}>{item.title}</Text>
        <Text style={styles.movieInfo}>{item.duration} mins • {item.rating}</Text>
        <Text style={styles.movieDescription} numberOfLines={2}>{item.description}</Text>
        <Text style={styles.showtimesLabel}>Select showtime:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.showtimesList}>
          {["12:00PM", "3:00PM", "6:00PM", "9:00PM"].map((time) => (
            <TouchableOpacity
              key={time}
              style={styles.showtimeButton}
              onPress={() => {
                // Simple and direct navigation with logging
                const route = `/movie/${item.id}/purchase?showtime=${time}`;
                console.log('Navigating to:', route);
              }}
            >
              <Text style={styles.showtimeText}>{time}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </TouchableOpacity>
  );

  // Hero Section with Lion's Den Cinema Welcome
  const HeroSection = () => (
    <View style={styles.heroSection}>
      <ThemedText style={styles.heroTitle}>Welcome to Lion's Den Cinema!</ThemedText>
    </View>
  );

  // Location Modal
  const LocationModal = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={showLocationModal}
      onRequestClose={() => setShowLocationModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Choose The Location You Will Be Visiting:</Text>
          {locations.map((location) => (
            <TouchableOpacity
              key={location.id}
              style={styles.locationButton}
              onPress={() => selectLocation(location)}
            >
              <Text style={styles.locationButtonText}>{location.name}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </Modal>
  );

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10b981" />
        <Text style={styles.loadingText}>Loading movies...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LocationModal />
      
      {/* Theater Selection */}
      <TouchableOpacity 
        style={styles.theaterSelector}
        onPress={() => setShowLocationModal(true)}
      >
        <IconSymbol name="location.fill" size={16} color="#10b981" />
        <Text style={styles.theaterText} numberOfLines={1}>
          {selectedLocation ? selectedLocation.name : 'Select Theater'}
        </Text>
        <IconSymbol name="checkmark" size={16} color="#10b981" />
      </TouchableOpacity>
      
      <ScrollView style={styles.scrollView}>
        {/* Hero Section */}
        <HeroSection />
        
        {/* Featured Movies Section */}
        <View style={styles.moviesSection}>
          <ThemedText type="subtitle" style={styles.sectionTitle}>Featured Movies</ThemedText>
          <View style={styles.featuredMoviesContainer}>
            {movies.map((movie) => (
              <View key={movie.id} style={styles.featuredMovieWrapper}>
                {renderMovieCard({ item: movie })}
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  scrollView: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
  },
  loadingText: {
    color: '#ffffff',
    marginTop: 12,
  },
  theaterSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    position: 'absolute',
    top: 50,
    right: 16,
    zIndex: 10,
    maxWidth: 180,
  },
  theaterText: {
    marginHorizontal: 6,
    color: '#333',
    fontSize: 14,
    fontWeight: '500',
  },
  // Hero Section
  heroSection: {
    height: 150, // Reduced height
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginTop: 80, // Reduced margin
  },
  heroTitle: {
    fontSize: 28, // Reduced font size
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  // Movies Section
  moviesSection: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  featuredMoviesContainer: {
    gap: 16, // Space between movie cards
  },
  featuredMovieWrapper: {
    marginBottom: 16,
  },
  movieCard: {
    backgroundColor: '#1e1e1e',
    borderRadius: 8,
    overflow: 'hidden',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  moviePoster: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  movieDetails: {
    padding: 12,
  },
  movieTitle: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 18,
    marginBottom: 4,
  },
  movieInfo: {
    color: '#888',
    fontSize: 14,
    marginBottom: 8,
  },
  movieDescription: {
    color: '#ccc',
    marginBottom: 12,
    fontSize: 14,
  },
  showtimesLabel: {
    color: '#FFFFFF',
    fontWeight: '500',
    marginBottom: 8,
  },
  showtimesList: {
    flexGrow: 0,
  },
  showtimeButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  showtimeText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 12,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#1e1e1e',
    borderRadius: 10,
    padding: 20,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  locationButton: {
    backgroundColor: '#10b981',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginBottom: 10,
  },
  locationButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
});
import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Modal,
  Dimensions,
  RefreshControl,
} from 'react-native';
import { router } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import AsyncStorage from '@react-native-async-storage/async-storage';


interface Movie {
  id: number;
  title: string;
  posterUrl: string;
  description: string;
  duration: number;
  rating: string;
  releaseDate?: string;
}

interface Location {
  id: number;
  name: string;
  address: string;
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const POSTER_WIDTH = SCREEN_WIDTH * 0.42;
const POSTER_HEIGHT = POSTER_WIDTH * 1.5;

export default function HomeScreen() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [showLocationModal, setShowLocationModal] = useState(false);

  useEffect(() => {
    fetchMovies();
    loadLocations();
  }, []);

  const fetchMovies = async () => {
    try {
      setLoading(true);

      const res = await fetch('/api/movies');
      if (!res.ok) throw new Error('Failed to fetch movies');
      const data = await res.json();

      const today = new Date();
      const nowShowing = data.filter((movie: Movie) =>
        movie.releaseDate ? new Date(movie.releaseDate) <= today : false
      );

      setMovies(nowShowing);
    } catch (err) {
      console.error('Error loading movies:', err);
    } finally {
      setLoading(false);
    }
  };

  const loadLocations = async () => {
    try {
      const locData = [
        { id: 1, name: "Lion's Den New York", address: "570 2nd Ave, New York, NY 10016" },
        { id: 2, name: "Lion's Den New Orleans", address: "636 N Broad St, New Orleans, LA 70119" },
        { id: 3, name: "Lion's Den Los Angeles", address: "4020 Marlton Ave, Los Angeles, CA 90008" },
      ];
      setLocations(locData);

      const stored = await AsyncStorage.getItem("selectedLocation");
      if (stored) {
        const parsed = JSON.parse(stored);
        const valid = locData.find((loc: Location) => loc.id === parsed.id);
        if (valid) {
          setSelectedLocation(valid);
          setShowLocationModal(false);
        } else {
          await AsyncStorage.removeItem("selectedLocation");
          setShowLocationModal(true);
        }
      } else {
        setShowLocationModal(true);
      }
    } catch (err) {
      console.error('Error loading locations:', err);
      setShowLocationModal(true);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchMovies().finally(() => setRefreshing(false));
  };

  const selectLocation = async (location: Location) => {
    setSelectedLocation(location);
    setShowLocationModal(false);

    try {
      await AsyncStorage.setItem("selectedLocation", JSON.stringify(location));
    } catch (err) {
      console.error('Error saving location preference:', err);
    }
  };

  const navigateToMovie = (movieId: number) => {
    router.push(`/movie/${movieId}`);
  };

  const HeroSection = () => (
    <View style={styles.heroSection}>
      <ThemedText style={styles.heroTitle}>Welcome to Lion's Den Cinema</ThemedText>
    </View>
  );

  const LocationModal = () => (
    <Modal
      animationType="fade"
      transparent={true}
      visible={showLocationModal}
      onRequestClose={() => setShowLocationModal(false)}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Select Your Theater</Text>
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

  if (loading && !refreshing) {
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

      <ScrollView 
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl 
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor="#10b981"
            colors={["#10b981"]}
          />
        }
      >
        <HeroSection />

        <View style={styles.moviesSection}>
          <ThemedText style={styles.sectionTitle}>Featured Movies</ThemedText>

          <View style={styles.moviesGrid}>
            {movies.map((movie) => (
              <TouchableOpacity
                key={movie.id}
                style={styles.movieCard}
                onPress={() => navigateToMovie(movie.id)}
                activeOpacity={0.7}
              >
                <Image 
                  source={{ uri: movie.posterUrl }}
                  style={styles.moviePoster}
                  defaultSource={require('@/assets/images/partial-react-logo.png')}
                />
                <View style={styles.movieDetails}>
                  <Text style={styles.movieTitle} numberOfLines={1}>{movie.title}</Text>
                  <Text style={styles.movieInfo}>{movie.duration} mins • {movie.rating}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={{ height: 20 }} />
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
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    position: 'absolute',
    top: 50,
    right: 16,
    zIndex: 10,
    maxWidth: 180,
  },
  theaterText: {
    marginHorizontal: 6,
    color: '#fff',
    fontSize: 14,
    fontWeight: '500',
  },
  // Updated Hero Section with improved spacing and text handling
  heroSection: {
    paddingTop: 100, // Increased top padding to lower the header
    paddingBottom: 40,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  heroTitle: {
    fontSize: 32, // Slightly larger font size
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    flexWrap: 'wrap', // Ensures text wraps properly
    width: '100%', // Full width to avoid cutoff
    lineHeight: 40, // Improved line height for better readability
  },
  // Movies Section
  moviesSection: {
    marginBottom: 24,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 24,
    textAlign: 'center',
  },
  moviesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 16,
  },
  movieCard: {
    width: POSTER_WIDTH,
    marginBottom: 24,
  },
  moviePoster: {
    width: POSTER_WIDTH,
    height: POSTER_HEIGHT,
    borderRadius: 12,
  },
  movieDetails: {
    marginTop: 8,
    alignItems: 'center',
  },
  movieTitle: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
  movieInfo: {
    color: '#888',
    fontSize: 14,
    textAlign: 'center',
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#111111',
    borderRadius: 12,
    padding: 24,
    width: '80%',
    maxWidth: 400,
  },
  modalTitle: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  locationButton: {
    backgroundColor: '#10b981',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    marginBottom: 12,
  },
  locationButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  }
});
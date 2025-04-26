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
  RefreshControl
} from 'react-native';
import { router } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define types for our data
interface Movie {
  id: number;
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

// Hardcoded movie data
const moviesData: Movie[] = [
  {
    id: 1,
    title: "Captain America: Brave New World",
    duration: 119,
    rating: "PG-13",
    description: "A thief who steals corporate secrets through dream-sharing technology. After meeting with newly elected U.S. President Thaddeus Ross, Sam finds himself in the middle of an international incident...",
    releaseDate: "2025-02-14",
    posterUrl: "https://i.imgur.com/kpvUnbB.jpeg",
    youtubeUrl: "https://www.youtube.com/watch?v=5PSzFLV-EyQ"
  },
  {
    id: 2,
    title: "Novocaine",
    duration: 109,
    rating: "R",
    description: "When the girl of his dreams is kidnapped, everyman Nate turns his inability to feel pain into an unexpected strength in his fight to get her back.",
    releaseDate: "2025-03-14",
    posterUrl: "https://i.imgur.com/lvhe19y.jpeg",
    youtubeUrl: "https://www.youtube.com/watch?v=99BLnkAlC1M"
  },
  {
    id: 3,
    title: "Snow White",
    duration: 109,
    rating: "PG",
    description: "Princess Snow White flees the castle when the Evil Queen, in her jealousy over Snow White's inner beauty, tries to kill her...",
    releaseDate: "2025-03-21",
    posterUrl: "https://i.imgur.com/xCNOH4U.jpeg",
    youtubeUrl: "https://www.youtube.com/watch?v=KsSoo5K8CpA"
  },
  {
    id: 4,
    title: "A Minecraft Movie",
    duration: 100,
    rating: "PG",
    description: "Four misfits find themselves struggling with ordinary problems when they are suddenly pulled through a mysterious portal into the Overworld: a bizarre, cubic wonderland that thrives on imagination. To get back home, they'll have to master this world while embarking on a magical quest with an unexpected, expert crafter, Steve.",
    releaseDate: "2025-04-04",
    posterUrl: "https://i.imgur.com/CtiItHl.jpeg",
    youtubeUrl: "https://www.youtube.com/watch?v=8B1EtVPBSMw"
  },
  {
    id: 5,
    title: "The Amateur",
    duration: 123,
    rating: "PG-13",
    description: "After his life is turned upside down when his wife is killed in a London terrorist attack, a brilliant but introverted CIA decoder takes matters into his own hands when his supervisors refuse to take action.",
    releaseDate: "2025-04-11",
    posterUrl: "https://i.imgur.com/82JHVqU.jpeg",
    youtubeUrl: "https://www.youtube.com/watch?v=DCWcK4c-F8Q"
  },
  {
    id: 6,
    title: "A Working Man",
    duration: 116,
    rating: "R",
    description: "Levon Cade left behind a decorated military career in the black ops to live a simple life working construction. But when his boss's daughter, who is like family to him, is taken by human traffickers, his search to bring her home uncovers a world of corruption far greater than he ever could have imagined.",
    releaseDate: "2025-03-28",
    posterUrl: "https://i.imgur.com/oPNz3zp.jpeg",
    youtubeUrl: "https://www.youtube.com/watch?v=mdfrG2cLK58"
  },
  {
    id: 7,
    title: "The King of Kings",
    duration: 104,
    rating: "PG",
    description: "A father tells his son the greatest story ever told, and what begins as a bedtime tale becomes a life-changing journey. Through vivid imagination, the boy walks alongside Jesus, witnessing His miracles, facing His trials, and understanding His ultimate sacrifice. The King of Kings invites us to rediscover the enduring power of hope, love, and redemption through the eyes of a child.",
    releaseDate: "2025-04-11",
    posterUrl: "https://i.imgur.com/hvZ9Aql.jpeg",
    youtubeUrl: "https://www.youtube.com/watch?v=HkGZ4ykhYPg"
  },
  {
    id: 8,
    title: "Death of a Unicorn",
    duration: 107,
    rating: "R",
    description: "A father and daughter accidentally hit and kill a unicorn while en route to a weekend retreat, where his billionaire boss seeks to exploit the creature's miraculous curative properties.",
    releaseDate: "2025-03-28",
    posterUrl: "https://i.imgur.com/EYeLcGS.jpeg",
    youtubeUrl: "https://www.youtube.com/watch?v=aQOle3MHnGs"
  },
  {
    id: 9,
    title: "Sacramento",
    duration: 89,
    rating: "R",
    description: "When free-spirited Ricky suddenly reappears in father-to-be Glenn's life, the two former best friends embark on a spontaneous road trip from LA to Sacramento.",
    releaseDate: "2025-04-11",
    posterUrl: "https://i.imgur.com/6V0N9Rg.jpeg",
    youtubeUrl: "https://www.youtube.com/watch?v=jZRbFs_WhX0"
  },
  {
    id: 10,
    title: "The Friend",
    duration: 120,
    rating: "R",
    description: "Writer and teacher Iris finds her comfortable, solitary New York life thrown into disarray after her closest friend and mentor bequeaths her his beloved 150 lb. Great Dane named Apollo.",
    releaseDate: "2025-03-28",
    posterUrl: "https://i.imgur.com/HXDE59T.jpeg",
    youtubeUrl: "https://www.youtube.com/watch?v=K2Df2g0Gl6o"
  }
];

// Hardcoded location data
const locationsData: Location[] = [
  {
    id: 1,
    name: "Lion's Den New York",
    address: "570 2nd Ave, New York, NY 10016"
  },
  {
    id: 2,
    name: "Lion's Den New Orleans",
    address: "636 N Broad St, New Orleans, LA 70119"
  },
  {
    id: 3,
    name: "Lion's Den Los Angeles",
    address: "4020 Marlton Ave, Los Angeles, CA 90008"
  }
];

const SCREEN_WIDTH = Dimensions.get('window').width;
const POSTER_WIDTH = SCREEN_WIDTH * 0.42; // Slightly smaller to fit 2 per row
const POSTER_HEIGHT = POSTER_WIDTH * 1.5; // Standard movie poster ratio

export default function HomeScreen() {
  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);
  const [showLocationModal, setShowLocationModal] = useState(false);

  useEffect(() => {
    // Use hardcoded data instead of API calls
    setMovies(moviesData);
    setLocations(locationsData);
    
    // Check for stored location
    const checkStoredLocation = async () => {
      try {
        const stored = await AsyncStorage.getItem("selectedLocation");
        if (stored) {
          const parsed = JSON.parse(stored);
          const valid = locationsData.find((loc: Location) => loc.id === parsed.id);
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
        console.error(err);
        setShowLocationModal(true);
      } finally {
        setLoading(false);
      }
    };
    
    checkStoredLocation();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    // Simulate refresh by setting the same data again after a delay
    setTimeout(() => {
      setMovies([...moviesData]);
      setRefreshing(false);
    }, 1000);
  };

  const selectLocation = async (location: Location) => {
    setSelectedLocation(location);
    setShowLocationModal(false);
    
    // Store selection in AsyncStorage (equivalent to localStorage in web)
    try {
      await AsyncStorage.setItem("selectedLocation", JSON.stringify(location));
    } catch (err) {
      console.error('Error saving location preference:', err);
    }
  };

  // Navigate to movie details page
  const handleMoviePress = (movieId: number) => {
    // Navigate to the movie details screen
    router.push(`/movies/${movieId}`);
  };

  // Hero Section with Lion's Den Cinema Welcome
  const HeroSection = () => (
    <View style={styles.heroSection}>
      <ThemedText style={styles.heroTitle}>Welcome to Lion's Den Cinema</ThemedText>
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
      
      {/* Theater Selection Button */}
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
        {/* Hero Section */}
        <HeroSection />
        
        {/* Featured Movies Section */}
        <View style={styles.moviesSection}>
          <ThemedText style={styles.sectionTitle}>Featured Movies</ThemedText>
          
          <View style={styles.moviesGrid}>
            {movies.map((movie) => (
              <TouchableOpacity
                key={movie.id}
                style={styles.movieCard}
                onPress={() => handleMoviePress(movie.id)}
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
  // Hero Section
  heroSection: {
    paddingVertical: 80,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  heroTitle: {
    fontSize: 32,
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
  },
});
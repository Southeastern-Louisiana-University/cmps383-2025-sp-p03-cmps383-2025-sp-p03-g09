import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  StatusBar
} from 'react-native';
import { Stack, router } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';

// Define types for our data
interface Movie {
  id: number;
  title: string;
  posterUrl: string;
  description: string;
  duration: number;
  rating: string;
  releaseDate?: string;
  showtimes?: Showtime[];
}

interface Showtime {
  id: number;
  time: string;
  date: string;
  theater: string;
  availableSeats: number;
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const POSTER_WIDTH = 140; // Fixed width for movie poster
const POSTER_HEIGHT = POSTER_WIDTH * 1.5; // Standard movie poster ratio

// Hardcoded movie data
const nowShowingMovies: Movie[] = [
  {
    id: 1,
    title: "Captain America: Brave New World",
    duration: 119,
    rating: "PG-13",
    description: "A thief who steals corporate secrets through dream-sharing technology. After meeting with newly elected U.S. President Thaddeus Ross, Sam finds himself in the middle of an international incident...",
    releaseDate: "2025-02-14",
    posterUrl: "https://i.imgur.com/kpvUnbB.jpeg",
    showtimes: [
      { id: 1, time: "11:00 AM", date: "2025-04-26", theater: "Theater 1", availableSeats: 120 },
      { id: 2, time: "1:40 PM", date: "2025-04-26", theater: "Theater 2", availableSeats: 110 },
      { id: 3, time: "4:20 PM", date: "2025-04-26", theater: "Theater 1", availableSeats: 90 }
    ]
  },
  {
    id: 2,
    title: "Novocaine",
    duration: 109,
    rating: "R",
    description: "When the girl of his dreams is kidnapped, everyman Nate turns his inability to feel pain into an unexpected strength in his fight to get her back.",
    releaseDate: "2025-03-14",
    posterUrl: "https://i.imgur.com/lvhe19y.jpeg",
    showtimes: [
      { id: 4, time: "1:15 PM", date: "2025-04-26", theater: "Theater 4", availableSeats: 130 },
      { id: 5, time: "4:30 PM", date: "2025-04-26", theater: "Theater 2", availableSeats: 110 },
      { id: 6, time: "8:00 PM", date: "2025-04-26", theater: "Theater 1", availableSeats: 100 }
    ]
  },
  {
    id: 3,
    title: "Snow White",
    duration: 109,
    rating: "PG",
    description: "Princess Snow White flees the castle when the Evil Queen, in her jealousy over Snow White's inner beauty, tries to kill her...",
    releaseDate: "2025-03-21",
    posterUrl: "https://i.imgur.com/xCNOH4U.jpeg",
    showtimes: [
      { id: 7, time: "12:30 PM", date: "2025-04-26", theater: "Theater 3", availableSeats: 140 },
      { id: 8, time: "3:30 PM", date: "2025-04-26", theater: "Theater 1", availableSeats: 120 },
      { id: 9, time: "7:15 PM", date: "2025-04-26", theater: "Theater 4", availableSeats: 110 }
    ]
  },
  {
    id: 4,
    title: "A Minecraft Movie",
    duration: 100,
    rating: "PG",
    description: "Four misfits find themselves struggling with ordinary problems when they are suddenly pulled through a mysterious portal into the Overworld: a bizarre, cubic wonderland that thrives on imagination.",
    releaseDate: "2025-04-04",
    posterUrl: "https://i.imgur.com/CtiItHl.jpeg",
    showtimes: [
      { id: 10, time: "1:30 PM", date: "2025-04-26", theater: "Theater 2", availableSeats: 130 },
      { id: 11, time: "4:45 PM", date: "2025-04-26", theater: "Theater 3", availableSeats: 115 },
      { id: 12, time: "7:45 PM", date: "2025-04-26", theater: "Theater 4", availableSeats: 105 }
    ]
  }
];

const upcomingMovies: Movie[] = [
  {
    id: 101,
    title: "Thunderbolts*",
    duration: 127,
    rating: "PG-13",
    description: "After finding themselves ensnared in a death trap, seven disillusioned castoffs must embark on a dangerous mission that will force them to confront the darkest corners of their pasts.",
    releaseDate: "2025-05-02",
    posterUrl: "https://i.imgur.com/1NfJH2h.jpeg"
  },
  {
    id: 102,
    title: "The Surfer",
    duration: 100,
    rating: "R",
    description: "A man returns to the idyllic beach of his childhood to surf with his son. But his desire to hit the waves is thwarted by a group of locals whose mantra is 'don't live here, don't surf here.'",
    releaseDate: "2025-05-02",
    posterUrl: "https://i.imgur.com/UgsS6bZ.jpeg"
  },
  {
    id: 103,
    title: "Clown in a Cornfield",
    duration: 96,
    rating: "R",
    description: "Quinn and her father have just moved to the quiet town of Kettle Springs hoping for a fresh start. Instead, she discovers a fractured community that has fallen on hard times.",
    releaseDate: "2025-05-09",
    posterUrl: "https://i.imgur.com/U28yIHf.jpeg"
  }
];

export default function MoviesScreen() {
  const [activeTab, setActiveTab] = useState<'nowShowing' | 'upcoming'>('nowShowing');
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState<Movie[]>(nowShowingMovies);

  // Handle tab change
  useEffect(() => {
    // Simulate loading
    setLoading(true);
    
    setTimeout(() => {
      if (activeTab === 'nowShowing') {
        setMovies(nowShowingMovies);
      } else {
        setMovies(upcomingMovies);
      }
      setLoading(false);
    }, 300);
  }, [activeTab]);

  // Navigate to movie details and showtime selection
  const handleMoviePress = (movie: Movie) => {
    router.push(`/movie/${movie.id}`);
  };

  // Select a showtime
  const handleShowtimeSelect = (movieId: number, showtimeId: number) => {
    router.push(`/movie/${movieId}/seats?showtimeId=${showtimeId}`);
  };

  // Render movie card
  const renderMovieCard = (movie: Movie) => (
    <View key={movie.id} style={styles.movieCard}>
      <Image 
        source={{ uri: movie.posterUrl }}
        style={styles.moviePoster}
        defaultSource={require('@/assets/images/partial-react-logo.png')} // Placeholder
      />
      
      <View style={styles.movieInfo}>
        <Text style={styles.movieTitle}>{movie.title}</Text>
        
        <Text style={styles.movieMeta}>
          Runtime: {movie.duration} mins • Rating: {movie.rating}
        </Text>
        
        <Text style={styles.movieDescription} numberOfLines={2}>
          {movie.description}
        </Text>
        
        {movie.showtimes && activeTab === 'nowShowing' && (
          <>
            <Text style={styles.showtimeLabel}>Select showtime:</Text>
            <View style={styles.showtimesRow}>
              {movie.showtimes.map(showtime => (
                <TouchableOpacity
                  key={showtime.id}
                  style={styles.showtimeButton}
                  onPress={() => handleShowtimeSelect(movie.id, showtime.id)}
                >
                  <Text style={styles.showtimeText}>{showtime.time}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </>
        )}
        
        {activeTab === 'upcoming' && (
          <Text style={styles.releaseDateText}>
            Coming {movie.releaseDate ? new Date(movie.releaseDate).toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) : 'Soon'}
          </Text>
        )}
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      
      {/* Extra space to lower content */}
      <View style={styles.topSpacer} />
      
      {/* Tab Navigation */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'nowShowing' && styles.activeTabButton]}
          onPress={() => setActiveTab('nowShowing')}
        >
          <Text style={[styles.tabText, activeTab === 'nowShowing' && styles.activeTabText]}>
            Now Showing
          </Text>
        </TouchableOpacity>
        
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'upcoming' && styles.activeTabButton]}
          onPress={() => setActiveTab('upcoming')}
        >
          <Text style={[styles.tabText, activeTab === 'upcoming' && styles.activeTabText]}>
            Upcoming
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Underline for active tab */}
      <View style={styles.tabUnderlineContainer}>
        <View 
          style={[
            styles.tabUnderline, 
            { left: activeTab === 'nowShowing' ? 20 : 170 }
          ]} 
        />
      </View>
      
      {/* Movie List */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#10b981" />
        </View>
      ) : (
        <ScrollView style={styles.moviesContainer} showsVerticalScrollIndicator={false}>
          {movies.map(movie => renderMovieCard(movie))}
          <View style={styles.bottomSpace} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  topSpacer: {
    height: 60, // Add extra space at the top to lower content
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  tabButton: {
    paddingBottom: 10,
    marginRight: 50,
  },
  activeTabButton: {
    // No border here, using separate underline view
  },
  tabText: {
    color: '#777777',
    fontSize: 20,
    fontWeight: '600',
  },
  activeTabText: {
    color: '#10b981',
  },
  tabUnderlineContainer: {
    position: 'relative',
    height: 2,
    width: '100%',
  },
  tabUnderline: {
    position: 'absolute',
    width: 140,
    height: 2,
    backgroundColor: '#10b981',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  moviesContainer: {
    flex: 1,
    paddingHorizontal: 0, // Remove padding to match your screenshot
    marginTop: 20, // Add some space after the tabs
  },
  movieCard: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 16,
    marginHorizontal: 16,
  },
  moviePoster: {
    width: POSTER_WIDTH,
    height: POSTER_HEIGHT,
  },
  movieInfo: {
    flex: 1,
    padding: 12,
  },
  movieTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  movieMeta: {
    fontSize: 14,
    color: '#888888',
    marginBottom: 12,
  },
  movieDescription: {
    fontSize: 16,
    color: '#DDDDDD',
    lineHeight: 22,
    marginBottom: 16,
  },
  showtimeLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  showtimesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  showtimeButton: {
    backgroundColor: '#10b981',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  showtimeText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '500',
  },
  releaseDateText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#10b981',
    marginTop: 8,
  },
  bottomSpace: {
    height: 80, // Extra space at bottom for tab navigation
  },
});
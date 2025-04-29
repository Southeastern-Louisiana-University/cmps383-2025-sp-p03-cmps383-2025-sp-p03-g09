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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showtimeSchedule } from '@/Data/showtimeSchedule';
import { baseUrl } from '@/constants/constants';


interface Movie {
  id: number;
  title: string;
  posterUrl: string;
  description: string;
  duration: number;
  rating: string;
  releaseDate?: string;
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const POSTER_WIDTH = 140;
const POSTER_HEIGHT = POSTER_WIDTH * 1.5;

export default function MoviesScreen() {
  const [activeTab, setActiveTab] = useState<'nowShowing' | 'upcoming'>('nowShowing');
  const [loading, setLoading] = useState(false);
  const [movies, setMovies] = useState<Movie[]>([]);
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(null);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        setLoading(true);

        const loc = await AsyncStorage.getItem('selectedLocation');
        if (loc) {
          const parsed = JSON.parse(loc);
          setSelectedLocationId(parsed.id);
        }

        const res = await fetch(`${baseUrl}/api/movies`);
        if (!res.ok) throw new Error('Failed to fetch movies');
        const data = await res.json();

        const today = new Date();
        const nowShowing = data.filter((movie: Movie) =>
          movie.releaseDate ? new Date(movie.releaseDate) <= today : false
        );
        const upcoming = data.filter((movie: Movie) =>
          movie.releaseDate ? new Date(movie.releaseDate) > today : false
        );

        if (activeTab === 'nowShowing') {
          setMovies(nowShowing);
        } else {
          setMovies(upcoming);
        }
      } catch (err) {
        console.error('Error loading movies:', err);
      } finally {
        setLoading(false);
      }
    };

    loadMovies();
  }, [activeTab]);

  const renderMovieCard = (movie: Movie) => {
    const matchedShowtimes = selectedLocationId
      ? showtimeSchedule.filter(
          (entry) =>
            Number(entry.movieId) === Number(movie.id) &&
            Number(entry.locationId) === Number(selectedLocationId)
        )
      : [];

      return (
        <View key={movie.id}>
          <View style={styles.movieCard}>
            <Image 
              source={{ uri: movie.posterUrl }}
              style={styles.moviePoster}
              defaultSource={require('@/assets/images/partial-react-logo.png')}
            />
            
            <View style={styles.movieInfo}>
  <Text style={styles.movieTitle}>{movie.title}</Text>
  
  <Text style={styles.movieMeta}>
    Runtime: {movie.duration} mins • Rating: {movie.rating}
  </Text>

  {activeTab === 'upcoming' && movie.releaseDate && (
    <Text style={styles.releaseDateText}>
      Release Date: {new Date(movie.releaseDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })}
    </Text>
  )}
  
  <Text style={styles.movieDescription} numberOfLines={2}>
    {movie.description}
  </Text>
</View>

          </View>
      
          {activeTab === 'nowShowing' && matchedShowtimes.length > 0 && (
            <View style={styles.showtimesWrapper}>
              <Text style={styles.showtimeLabel}>Select Showtime:</Text>
              <View style={styles.showtimesRow}>
                {matchedShowtimes.map((entry) => (
                  <TouchableOpacity
                    key={`${entry.movieId}-${entry.locationId}-${entry.theaterId}-${entry.time}`}
                    style={styles.showtimeButton}
                    onPress={() =>
                      router.push({
                        pathname: '/seating',
                        params: {
                          movieId: entry.movieId.toString(),
                          showtime: entry.time,
                          locationId: entry.locationId.toString(),
                          theaterId: entry.theaterId.toString(),
                        },
                      })
                    }
                  >
                    <Text style={styles.showtimeText}>
                      {new Date(entry.time).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          )}
        </View>
      );
      
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <View style={styles.topSpacer} />
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
      <View style={styles.tabUnderlineContainer}>
        <View 
          style={[
            styles.tabUnderline, 
            { left: activeTab === 'nowShowing' ? 20 : 170 }
          ]} 
        />
      </View>

      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#10b981" />
        </View>
      ) : (
        <ScrollView style={styles.moviesContainer} showsVerticalScrollIndicator={false}>
          {movies.map(renderMovieCard)}
          <View style={styles.bottomSpace} />
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000000' },
  topSpacer: { height: 60 },
  tabContainer: { flexDirection: 'row', paddingHorizontal: 20, paddingVertical: 15 },
  tabButton: { paddingBottom: 10, marginRight: 50 },
  activeTabButton: {},
  tabText: { color: '#777777', fontSize: 20, fontWeight: '600' },
  activeTabText: { color: '#10b981' },
  tabUnderlineContainer: { position: 'relative', height: 2, width: '100%' },
  tabUnderline: { position: 'absolute', width: 140, height: 2, backgroundColor: '#10b981' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  moviesContainer: { flex: 1, paddingHorizontal: 0, marginTop: 20 },
  movieCard: { flexDirection: 'row', backgroundColor: '#1a1a1a', borderRadius: 8, overflow: 'hidden', marginBottom: 16, marginHorizontal: 16 },
  moviePoster: { width: POSTER_WIDTH, height: POSTER_HEIGHT },
  movieInfo: { flex: 1, padding: 12 },
  movieTitle: { fontSize: 22, fontWeight: 'bold', color: '#FFFFFF', marginBottom: 8 },
  movieMeta: { fontSize: 14, color: '#888888', marginBottom: 12 },
  movieDescription: { fontSize: 16, color: '#DDDDDD', lineHeight: 22, marginBottom: 16 },
  showtimeLabel: { fontSize: 16, fontWeight: '500', color: '#FFFFFF', marginBottom: 12 },
  showtimesRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  showtimeButton: {
    backgroundColor: '#10b981',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 6,
    marginRight: 8,
    marginBottom: 8,
    alignItems: 'center',
  },
    showtimeText: { color: 'white', fontSize: 16, fontWeight: '500' },
  releaseDateText: { fontSize: 16, fontWeight: '500', color: '#10b981', marginTop: 8 },
  bottomSpace: { height: 80 },
  showtimesWrapper: {
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 24,
  },
});

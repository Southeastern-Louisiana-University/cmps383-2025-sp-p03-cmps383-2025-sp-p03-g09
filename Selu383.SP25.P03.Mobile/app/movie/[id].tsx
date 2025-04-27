import React, { useEffect, useState, useLayoutEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
} from 'react-native';
import { useLocalSearchParams, router, useNavigation } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { showtimeSchedule } from '@/Data/showtimeSchedule';
import { WebView } from 'react-native-webview';

const BASE_URL = 'http://192.168.1.13:5249';

interface Movie {
  id: number;
  title: string;
  posterUrl: string;
  description: string;
  duration: number;
  rating: string;
  youtubeUrl?: string;
}

export default function MovieDetailPage() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const navigation = useNavigation();
  const [movie, setMovie] = useState<Movie | null>(null);
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadMovie = async () => {
      try {
        const res = await fetch(`${BASE_URL}/api/movies/${id}`);
        if (!res.ok) throw new Error('Failed to fetch movie.');
        const data = await res.json();
        setMovie(data);

        const loc = await AsyncStorage.getItem('selectedLocation');
        if (loc) {
          const parsed = JSON.parse(loc);
          setSelectedLocationId(parsed.id);
        }
      } catch (error) {
        console.error('Error loading movie details:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMovie();
  }, [id]);

  useLayoutEffect(() => {
    navigation.setOptions({ title: movie ? movie.title : 'Movie Details' });
  }, [navigation, movie]);

  const handleShowtimePress = (showtime: string, theaterId: number) => {
    router.push({
      pathname: '/seating',
      params: {
        movieId: movie?.id.toString(),
        locationId: selectedLocationId?.toString(),
        theaterId: theaterId.toString(),
        showtime: showtime,
      },
    });
  };

  const renderShowtimes = () => {
    if (!movie || selectedLocationId === null) return null;

    const showtimes = showtimeSchedule.filter(
      s => s.movieId === movie.id && s.locationId === selectedLocationId
    );

    if (showtimes.length === 0) {
      return <Text style={styles.noShowtimes}>No showtimes available.</Text>;
    }

    return (
      <View style={styles.showtimeGrid}>
        {showtimes.map((s, index) => (
          <TouchableOpacity
            key={index}
            style={styles.showtimeButton}
            onPress={() => handleShowtimePress(s.time, s.theaterId)}
          >
            <Text style={styles.showtimeButtonText}>
              {new Date(s.time).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10b981" />
      </View>
    );
  }

  if (!movie) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.errorText}>Movie not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: movie.posterUrl }} style={styles.poster} />
      <View style={styles.content}>
        <Text style={styles.title}>{movie.title}</Text>
        <Text style={styles.meta}>
          {movie.duration} min • {movie.rating}
        </Text>
        <Text style={styles.description}>{movie.description}</Text>

        <Text style={styles.sectionTitle}>Showtimes</Text>
        {renderShowtimes()}

        {movie.youtubeUrl && (
          <>
            <Text style={styles.sectionTitle}>Trailer</Text>
            <View style={styles.trailerContainer}>
              <WebView
                style={styles.webview}
                source={{ uri: movie.youtubeUrl }}
                allowsFullscreenVideo
              />
            </View>
          </>
        )}
      </View>
    </ScrollView>
  );
}

const SCREEN_WIDTH = Dimensions.get('window').width;
const POSTER_HEIGHT = SCREEN_WIDTH * 1.5;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#000' },
  errorText: { color: '#fff', fontSize: 18 },
  poster: { width: '100%', height: POSTER_HEIGHT },
  content: { padding: 16 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  meta: { fontSize: 16, color: '#ccc', marginBottom: 16 },
  description: { fontSize: 16, color: '#ddd', marginBottom: 24, lineHeight: 22 },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', color: '#10b981', marginBottom: 12 },
  showtimeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  showtimeButton: { backgroundColor: '#10b981', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 6, marginRight: 10, marginBottom: 10 },
  showtimeButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },
  noShowtimes: { color: '#ccc', fontSize: 16, marginBottom: 20 },
  trailerContainer: { height: 230, width: '100%', marginTop: 20 },
  webview: { flex: 1, borderRadius: 10, overflow: 'hidden' },
});
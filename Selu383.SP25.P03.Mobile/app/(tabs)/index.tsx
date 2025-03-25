import { Image, StyleSheet, Platform, FlatList, TouchableOpacity, View } from 'react-native';
import { router } from 'expo-router';
import ParallaxScrollView from '@/components/ParallaxScrollView';
import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { useState, useEffect } from 'react';

// Define types for our data
interface Movie {
  id: string;
  title: string;
  genre: string[];
  posterUrl: string;
  rating: string;
}

interface FeaturedMovie {
  id: string;
  title: string;
  posterUrl: string;
  backdropUrl: string;
  rating: string;
}

export default function HomeScreen() {
  // State for selected theater
  const [selectedTheater, setSelectedTheater] = useState<string>('Select Theater');
  
  // Sample data - in a real app, you would fetch this from an API
  const [featuredMovie, setFeaturedMovie] = useState<FeaturedMovie>({
    id: '1',
    title: 'Interstellar',
    posterUrl: 'https://example.com/interstellar-poster.jpg', // Replace with actual image
    backdropUrl: 'https://example.com/interstellar-backdrop.jpg', // Replace with actual image
    rating: 'PG-13'
  });
  
  const [nowPlaying, setNowPlaying] = useState<Movie[]>([
    {
      id: '1',
      title: 'Interstellar',
      genre: ['Sci-Fi', 'Drama'],
      posterUrl: 'https://example.com/interstellar.jpg', // Replace with actual image
      rating: 'PG-13'
    },
    {
      id: '2',
      title: 'The Dark Knight',
      genre: ['Action', 'Crime'],
      posterUrl: 'https://example.com/darkknight.jpg', // Replace with actual image
      rating: 'PG-13'
    },
    {
      id: '3',
      title: 'Inception',
      genre: ['Sci-Fi', 'Action'],
      posterUrl: 'https://example.com/inception.jpg', // Replace with actual image
      rating: 'PG-13'
    },
    {
      id: '4',
      title: 'Dune',
      genre: ['Sci-Fi', 'Adventure'],
      posterUrl: 'https://example.com/dune.jpg', // Replace with actual image
      rating: 'PG-13'
    }
  ]);
  
  const [comingSoon, setComingSoon] = useState<Movie[]>([
    {
      id: '5',
      title: 'Avatar 3',
      genre: ['Sci-Fi', 'Adventure'],
      posterUrl: 'https://example.com/avatar3.jpg', // Replace with actual image
      rating: 'PG-13'
    },
    {
      id: '6',
      title: 'Mission: Impossible 8',
      genre: ['Action', 'Thriller'],
      posterUrl: 'https://example.com/mi8.jpg', // Replace with actual image
      rating: 'PG-13'
    },
    {
      id: '7',
      title: 'Jurassic World 4',
      genre: ['Action', 'Adventure'],
      posterUrl: 'https://example.com/jw4.jpg', // Replace with actual image
      rating: 'PG-13'
    },
    {
      id: '8',
      title: 'Star Wars: New Era',
      genre: ['Sci-Fi', 'Action'],
      posterUrl: 'https://example.com/starwars.jpg', // Replace with actual image
      rating: 'PG-13'
    }
  ]);

  const renderMovieItem = ({ item }: { item: Movie }) => (
    <TouchableOpacity 
      style={styles.movieCard}
    >
      <Image 
        source={{ uri: item.posterUrl }} 
        style={styles.poster}
        defaultSource={require('@/assets/images/partial-react-logo.png')} // Placeholder
      />
      <ThemedView style={styles.movieInfo}>
        <ThemedText type="defaultSemiBold" numberOfLines={1}>{item.title}</ThemedText>
        <ThemedText style={styles.movieRating}>{item.rating}</ThemedText>
      </ThemedView>
    </TouchableOpacity>
  );

  return (
          <ParallaxScrollView
      headerBackgroundColor={{ light: '#A1CEDC', dark: '#1D3D47' }}
      headerImage={
        <ThemedView style={styles.headerContent}>
          <Image
            source={require('@/assets/images/partial-react-logo.png')}
            style={styles.reactLogo}
          />
          <TouchableOpacity 
            style={styles.locationSelector}
          >
            <IconSymbol name="location.fill" size={16} color="#A1CEDC" />
            <ThemedText numberOfLines={1} style={styles.locationText}>
              {selectedTheater}
            </ThemedText>
            <IconSymbol name="chevron.down" size={16} color="#A1CEDC" />
          </TouchableOpacity>
        </ThemedView>
      }>
      
      {/* Welcome Title */}
      <ThemedView style={styles.welcomeContainer}>
        <ThemedText type="title" style={styles.welcomeTitle}>
          Welcome to Lion's Den Cinema!
        </ThemedText>
      </ThemedView>
      
      {/* Featured Movie Section */}
      <TouchableOpacity 
        style={styles.featuredContainer}
      >
        <Image 
          source={{ uri: featuredMovie.backdropUrl }} 
          style={styles.featuredImage}
          defaultSource={require('@/assets/images/partial-react-logo.png')} // Placeholder
        />
        <View style={styles.featuredGradient}>
          <ThemedText type="title" style={styles.featuredTitle}>{featuredMovie.title}</ThemedText>
          <TouchableOpacity 
            style={styles.watchButton}
          >
            <IconSymbol name="play.fill" size={16} color="#fff" />
            <ThemedText style={styles.watchButtonText}>Watch Trailer</ThemedText>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
      
      {/* Now Playing Section */}
      <ThemedView style={styles.sectionContainer}>
        <ThemedView style={styles.sectionHeader}>
          <ThemedText type="subtitle">Now Playing</ThemedText>
          <TouchableOpacity onPress={() => router.push('/movies')}>
            <ThemedText style={styles.seeAllText}>See All</ThemedText>
          </TouchableOpacity>
        </ThemedView>
        
        <FlatList
          data={nowPlaying}
          renderItem={renderMovieItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.movieList}
        />
      </ThemedView>
      
      {/* Coming Soon Section */}
      <ThemedView style={styles.sectionContainer}>
        <ThemedView style={styles.sectionHeader}>
          <ThemedText type="subtitle">Coming Soon</ThemedText>
          <TouchableOpacity onPress={() => router.push('/movies?filter=upcoming')}>
            <ThemedText style={styles.seeAllText}>See All</ThemedText>
          </TouchableOpacity>
        </ThemedView>
        
        <FlatList
          data={comingSoon}
          renderItem={renderMovieItem}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.movieList}
        />
      </ThemedView>
      
      {/* Ticket Shortcuts */}
      <ThemedView style={styles.ticketContainer}>
        <ThemedText type="subtitle">Quick Actions</ThemedText>
        <ThemedView style={styles.ticketButtons}>
          <TouchableOpacity 
            style={styles.ticketButton}
            onPress={() => router.push('/tickets')}
          >
            <IconSymbol name="ticket" size={28} color="#000000" />
            <ThemedText type="defaultSemiBold">My Tickets</ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={styles.ticketButton}
            onPress={() => router.push('/movies')}
          >
            <IconSymbol name="film" size={28} color="#000000" />
            <ThemedText type="defaultSemiBold">Buy Tickets</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      </ThemedView>
    </ParallaxScrollView>
  );
}

const styles = StyleSheet.create({
  headerContent: {
    width: '100%',
    height: '100%',
    justifyContent: 'flex-end',
    alignItems: 'flex-start',
  },
  reactLogo: {
    height: 120,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
    opacity: 0.5,
  },
  locationSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    position: 'absolute',
    top: 16,
    right: 16,
    maxWidth: 180,
  },
  locationText: {
    marginHorizontal: 6,
    color: '#333',
    fontSize: 14,
    fontWeight: '500',
  },
  welcomeContainer: {
    paddingHorizontal: 1,
    paddingVertical: 1,
    marginBottom: -75,
  },
  welcomeTitle: {
    fontSize: 35,
    textAlign: 'left',
    color: '#FFFFFF',
  },
  featuredContainer: {
    width: '100%',
    height: 240,
    marginBottom: 24,
    position: 'relative',
  },
  featuredImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
  },
  featuredGradient: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: '60%',
    padding: 16,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0,0,0,0.4)',
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
  },
  featuredTitle: {
    color: '#fff',
    fontSize: 24,
    marginBottom: 12,
  },
  watchButton: {
    flexDirection: 'row',
    backgroundColor: '#A1CEDC',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
    alignSelf: 'flex-start',
  },
  watchButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 6,
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  seeAllText: {
    color: '#A1CEDC',
  },
  movieList: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  movieCard: {
    width: 120,
    marginRight: 12,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  poster: {
    width: '100%',
    height: 180,
    resizeMode: 'cover',
  },
  movieInfo: {
    padding: 8,
  },
  movieRating: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  ticketContainer: {
    marginBottom: 32,
    paddingHorizontal: 16,
  },
  ticketButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  ticketButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f8f8f8',
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 6,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
});
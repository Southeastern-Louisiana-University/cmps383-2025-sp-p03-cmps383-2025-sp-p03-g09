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
  Linking,
  Platform
} from 'react-native';
import { useLocalSearchParams, router, Stack } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import { WebView } from 'react-native-webview';

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
    youtubeUrl: "https://www.youtube.com/watch?v=5PSzFLV-EyQ",
    showtimes: [
      { id: 1, time: "11:00 AM", date: "2025-04-26", theater: "Theater 1", availableSeats: 120 },
      { id: 2, time: "2:30 PM", date: "2025-04-26", theater: "Theater 2", availableSeats: 110 },
      { id: 3, time: "6:00 PM", date: "2025-04-26", theater: "Theater 1", availableSeats: 90 }
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
    youtubeUrl: "https://www.youtube.com/watch?v=99BLnkAlC1M",
    showtimes: [
      { id: 4, time: "1:00 PM", date: "2025-04-26", theater: "Theater 4", availableSeats: 130 },
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
    youtubeUrl: "https://www.youtube.com/watch?v=KsSoo5K8CpA",
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
    description: "Four misfits find themselves struggling with ordinary problems when they are suddenly pulled through a mysterious portal into the Overworld: a bizarre, cubic wonderland that thrives on imagination. To get back home, they'll have to master this world while embarking on a magical quest with an unexpected, expert crafter, Steve.",
    releaseDate: "2025-04-04",
    posterUrl: "https://i.imgur.com/CtiItHl.jpeg",
    youtubeUrl: "https://www.youtube.com/watch?v=8B1EtVPBSMw",
    showtimes: [
      { id: 10, time: "1:30 PM", date: "2025-04-26", theater: "Theater 2", availableSeats: 130 },
      { id: 11, time: "4:45 PM", date: "2025-04-26", theater: "Theater 3", availableSeats: 115 },
      { id: 12, time: "7:45 PM", date: "2025-04-26", theater: "Theater 4", availableSeats: 105 }
    ]
  },
  {
    id: 5,
    title: "The Amateur",
    duration: 123,
    rating: "PG-13",
    description: "After his life is turned upside down when his wife is killed in a London terrorist attack, a brilliant but introverted CIA decoder takes matters into his own hands when his supervisors refuse to take action.",
    releaseDate: "2025-04-11",
    posterUrl: "https://i.imgur.com/82JHVqU.jpeg",
    youtubeUrl: "https://www.youtube.com/watch?v=DCWcK4c-F8Q",
    showtimes: [
      { id: 13, time: "12:15 PM", date: "2025-04-26", theater: "Theater 1", availableSeats: 125 },
      { id: 14, time: "3:15 PM", date: "2025-04-26", theater: "Theater 2", availableSeats: 110 },
      { id: 15, time: "6:30 PM", date: "2025-04-26", theater: "Theater 3", availableSeats: 95 }
    ]
  },
  {
    id: 6,
    title: "A Working Man",
    duration: 116,
    rating: "R",
    description: "Levon Cade left behind a decorated military career in the black ops to live a simple life working construction. But when his boss's daughter, who is like family to him, is taken by human traffickers, his search to bring her home uncovers a world of corruption far greater than he ever could have imagined.",
    releaseDate: "2025-03-28",
    posterUrl: "https://i.imgur.com/oPNz3zp.jpeg",
    youtubeUrl: "https://www.youtube.com/watch?v=mdfrG2cLK58",
    showtimes: [
      { id: 16, time: "11:45 AM", date: "2025-04-26", theater: "Theater 4", availableSeats: 135 },
      { id: 17, time: "3:00 PM", date: "2025-04-26", theater: "Theater 1", availableSeats: 120 },
      { id: 18, time: "8:15 PM", date: "2025-04-26", theater: "Theater 2", availableSeats: 105 }
    ]
  },
  {
    id: 7,
    title: "The King of Kings",
    duration: 104,
    rating: "PG",
    description: "A father tells his son the greatest story ever told, and what begins as a bedtime tale becomes a life-changing journey. Through vivid imagination, the boy walks alongside Jesus, witnessing His miracles, facing His trials, and understanding His ultimate sacrifice. The King of Kings invites us to rediscover the enduring power of hope, love, and redemption through the eyes of a child.",
    releaseDate: "2025-04-11",
    posterUrl: "https://i.imgur.com/hvZ9Aql.jpeg",
    youtubeUrl: "https://www.youtube.com/watch?v=HkGZ4ykhYPg",
    showtimes: [
      { id: 19, time: "11:00 AM", date: "2025-04-26", theater: "Theater 3", availableSeats: 140 },
      { id: 20, time: "4:00 PM", date: "2025-04-26", theater: "Theater 2", availableSeats: 120 },
      { id: 21, time: "6:40 PM", date: "2025-04-26", theater: "Theater 3", availableSeats: 130 }
    ]
  },
  {
    id: 8,
    title: "Death of a Unicorn",
    duration: 107,
    rating: "R",
    description: "A father and daughter accidentally hit and kill a unicorn while en route to a weekend retreat, where his billionaire boss seeks to exploit the creature's miraculous curative properties.",
    releaseDate: "2025-03-28",
    posterUrl: "https://i.imgur.com/EYeLcGS.jpeg",
    youtubeUrl: "https://www.youtube.com/watch?v=aQOle3MHnGs",
    showtimes: [
      { id: 22, time: "12:45 PM", date: "2025-04-26", theater: "Theater 2", availableSeats: 125 },
      { id: 23, time: "4:15 PM", date: "2025-04-26", theater: "Theater 3", availableSeats: 115 },
      { id: 24, time: "7:30 PM", date: "2025-04-26", theater: "Theater 1", availableSeats: 100 }
    ]
  },
  {
    id: 9,
    title: "Sacramento",
    duration: 89,
    rating: "R",
    description: "When free-spirited Ricky suddenly reappears in father-to-be Glenn's life, the two former best friends embark on a spontaneous road trip from LA to Sacramento.",
    releaseDate: "2025-04-11",
    posterUrl: "https://i.imgur.com/6V0N9Rg.jpeg",
    youtubeUrl: "https://www.youtube.com/watch?v=jZRbFs_WhX0",
    showtimes: [
      { id: 25, time: "1:15 PM", date: "2025-04-26", theater: "Theater 3", availableSeats: 130 },
      { id: 26, time: "5:00 PM", date: "2025-04-26", theater: "Theater 2", availableSeats: 120 },
      { id: 27, time: "8:30 PM", date: "2025-04-26", theater: "Theater 4", availableSeats: 110 }
    ]
  },
  {
    id: 10,
    title: "The Friend",
    duration: 120,
    rating: "R",
    description: "Writer and teacher Iris finds her comfortable, solitary New York life thrown into disarray after her closest friend and mentor bequeaths her his beloved 150 lb. Great Dane. The regal yet intractable beast, named Apollo, immediately creates practical problems for Iris, from furniture destruction to eviction notices, as well as more existential ones. Yet as Iris finds herself unexpectedly bonding with Apollo, she begins to come to terms with her past, and her own creative inner life in this story of healing, love, and friendship.",
    releaseDate: "2025-03-28",
    posterUrl: "https://i.imgur.com/HXDE59T.jpeg",
    youtubeUrl: "https://www.youtube.com/watch?v=K2Df2g0Gl6o",
    showtimes: [
      { id: 28, time: "12:00 PM", date: "2025-04-26", theater: "Theater 1", availableSeats: 135 },
      { id: 29, time: "3:45 PM", date: "2025-04-26", theater: "Theater 4", availableSeats: 125 },
      { id: 30, time: "7:00 PM", date: "2025-04-26", theater: "Theater 2", availableSeats: 115 }
    ]
  },
  {
    id: 11,
    title: "Thunderbolts*",
    duration: 127,
    rating: "PG-13",
    description: "After finding themselves ensnared in a death trap, seven disillusioned castoffs must embark on a dangerous mission that will force them to confront the darkest corners of their pasts.",
    releaseDate: "2025-05-02",
    posterUrl: "https://i.imgur.com/1NfJH2h.jpeg",
    youtubeUrl: "https://www.youtube.com/watch?v=-sAOWhvheK8",
    showtimes: [
      { id: 31, time: "12:30 PM", date: "2025-05-03", theater: "Theater 2", availableSeats: 140 },
      { id: 32, time: "4:30 PM", date: "2025-05-03", theater: "Theater 1", availableSeats: 130 },
      { id: 33, time: "8:00 PM", date: "2025-05-03", theater: "Theater 3", availableSeats: 120 }
    ]
  },
  {
    id: 12,
    title: "The Surfer",
    duration: 100,
    rating: "R",
    description: "A man returns to the idyllic beach of his childhood to surf with his son. But his desire to hit the waves is thwarted by a group of locals whose mantra is 'don't live here, don't surf here.' Humiliated and angry, the man is drawn into a conflict that keeps rising in concert with the punishing heat of the summer and pushes him to his breaking point.",
    releaseDate: "2025-05-02",
    posterUrl: "https://i.imgur.com/UgsS6bZ.jpeg",
    youtubeUrl: "https://www.youtube.com/watch?v=A7Bo6cyfWho",
    showtimes: [
      { id: 34, time: "1:45 PM", date: "2025-05-03", theater: "Theater 3", availableSeats: 135 },
      { id: 35, time: "5:15 PM", date: "2025-05-03", theater: "Theater 2", availableSeats: 125 },
      { id: 36, time: "7:45 PM", date: "2025-05-03", theater: "Theater 4", availableSeats: 115 }
    ]
  },
  {
    id: 13,
    title: "Clown in a Cornfield",
    duration: 96,
    rating: "R",
    description: "Quinn and her father have just moved to the quiet town of Kettle Springs hoping for a fresh start. Instead, she discovers a fractured community that has fallen on hard times after the treasured Baypen Corn Syrup Factory burned down. As the locals bicker amongst themselves and tensions boil over, a sinister, grinning figure emerges from the cornfields to cleanse the town of its burdens, one bloody victim at a time.",
    releaseDate: "2025-05-09",
    posterUrl: "https://i.imgur.com/U28yIHf.jpeg",
    youtubeUrl: "https://www.youtube.com/watch?v=e69AWLED77w",
    showtimes: [
      { id: 37, time: "2:15 PM", date: "2025-05-10", theater: "Theater 4", availableSeats: 130 },
      { id: 38, time: "6:00 PM", date: "2025-05-10", theater: "Theater 1", availableSeats: 120 },
      { id: 39, time: "9:30 PM", date: "2025-05-10", theater: "Theater 2", availableSeats: 110 }
    ]
  },
  {
    id: 14,
    title: "Fight or Flight",
    duration: 101,
    rating: "R",
    description: "A mercenary takes on the job of tracking down a target on a plane but must protect her when they're surrounded by people trying to kill both of them.",
    releaseDate: "2025-05-09",
    posterUrl: "https://i.imgur.com/bRlyqRA.jpeg",
    youtubeUrl: "https://www.youtube.com/watch?v=SdsHRpjfqEI",
    showtimes: [
      { id: 40, time: "1:30 PM", date: "2025-05-10", theater: "Theater 1", availableSeats: 135 },
      { id: 41, time: "5:30 PM", date: "2025-05-10", theater: "Theater 3", availableSeats: 125 },
      { id: 42, time: "8:45 PM", date: "2025-05-10", theater: "Theater 4", availableSeats: 115 }
    ]
  },
  {
    id: 15,
    title: "Shadow Force",
    duration: 104,
    rating: "R",
    description: "Kyrah and Isaac were once the leaders of a multinational special forces group called Shadow Force. They broke the rules by falling in love, and in order to protect their son, they go underground. With a large bounty on their heads, and the vengeful Shadow Force hot on their trail, one family's fight becomes all-out war.",
    releaseDate: "2025-05-09",
    posterUrl: "https://i.imgur.com/h61baCw.jpeg",
    youtubeUrl: "https://www.youtube.com/watch?v=M7LhGytiHFM",
    showtimes: [
      { id: 43, time: "12:45 PM", date: "2025-05-10", theater: "Theater 2", availableSeats: 140 },
      { id: 44, time: "4:15 PM", date: "2025-05-10", theater: "Theater 4", availableSeats: 130 },
      { id: 45, time: "7:30 PM", date: "2025-05-10", theater: "Theater 1", availableSeats: 120 }
    ]
  }
];

const SCREEN_WIDTH = Dimensions.get('window').width;
const TRAILER_HEIGHT = SCREEN_WIDTH * 0.6; // 16:9 aspect ratio for videos

// Function to extract YouTube video ID from URL
const getYoutubeVideoId = (url: string): string => {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : '';
};

const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString('en-US', options);
};

export default function MovieScreen() {
  const params = useLocalSearchParams();
  const movieId = params.id as string;
  
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedShowtime, setSelectedShowtime] = useState<Showtime | null>(null);

  useEffect(() => {
    // Simulate API call with the hardcoded data
    const fetchMovie = () => {
      setLoading(true);
      try {
        // Find movie in the hardcoded data
        const foundMovie = moviesData.find(m => m.id === parseInt(movieId));
        
        if (foundMovie) {
          setMovie(foundMovie);
          setError(null);
        } else {
          setError('Movie not found');
        }
      } catch (err) {
        setError('Failed to load movie details');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchMovie();
  }, [movieId]);

  const handleShowtimeSelect = (showtime: Showtime) => {
    setSelectedShowtime(showtime);
  };

  const openYoutubeVideo = (youtubeUrl: string) => {
    Linking.openURL(youtubeUrl);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#10b981" />
        <Text style={styles.loadingText}>Loading movie details...</Text>
      </View>
    );
  }

  if (error || !movie) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error || 'Movie not found'}</Text>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <Text style={styles.backButtonText}>Go Back</Text>
        </TouchableOpacity>
      </View>
    );
  }

  const youtubeVideoId = movie.youtubeUrl ? getYoutubeVideoId(movie.youtubeUrl) : '';

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: movie.title,
          headerStyle: { backgroundColor: '#000000' },
          headerTintColor: '#ffffff',
        }}
      />

      <ScrollView style={styles.scrollView}>
        {/* Movie Poster and Basic Info */}
        <View style={styles.headerSection}>
          <Image 
            source={{ uri: movie.posterUrl }} 
            style={styles.poster}
            defaultSource={require('@/assets/images/partial-react-logo.png')}
          />
          <View style={styles.headerInfo}>
            <Text style={styles.title}>{movie.title}</Text>
            <View style={styles.metadataContainer}>
              <Text style={styles.metadataLabel}>Duration:</Text>
              <Text style={styles.metadataValue}>{movie.duration} mins</Text>
            </View>
            <View style={styles.metadataContainer}>
              <Text style={styles.metadataLabel}>Rating:</Text>
              <Text style={styles.metadataValue}>{movie.rating}</Text>
            </View>
            {movie.releaseDate && (
              <View style={styles.metadataContainer}>
                <Text style={styles.metadataLabel}>Release Date:</Text>
                <Text style={styles.metadataValue}>{formatDate(movie.releaseDate)}</Text>
              </View>
            )}
          </View>
        </View>

        {/* Description */}
        <View style={styles.descriptionContainer}>
          <Text style={styles.descriptionText}>{movie.description}</Text>
        </View>

        {/* Showtimes */}
        {movie.showtimes && movie.showtimes.length > 0 && (
          <View style={styles.showtimesContainer}>
            <Text style={styles.sectionTitle}>Select Showtime:</Text>
            <View style={styles.showtimesGrid}>
              {movie.showtimes.map(showtime => (
                <TouchableOpacity 
                  key={showtime.id}
                  style={styles.showtimeButton}
                  onPress={() => handleShowtimeSelect(showtime)}
                >
                  <Text style={styles.showtimeText}>{showtime.time}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Trailer */}
        {youtubeVideoId && (
          <View style={styles.trailerContainer}>
            <Text style={styles.sectionTitle}>Trailer</Text>
            {Platform.OS === 'web' ? (
              <iframe 
                src={`https://www.youtube.com/embed/${youtubeVideoId}`}
                style={{
                  width: SCREEN_WIDTH - 32,
                  height: TRAILER_HEIGHT,
                  borderRadius: 8,
                  border: 'none',
                }}
                title={`${movie.title} trailer`}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            ) : (
              <View>
                <WebView
                  style={{
                    width: SCREEN_WIDTH - 32,
                    height: TRAILER_HEIGHT,
                  }}
                  source={{ uri: `https://www.youtube.com/embed/${youtubeVideoId}` }}
                  allowsFullscreenVideo
                />
                <TouchableOpacity
                  style={styles.openYoutubeButton}
                  onPress={() => openYoutubeVideo(movie.youtubeUrl!)}
                >
                  <Text style={styles.openYoutubeText}>Open in YouTube</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
        
        {/* Bottom spacer */}
        <View style={{ height: 40 }} />
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
    fontSize: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#000000',
    padding: 20,
  },
  errorText: {
    color: '#ffffff',
    marginBottom: 20,
    fontSize: 16,
    textAlign: 'center',
  },
  backButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  headerSection: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
  },
  poster: {
    width: 120,
    height: 180,
    borderRadius: 8,
    marginRight: 16,
  },
  headerInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  metadataContainer: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  metadataLabel: {
    color: '#10b981',
    fontWeight: '500',
    marginRight: 4,
  },
  metadataValue: {
    color: '#ffffff',
  },
  descriptionContainer: {
    padding: 16,
  },
  descriptionText: {
    color: '#e0e0e0',
    fontSize: 16,
    lineHeight: 24,
  },
  showtimesContainer: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#ffffff',
    marginBottom: 16,
  },
  showtimesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  showtimeButton: {
    backgroundColor: '#10b981',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 100,
    alignItems: 'center',
  },
  showtimeText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  trailerContainer: {
    padding: 16,
  },
  trailerWebView: {
    borderRadius: 8,
    overflow: 'hidden',
  },
  openYoutubeButton: {
    backgroundColor: '#FF0000',
    paddingVertical: 8,
    marginTop: 8,
    borderRadius: 4,
    alignItems: 'center',
  },
  openYoutubeText: {
    color: '#FFFFFF',
    fontWeight: '600',
  },
});
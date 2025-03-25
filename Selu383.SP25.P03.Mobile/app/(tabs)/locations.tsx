// app/location.tsx
import React, { useState, useEffect } from 'react';
import { StyleSheet, TouchableOpacity, FlatList, ActivityIndicator, TextInput } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';

// Define types
interface Theater {
  id: string;
  name: string;
  address: string;
  distance: string; // e.g., "2.5 mi"
  favorite: boolean;
}

export default function LocationScreen() {
  const { returnTo } = useLocalSearchParams();
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [filteredTheaters, setFilteredTheaters] = useState<Theater[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    // In a real app, fetch theaters from an API
    // Simulating API request
    setTimeout(() => {
      const theaterData: Theater[] = [
        {
          id: '1',
          name: 'Regal Cinemas Downtown',
          address: '123 Main St, City Center',
          distance: '1.2 mi',
          favorite: true
        },
        {
          id: '2',
          name: 'AMC Metroplex 16',
          address: '789 Broadway Ave, Westside',
          distance: '3.5 mi',
          favorite: false
        },
        {
          id: '3',
          name: 'Cinemark Plaza Theater',
          address: '456 Park Blvd, Northside',
          distance: '4.8 mi',
          favorite: true
        },
        {
          id: '4',
          name: 'Grand IMAX Theater',
          address: '1010 Technology Dr, Eastside',
          distance: '6.2 mi',
          favorite: false
        },
        {
          id: '5',
          name: 'Alamo Drafthouse Cinema',
          address: '2525 Entertainment Blvd, Southside',
          distance: '7.0 mi',
          favorite: false
        }
      ];
      
      setTheaters(theaterData);
      setFilteredTheaters(theaterData);
      setLoading(false);
    }, 1000); // Simulate network delay
  }, []);

  useEffect(() => {
    // Filter theaters based on search query
    if (searchQuery.trim() === '') {
      setFilteredTheaters(theaters);
    } else {
      const filtered = theaters.filter(theater => 
        theater.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        theater.address.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredTheaters(filtered);
    }
  }, [searchQuery, theaters]);

  const handleTheaterSelect = (theater: Theater) => {
    // Save selected theater to local storage or app state
    // In a real app, you would use AsyncStorage or similar
    console.log(`Selected theater: ${theater.name}`);
    
    // Navigate back to the calling screen or to the default screen
    if (returnTo) {
    } else {
      router.back();
    }
  };

  const toggleFavorite = (theaterId: string) => {
    const updatedTheaters = theaters.map(theater => 
      theater.id === theaterId 
        ? { ...theater, favorite: !theater.favorite } 
        : theater
    );
    
    setTheaters(updatedTheaters);
    
    // Also update the filtered list
    const updatedFiltered = filteredTheaters.map(theater => 
      theater.id === theaterId 
        ? { ...theater, favorite: !theater.favorite } 
        : theater
    );
    
    setFilteredTheaters(updatedFiltered);
  };

  const renderTheater = ({ item }: { item: Theater }) => (
    <TouchableOpacity
      style={styles.theaterCard}
      onPress={() => handleTheaterSelect(item)}
    >
      <ThemedView style={styles.theaterInfo}>
        <ThemedText type="defaultSemiBold">{item.name}</ThemedText>
        <ThemedText style={styles.theaterAddress}>{item.address}</ThemedText>
        <ThemedText style={styles.theaterDistance}>{item.distance}</ThemedText>
      </ThemedView>
      
      <TouchableOpacity
        style={styles.favoriteButton}
        onPress={() => toggleFavorite(item.id)}
      >
        <IconSymbol 
          name={item.favorite ? "star.fill" : "star"} 
          size={24} 
          color={item.favorite ? "#FFD700" : "#CCCCCC"} 
        />
      </TouchableOpacity>
    </TouchableOpacity>
  );

  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <IconSymbol name="chevron.left" size={24} color="#000" />
        </TouchableOpacity>
        <ThemedText type="title">Select Theater</ThemedText>
      </ThemedView>
      
      <ThemedView style={styles.searchContainer}>
        <TextInput
          style={styles.searchInput}
          placeholder="Search theaters..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholderTextColor="#888"
          autoCapitalize="none"
        />
        {searchQuery !== '' && (
          <TouchableOpacity
            style={styles.clearButton}
            onPress={() => setSearchQuery('')}
          >
            <IconSymbol name="xmark.circle.fill" size={20} color="#888" />
          </TouchableOpacity>
        )}
      </ThemedView>
      
      {loading ? (
        <ThemedView style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#A1CEDC" />
          <ThemedText style={styles.loadingText}>Loading theaters...</ThemedText>
        </ThemedView>
      ) : (
        <>
          {filteredTheaters.length > 0 ? (
            <FlatList
              data={filteredTheaters}
              renderItem={renderTheater}
              keyExtractor={item => item.id}
              contentContainerStyle={styles.theaterList}
            />
          ) : (
            <ThemedView style={styles.emptyContainer}>
              <IconSymbol name="exclamationmark.triangle" size={48} color="#CCCCCC" />
              <ThemedText style={styles.emptyText}>
                No theaters found matching "{searchQuery}"
              </ThemedText>
            </ThemedView>
          )}
        </>
      )}
      
      <ThemedView style={styles.locationSection}>
        <TouchableOpacity style={styles.locationButton}>
          <IconSymbol name="location.fill" size={24} color="#A1CEDC" />
          <ThemedText type="defaultSemiBold" style={styles.locationText}>
            Use My Current Location
          </ThemedText>
        </TouchableOpacity>
      </ThemedView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#00000',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 11,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  backButton: {
    marginRight: 10,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    margin: 16,
    paddingHorizontal: 12,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 46,
    fontSize: 16,
    color: '#000',
  },
  clearButton: {
    padding: 4,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    color: '#888',
  },
  theaterList: {
    padding: 16,
  },
  theaterCard: {
    flexDirection: 'row',
    backgroundColor: '#f8f8f8',
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  theaterInfo: {
    flex: 1,
  },
  theaterAddress: {
    color: '#666',
    marginTop: 4,
  },
  theaterDistance: {
    color: '#888',
    marginTop: 8,
    fontSize: 12,
  },
  favoriteButton: {
    padding: 8,
    justifyContent: 'center',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    marginTop: 16,
    color: '#888',
    textAlign: 'center',
  },
  locationSection: {
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: '#eee',
  },
  locationButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f8ff',
    padding: 16,
    borderRadius: 8,
  },
  locationText: {
    marginLeft: 8,
    color: '#A1CEDC',
  },
});
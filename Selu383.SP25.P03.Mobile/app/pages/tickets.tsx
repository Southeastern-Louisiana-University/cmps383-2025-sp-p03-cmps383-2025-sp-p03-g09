// app/movie/[id]/purchase.tsx
import React, { useState } from 'react';
import { StyleSheet, View, Text, Image, ScrollView, TouchableOpacity } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';

// Mock data directly in component to avoid loading delay
const MOVIE_DATA = {
  '1': {
    id: '1',
    title: 'Captain America: Brave New World',
    posterUrl: 'https://i.imgur.com/kpvUnbB.jpeg',
    description: 'A thief who steals corporate secrets through dream-sharing technology. After meeting with newly elected U.S. President Thaddeus Ross, Sam finds himself in the middle of an international incident...',
    duration: 119,
    rating: 'PG-13',
  },
  '2': {
    id: '2',
    title: 'Novocaine',
    posterUrl: 'https://i.imgur.com/lvhe19y.jpeg',
    description: 'When the girl of his dreams is kidnapped, everyman Nate turns his inability to feel pain into an unexpected strength in his fight to get her back.',
    duration: 109,
    rating: 'R',
  },
  '3': {
    id: '3',
    title: 'Snow White',
    posterUrl: 'https://i.imgur.com/xCNOH4U.jpeg',
    description: 'Princess Snow White flees the castle when the Evil Queen, in her jealousy over Snow White\'s inner beauty, tries to kill her...',
    duration: 109,
    rating: 'PG',
  }
};

const FOOD_ITEMS = [
  {
    id: '1',
    name: 'Popcorn',
    price: 5.99,
    imageUrl: 'https://i.imgur.com/NUyttbn.jpg',
  },
  {
    id: '2',
    name: 'Nachos',
    price: 6.99,
    imageUrl: 'https://i.imgur.com/Hq6HFSS.jpg',
  },
  {
    id: '3',
    name: 'Soft Pretzel',
    price: 4.99,
    imageUrl: 'https://i.imgur.com/8FKG8on.jpg',
  }
];

export default function PurchaseScreen() {
  const params = useLocalSearchParams();
  const { id = '1', showtime = '12:00PM' } = params;
  
  // Get movie data directly from our static data
  const movie = MOVIE_DATA[id as keyof typeof MOVIE_DATA] || MOVIE_DATA['1'];
  const location = "Lion's Den Los Angeles";
  
  const [ticketCount, setTicketCount] = useState(1);
  const [ticketPrice] = useState(12.99);
  const [cart, setCart] = useState<{itemId: string, quantity: number}[]>([]);

  const handleAddToCart = (itemId: string) => {
    const existingItem = cart.find(item => item.itemId === itemId);
    
    if (existingItem) {
      // Update quantity if item already in cart
      setCart(cart.map(item => 
        item.itemId === itemId 
          ? {...item, quantity: item.quantity + 1}
          : item
      ));
    } else {
      // Add new item to cart
      setCart([...cart, {itemId, quantity: 1}]);
    }
  };
  
  const calculateTotal = () => {
    let total = ticketCount * ticketPrice;
    
    cart.forEach(cartItem => {
      const item = FOOD_ITEMS.find(food => food.id === cartItem.itemId);
      if (item) {
        total += item.price * cartItem.quantity;
      }
    });
    
    return total.toFixed(2);
  };
  
  const increaseTickets = () => {
    setTicketCount(prev => prev + 1);
  };
  
  const decreaseTickets = () => {
    if (ticketCount > 1) {
      setTicketCount(prev => prev - 1);
    }
  };
  
  const clearCart = () => {
    setCart([]);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <IconSymbol name="arrow.left" size={24} color="#FFFFFF" />
        </TouchableOpacity>
        <ThemedText style={styles.headerTitle}>Your Cart</ThemedText>
      </View>
      
      {cart.length > 0 && (
        <TouchableOpacity style={styles.clearCartButton} onPress={clearCart}>
          <Text style={styles.clearCartText}>Clear Cart</Text>
        </TouchableOpacity>
      )}
      
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Ticket Details</ThemedText>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Movie:</Text>
          <Text style={styles.detailValue}>{movie.title}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Location:</Text>
          <Text style={styles.detailValue}>{location}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Showtime:</Text>
          <Text style={styles.detailValue}>{showtime}</Text>
        </View>
        
        <View style={styles.ticketSelector}>
          <Text style={styles.detailLabel}>Tickets:</Text>
          <View style={styles.quantitySelector}>
            <TouchableOpacity onPress={decreaseTickets} style={styles.quantityButton}>
              <Text style={styles.quantityButtonText}>-</Text>
            </TouchableOpacity>
            <Text style={styles.quantityText}>{ticketCount}</Text>
            <TouchableOpacity onPress={increaseTickets} style={styles.quantityButton}>
              <Text style={styles.quantityButtonText}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Ticket Price:</Text>
          <Text style={styles.detailValue}>${ticketPrice.toFixed(2)}</Text>
        </View>
      </View>
      
      <View style={styles.section}>
        <ThemedText style={styles.sectionTitle}>Want to add some food?</ThemedText>
        
        {FOOD_ITEMS.map((item) => (
          <View key={item.id} style={styles.foodItem}>
            <Image 
              source={{ uri: item.imageUrl }}
              defaultSource={require('@/assets/images/partial-react-logo.png')}
              style={styles.foodImage}
            />
            <View style={styles.foodInfo}>
              <Text style={styles.foodName}>{item.name}</Text>
              <Text style={styles.foodPrice}>${item.price.toFixed(2)}</Text>
            </View>
            <TouchableOpacity 
              style={styles.addButton}
              onPress={() => handleAddToCart(item.id)}
            >
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
          </View>
        ))}
      </View>
      
      <View style={styles.totalSection}>
        <ThemedText style={styles.totalText}>Total: ${calculateTotal()}</ThemedText>
        <TouchableOpacity style={styles.checkoutButton}>
          <Text style={styles.checkoutButtonText}>Add to Cart</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 20,
    paddingHorizontal: 16,
    backgroundColor: '#1A1A1A',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginLeft: 16,
  },
  clearCartButton: {
    backgroundColor: '#2A2A2A',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignSelf: 'flex-start',
    marginLeft: 16,
    marginTop: 16,
  },
  clearCartText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  section: {
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    margin: 16,
    padding: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailLabel: {
    color: '#BBBBBB',
    fontSize: 16,
  },
  detailValue: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    textAlign: 'right',
  },
  ticketSelector: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  quantityButton: {
    backgroundColor: '#10b981',
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: 'bold',
  },
  quantityText: {
    color: '#FFFFFF',
    fontSize: 16,
    marginHorizontal: 12,
  },
  foodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  foodImage: {
    width: 60,
    height: 60,
    borderRadius: 6,
    backgroundColor: '#2A2A2A',
  },
  foodInfo: {
    flex: 1,
    marginLeft: 12,
  },
  foodName: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  foodPrice: {
    color: '#10b981',
    fontSize: 14,
    marginTop: 4,
  },
  addButton: {
    backgroundColor: '#10b981',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
  },
  addButtonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  totalSection: {
    backgroundColor: '#1A1A1A',
    borderRadius: 8,
    margin: 16,
    padding: 16,
    marginBottom: 32,
  },
  totalText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  checkoutButton: {
    backgroundColor: '#10b981',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
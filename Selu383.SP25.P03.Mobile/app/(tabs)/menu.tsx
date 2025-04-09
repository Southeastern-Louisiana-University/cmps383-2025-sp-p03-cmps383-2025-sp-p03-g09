import React, { useState } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Image, View } from 'react-native';
import { router } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';

// Types for our data
interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  category: 'popcorn' | 'snacks' | 'drinks' | 'combos';
}

interface CartItem extends MenuItem {
  quantity: number;
}

export default function FoodMenuScreen() {
  const [activeCategory, setActiveCategory] = useState<'popcorn' | 'snacks' | 'drinks' | 'combos'>('popcorn');
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  
  // Sample menu data
  const menuItems: MenuItem[] = [
    // Popcorn
    {
      id: 'p1',
      name: 'Small Popcorn',
      description: 'Freshly popped buttery goodness',
      price: 5.99,
      imageUrl: 'https://example.com/small-popcorn.jpg',
      category: 'popcorn'
    },
    {
      id: 'p2',
      name: 'Medium Popcorn',
      description: 'Freshly popped buttery goodness',
      price: 7.99,
      imageUrl: 'https://example.com/medium-popcorn.jpg',
      category: 'popcorn'
    },
    {
      id: 'p3',
      name: 'Large Popcorn',
      description: 'Freshly popped buttery goodness',
      price: 9.99,
      imageUrl: 'https://example.com/large-popcorn.jpg', 
      category: 'popcorn'
    },
    {
      id: 'p4',
      name: 'Caramel Popcorn',
      description: 'Sweet caramel glazed popcorn',
      price: 8.99,
      imageUrl: 'https://example.com/caramel-popcorn.jpg',
      category: 'popcorn'
    },
    
    // Snacks
    {
      id: 's1',
      name: 'Nachos',
      description: 'Crispy tortilla chips with cheese sauce',
      price: 7.99,
      imageUrl: 'https://example.com/nachos.jpg',
      category: 'snacks'
    },
    {
      id: 's2',
      name: 'Chicken Tenders',
      description: 'Crispy chicken tenders with dipping sauce',
      price: 9.99,
      imageUrl: 'https://example.com/chicken-tenders.jpg',
      category: 'snacks'
    },
    {
      id: 's3',
      name: 'Pretzel Bites',
      description: 'Warm soft pretzel bites with cheese dip',
      price: 6.99,
      imageUrl: 'https://example.com/pretzel-bites.jpg',
      category: 'snacks'
    },
    {
      id: 's4',
      name: 'Candy Selection',
      description: 'Choose from a variety of movie theater candy',
      price: 4.99,
      imageUrl: 'https://example.com/candy.jpg',
      category: 'snacks'
    },
    
    // Drinks
    {
      id: 'd1',
      name: 'Small Soda',
      description: 'Your choice of fountain drink',
      price: 4.99,
      imageUrl: 'https://example.com/small-soda.jpg',
      category: 'drinks'
    },
    {
      id: 'd2',
      name: 'Medium Soda',
      description: 'Your choice of fountain drink',
      price: 5.99,
      imageUrl: 'https://example.com/medium-soda.jpg',
      category: 'drinks'
    },
    {
      id: 'd3',
      name: 'Large Soda',
      description: 'Your choice of fountain drink',
      price: 6.99,
      imageUrl: 'https://example.com/large-soda.jpg',
      category: 'drinks'
    },
    {
      id: 'd4',
      name: 'Bottled Water',
      description: 'Refreshing purified water',
      price: 3.99,
      imageUrl: 'https://example.com/water.jpg',
      category: 'drinks'
    },
    
    // Combos
    {
      id: 'c1',
      name: 'Movie Lover Combo',
      description: 'Large popcorn, 2 large drinks, and candy',
      price: 19.99,
      imageUrl: 'https://example.com/combo1.jpg',
      category: 'combos'
    },
    {
      id: 'c2',
      name: 'Date Night Combo',
      description: 'Medium popcorn, 2 medium drinks, and shared nachos',
      price: 24.99,
      imageUrl: 'https://example.com/combo2.jpg',
      category: 'combos'
    },
    {
      id: 'c3',
      name: 'Family Pack',
      description: 'Large popcorn, 4 medium drinks, and 2 snacks',
      price: 34.99,
      imageUrl: 'https://example.com/combo3.jpg',
      category: 'combos'
    }
  ];
  
  const filteredItems = menuItems.filter(item => item.category === activeCategory);
  
  const addToCart = (item: MenuItem) => {
    setCartItems(prevCart => {
      const existingItemIndex = prevCart.findIndex(cartItem => cartItem.id === item.id);
      
      if (existingItemIndex >= 0) {
        // Item already in cart, increase quantity
        const updatedCart = [...prevCart];
        updatedCart[existingItemIndex] = {
          ...updatedCart[existingItemIndex],
          quantity: updatedCart[existingItemIndex].quantity + 1
        };
        return updatedCart;
      } else {
        // Add new item to cart
        return [...prevCart, { ...item, quantity: 1 }];
      }
    });
  };
  
  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };
  
  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
  };
  
  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
                  <ThemedText type="title" style={{ color: '#fff' }}>Food & Drinks</ThemedText>
        {cartItems.length > 0 && (
          <TouchableOpacity 
            style={styles.cartButton}
          >
            <IconSymbol name="cart.fill" size={22} color="#10b981" />
            <ThemedView style={styles.cartBadge}>
              <ThemedText style={styles.cartBadgeText}>{getTotalItems()}</ThemedText>
            </ThemedView>
          </TouchableOpacity>
        )}
      </ThemedView>
      
      <ThemedView style={styles.categoryTabs}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <TouchableOpacity 
            style={[styles.categoryTab, activeCategory === 'popcorn' && styles.activeTab]}
            onPress={() => setActiveCategory('popcorn')}
          >
            <IconSymbol 
              name="popcorn.fill" 
              size={18} 
              color={activeCategory === 'popcorn' ? '#10b981' : '#777'} 
            />
            <ThemedText style={[
              styles.categoryText,
              activeCategory === 'popcorn' && styles.activeCategoryText
            ]}>
              Popcorn
            </ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.categoryTab, activeCategory === 'snacks' && styles.activeTab]}
            onPress={() => setActiveCategory('snacks')}
          >
            <IconSymbol 
              name="handbag.fill" 
              size={18} 
              color={activeCategory === 'snacks' ? '#10b981' : '#777'} 
            />
            <ThemedText style={[
              styles.categoryText,
              activeCategory === 'snacks' && styles.activeCategoryText
            ]}>
              Snacks
            </ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.categoryTab, activeCategory === 'drinks' && styles.activeTab]}
            onPress={() => setActiveCategory('drinks')}
          >
            <IconSymbol 
              name="cup.and.saucer.fill" 
              size={18} 
              color={activeCategory === 'drinks' ? '#10b981' : '#777'} 
            />
            <ThemedText style={[
              styles.categoryText,
              activeCategory === 'drinks' && styles.activeCategoryText
            ]}>
              Drinks
            </ThemedText>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.categoryTab, activeCategory === 'combos' && styles.activeTab]}
            onPress={() => setActiveCategory('combos')}
          >
            <ThemedText style={[
              styles.categoryText,
              activeCategory === 'combos' && styles.activeCategoryText
            ]}>
              Combos
            </ThemedText>
          </TouchableOpacity>
        </ScrollView>
      </ThemedView>
      
      <ScrollView style={styles.menuList} showsVerticalScrollIndicator={false}>
        {filteredItems.map(item => (
          <ThemedView key={item.id} style={styles.menuItem}>
            <ThemedView style={styles.menuItemContent}>
              <ThemedText type="defaultSemiBold" style={styles.menuItemName}>
                {item.name}
              </ThemedText>
              <ThemedText style={styles.menuItemDescription} numberOfLines={2}>
                {item.description}
              </ThemedText>
              <ThemedView style={styles.menuItemBottom}>
                <ThemedText type="defaultSemiBold" style={styles.menuItemPrice}>
                  ${item.price.toFixed(2)}
                </ThemedText>
                <TouchableOpacity 
                  style={styles.addButton}
                  onPress={() => addToCart(item)}
                >
                  <IconSymbol name="plus" size={16} color="#fff" />
                  <ThemedText style={styles.addButtonText}>Add</ThemedText>
                </TouchableOpacity>
              </ThemedView>
            </ThemedView>
          </ThemedView>
        ))}
      </ScrollView>
      
      {cartItems.length > 0 && (
        <ThemedView style={styles.cartPreview}>
          <ThemedView style={styles.cartInfo}>
            <ThemedText style={styles.cartTotal}>
              Total: ${getTotalPrice().toFixed(2)}
            </ThemedText>
            <ThemedText style={styles.cartItems}>
              {getTotalItems()} item{getTotalItems() !== 1 ? 's' : ''}
            </ThemedText>
          </ThemedView>
          <TouchableOpacity 
            style={styles.viewCartButton}
          >
            <ThemedText style={styles.viewCartText}>View Cart</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#121212',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingBottom: 16,
    paddingHorizontal: 20,
    backgroundColor: '#1a1a1a',
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  cartButton: {
    position: 'relative',
    padding: 4,
  },
  cartBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    backgroundColor: '#10b981',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  categoryTabs: {
    backgroundColor: '#1a1a1a',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  categoryTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 20,
  },
  activeTab: {
    backgroundColor: '#1e3c31',
  },
  categoryText: {
    marginLeft: 8,
    color: '#888',
  },
  activeCategoryText: {
    color: '#10b981',
    fontWeight: '500',
  },
  menuList: {
    flex: 1,
    padding: 16,
  },
  menuItem: {
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 5,
  },
  menuItemContent: {
    flex: 1,
  },
  menuItemName: {
    fontSize: 18,
    color: '#fff',
    marginBottom: 4,
  },
  menuItemDescription: {
    fontSize: 14,
    color: '#888',
    marginBottom: 16,
  },
  menuItemBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  menuItemPrice: {
    fontSize: 18,
    color: '#888',
    fontWeight: '600',
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#10b981',
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    marginLeft: 4,
  },
  cartPreview: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  cartInfo: {
    flex: 1,
  },
  cartTotal: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
  },
  cartItems: {
    fontSize: 14,
    color: '#888',
  },
  viewCartButton: {
    backgroundColor: '#10b981',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  viewCartText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
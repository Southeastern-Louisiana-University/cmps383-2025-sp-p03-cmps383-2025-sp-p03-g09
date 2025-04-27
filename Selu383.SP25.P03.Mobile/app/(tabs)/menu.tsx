import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';
import AsyncStorage from '@react-native-async-storage/async-storage';

const BASE_URL = 'http://192.168.1.13:5249';

// Types
interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  locationId: number;
}

interface CartItem extends MenuItem {
  quantity: number;
}

interface Location {
  id: number;
  name: string;
}

export default function FoodMenuScreen() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [selectedLocationId, setSelectedLocationId] = useState<number | null>(null);
  const [activeCategory, setActiveCategory] = useState<'food' | 'drinks'>('food');

  useEffect(() => {
    fetchFoodItems();
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      loadSelectedLocation();
    }, [])
  );

  const fetchFoodItems = async () => {
    try {
      const res = await fetch(`${BASE_URL}/api/fooditems`);
      if (!res.ok) throw new Error('Failed to fetch food items.');
      const data = await res.json();
      setMenuItems(data);
    } catch (err) {
      console.error('Error fetching food items:', err);
    }
  };

  const loadSelectedLocation = async () => {
    try {
      const stored = await AsyncStorage.getItem('selectedLocation');
      if (stored) {
        const parsed: Location = JSON.parse(stored);
        setSelectedLocationId(parsed.id);
      }
    } catch (err) {
      console.error('Error loading selected location:', err);
    }
  };

  const filteredItems = menuItems
    .filter(item => item.locationId === selectedLocationId)
    .filter(item => {
      if (activeCategory === 'food') {
        return !(
          item.name.toLowerCase().includes('coca') ||
          item.name.toLowerCase().includes('coke') ||
          item.name.toLowerCase().includes('sprite') ||
          item.name.toLowerCase().includes('fanta') ||
          item.name.toLowerCase().includes('dr pepper') ||
          item.name.toLowerCase().includes('root beer') ||
          item.name.toLowerCase().includes('lemonade') ||
          item.name.toLowerCase().includes('water')
        );
      } else if (activeCategory === 'drinks') {
        return (
          item.name.toLowerCase().includes('coca') ||
          item.name.toLowerCase().includes('coke') ||
          item.name.toLowerCase().includes('sprite') ||
          item.name.toLowerCase().includes('fanta') ||
          item.name.toLowerCase().includes('dr pepper') ||
          item.name.toLowerCase().includes('root beer') ||
          item.name.toLowerCase().includes('lemonade') ||
          item.name.toLowerCase().includes('water')
        );
      }
      return true;
    });

  const addToCart = (item: MenuItem) => {
    setCartItems(prev => {
      const existing = prev.find(cartItem => cartItem.id === item.id);
      if (existing) {
        return prev.map(cartItem =>
          cartItem.id === item.id ? { ...cartItem, quantity: cartItem.quantity + 1 } : cartItem
        );
      } else {
        return [...prev, { ...item, quantity: 1 }];
      }
    });
  };

  const getTotalItems = () => cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const getTotalPrice = () => cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);


  return (
    <ThemedView style={styles.container}>
      <ThemedView style={styles.header}>
        <ThemedText type="title" style={{ color: '#fff' }}>Food & Drinks</ThemedText>
        {cartItems.length > 0 && (
          <TouchableOpacity style={styles.cartButton}>
            <IconSymbol name="cart.fill" size={22} color="#10b981" />
            <ThemedView style={styles.cartBadge}>
              <ThemedText style={styles.cartBadgeText}>{getTotalItems()}</ThemedText>
            </ThemedView>
          </TouchableOpacity>
        )}
      </ThemedView>

      <ThemedView style={styles.categoryTabs}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {(['food', 'drinks'] as const).map(category => (
            <TouchableOpacity
              key={category}
              style={[styles.categoryTab, activeCategory === category && styles.activeTab]}
              onPress={() => setActiveCategory(category)}
            >
              <ThemedText style={[
                styles.categoryText,
                activeCategory === category && styles.activeCategoryText
              ]}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </ThemedText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ThemedView>

      <ScrollView style={styles.menuList} showsVerticalScrollIndicator={false}>
        {filteredItems.map(item => (
          <ThemedView key={item.id} style={styles.menuItem}>
            {item.imageUrl && (
              <Image
                source={{ uri: item.imageUrl }}
                style={styles.menuItemImage}
              />
            )}
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
          <TouchableOpacity style={styles.viewCartButton}>
            <ThemedText style={styles.viewCartText}>View Cart</ThemedText>
          </TouchableOpacity>
        </ThemedView>
      )}
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  header: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingTop: 60, paddingBottom: 16, paddingHorizontal: 20,
    backgroundColor: '#1a1a1a', borderBottomWidth: 1, borderBottomColor: '#333',
  },
  cartButton: { position: 'relative', padding: 4 },
  cartBadge: {
    position: 'absolute', top: -2, right: -2,
    backgroundColor: '#10b981', borderRadius: 10,
    minWidth: 20, height: 20, justifyContent: 'center', alignItems: 'center',
  },
  cartBadgeText: { color: '#fff', fontSize: 12, fontWeight: 'bold' },
  categoryTabs: { backgroundColor: '#1a1a1a', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#333' },
  categoryTab: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, marginHorizontal: 4, borderRadius: 20 },
  activeTab: { backgroundColor: '#1e3c31' },
  categoryText: { marginLeft: 8, color: '#888' },
  activeCategoryText: { color: '#10b981', fontWeight: '500' },
  menuList: { flex: 1, padding: 16 },
  menuItem: { backgroundColor: '#1a1a1a', borderRadius: 10, marginBottom: 16, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 5 },
  menuItemImage: { width: '100%', height: 150, borderRadius: 8, marginBottom: 10 },
  menuItemContent: { flex: 1 },
  menuItemName: { fontSize: 18, color: '#fff', marginBottom: 4 },
  menuItemDescription: { fontSize: 14, color: '#888', marginBottom: 16 },
  menuItemBottom: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  menuItemPrice: { fontSize: 18, color: '#888', fontWeight: '600' },
  addButton: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#10b981', paddingVertical: 8, paddingHorizontal: 14, borderRadius: 6 },
  addButtonText: { color: '#fff', fontWeight: 'bold', marginLeft: 4 },
  cartPreview: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#1a1a1a', paddingVertical: 12, paddingHorizontal: 20, borderTopWidth: 1, borderTopColor: '#333' },
  cartInfo: { flex: 1 },
  cartTotal: { fontSize: 16, fontWeight: 'bold', color: '#fff' },
  cartItems: { fontSize: 14, color: '#888' },
  viewCartButton: { backgroundColor: '#10b981', paddingVertical: 10, paddingHorizontal: 16, borderRadius: 8 },
  viewCartText: { color: '#fff', fontWeight: 'bold' }
});

import React, { useState, useEffect } from 'react';
import { StyleSheet, ScrollView, TouchableOpacity, Image, View, Text } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';

import { IconSymbol } from '@/components/ui/IconSymbol';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { baseUrl } from '@/constants/constants';


// Types
interface MenuItem {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl?: string;
  locationId: number;
  isVegan?: boolean; 
}

interface Location {
  id: number;
  name: string;
}

export default function FoodMenuScreen() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
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
      const res = await fetch(`${baseUrl}/api/fooditems`);
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

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Food & Drinks</Text>
      </View>

      <View style={styles.categoryTabs}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {(['food', 'drinks'] as const).map(category => (
            <TouchableOpacity
              key={category}
              style={[styles.categoryTab, activeCategory === category && styles.activeTab]}
              onPress={() => setActiveCategory(category)}
            >
              <Text style={[
                styles.categoryText,
                activeCategory === category && styles.activeCategoryText
              ]}>
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.menuList} showsVerticalScrollIndicator={false}>
        {filteredItems.map(item => (
          <View key={item.id} style={styles.menuItem}>
            {item.imageUrl && (
              <Image
                source={{ uri: item.imageUrl }}
                style={styles.menuItemImage}
              />
            )}
            <View style={styles.menuItemContent}>
              <View style={styles.menuItemHeader}>
                <Text style={styles.menuItemName}>
                  {item.name}
                </Text>
                {item.isVegan && (
                  <View style={styles.veganTag}>
                    <Text style={styles.veganText}>Vegan</Text>
                  </View>
                )}
              </View>
              <Text style={styles.menuItemDescription} numberOfLines={2}>
                {item.description}
              </Text>
              <Text style={styles.menuItemPrice}>
                ${item.price.toFixed(2)}
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#121212' },
  header: {
    flexDirection: 'row', justifyContent: 'center', alignItems: 'center',
    paddingTop: 60, paddingBottom: 16, paddingHorizontal: 20,
    backgroundColor: '#1a1a1a', borderBottomWidth: 1, borderBottomColor: '#333',
  },
  headerTitle: { fontSize: 22, color: '#fff', fontWeight: 'bold' },
  categoryTabs: { backgroundColor: '#1a1a1a', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#333' },
  categoryTab: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 8, marginHorizontal: 4, borderRadius: 20 },
  activeTab: { backgroundColor: '#1e3c31' },
  categoryText: { marginLeft: 8, color: '#888' },
  activeCategoryText: { color: '#10b981', fontWeight: '500' },
  menuList: { flex: 1, padding: 16 },
  menuItem: { backgroundColor: '#1a1a1a', borderRadius: 10, marginBottom: 16, padding: 16, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.3, shadowRadius: 4, elevation: 5 },
  menuItemImage: { width: '100%', height: 150, borderRadius: 8, marginBottom: 10 },
  menuItemContent: { 
    flex: 1,
    backgroundColor: '#1a1a1a',
    borderRadius: 10,
    padding: 10,
  },
  menuItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  menuItemName: { fontSize: 18, color: '#fff', fontWeight: 'bold' },
  menuItemDescription: { fontSize: 14, color: '#888', marginBottom: 16 },
  menuItemPrice: { fontSize: 18, color: '#10b981', fontWeight: '600' },
  veganTag: {
    backgroundColor: '#10b981',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  veganText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
});

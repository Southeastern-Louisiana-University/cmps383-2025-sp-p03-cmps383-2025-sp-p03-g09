import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Linking 
} from 'react-native';
import { Stack } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';

export default function AboutScreen() {
  // Function to handle phone call
  const handlePhoneCall = () => {
    Linking.openURL('tel:9855492000');
  };

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'About',
          headerStyle: { backgroundColor: '#000000' },
          headerTintColor: '#ffffff',
        }}
      />
      
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.contentContainer}>
          {/* About Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>About Lion's Den Cinema</Text>
            
            <Text style={styles.paragraph}>
              Lion's Den Cinema was established in 2025 with one mission in mind — to bring movie lovers the best cinematic experience in the region. Whether you're here for a blockbuster, a local indie premiere, or just a good bucket of popcorn, we've got something for everyone.
            </Text>
            
            <Text style={styles.paragraph}>
              Our theaters are equipped with the latest in audio and visual technology to immerse you in the world of film like never before. We also offer online seat selection, reserved seating, and an app to order food right to your seat.
            </Text>
          </View>
          
          {/* Contact Us Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Contact Us</Text>
            
            <View style={styles.contactCard}>
              <View style={styles.contactItem}>
                <Text style={styles.contactLabel}>Southeastern Louisiana University</Text>
              </View>
              
              <View style={styles.contactItem}>
                <Text style={styles.contactText}>500 W University Ave</Text>
              </View>
              
              <View style={styles.contactItem}>
                <Text style={styles.contactText}>Hammond, LA 70402</Text>
              </View>
              
              <TouchableOpacity style={styles.contactItem} onPress={handlePhoneCall}>
                <Text style={styles.contactText}>Phone: (985) 549-2000</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Our Locations Section */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Our Locations</Text>
            
            <View style={styles.locationsList}>
              <View style={styles.locationCard}>
                <Text style={styles.locationName}>Lion's Den New Orleans</Text>
                <Text style={styles.locationAddress}>636 N Broad St, New Orleans, LA 70119</Text>
                <TouchableOpacity style={styles.locationButton}>
                  <Text style={styles.locationButtonText}>View Showtimes</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.locationCard}>
                <Text style={styles.locationName}>Lion's Den New York</Text>
                <Text style={styles.locationAddress}>570 2nd Ave, New York, NY 10016</Text>
                <TouchableOpacity style={styles.locationButton}>
                  <Text style={styles.locationButtonText}>View Showtimes</Text>
                </TouchableOpacity>
              </View>
              
              <View style={styles.locationCard}>
                <Text style={styles.locationName}>Lion's Den Los Angeles</Text>
                <Text style={styles.locationAddress}>4020 Marlton Ave, Los Angeles, CA 90008</Text>
                <TouchableOpacity style={styles.locationButton}>
                  <Text style={styles.locationButtonText}>View Showtimes</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
          
          {/* Bottom Space */}
          <View style={styles.bottomSpace} />
        </View>
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
  contentContainer: {
    padding: 20,
  },
  section: {
    marginBottom: 40,
  },
  sectionTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 16,
  },
  paragraph: {
    fontSize: 16,
    lineHeight: 24,
    color: '#E0E0E0',
    marginBottom: 16,
  },
  contactCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#10b981',
  },
  contactItem: {
    marginBottom: 8,
  },
  contactLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  contactText: {
    fontSize: 16,
    color: '#E0E0E0',
  },
  locationsList: {
    gap: 16,
  },
  locationCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
  },
  locationName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  locationAddress: {
    fontSize: 16,
    color: '#E0E0E0',
    marginBottom: 12,
  },
  locationButton: {
    backgroundColor: '#10b981',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 4,
    alignSelf: 'flex-start',
  },
  locationButtonText: {
    color: '#FFFFFF',
    fontWeight: '500',
  },
  bottomSpace: {
    height: 40,
  },
});
import React from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  Linking,
  Dimensions
} from 'react-native';
import { Stack } from 'expo-router';
import { ThemedView } from '@/components/ThemedView';
import { ThemedText } from '@/components/ThemedText';
import { IconSymbol } from '@/components/ui/IconSymbol';

const SCREEN_HEIGHT = Dimensions.get('window').height;

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
      
      <ScrollView 
        style={styles.scrollView} 
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
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
  scrollViewContent: {
    flexGrow: 1,
    justifyContent: 'center', // Centers content vertically
    paddingTop: 40, // Add some space from the top
  },
  contentContainer: {
    padding: 20,
    maxWidth: 600, // Limit width on larger devices
    alignSelf: 'center', // Center horizontally
    width: '100%',
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
  bottomSpace: {
    height: 40,
  },
});
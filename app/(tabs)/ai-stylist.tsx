
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';
import { GlassView } from 'expo-glass-effect';
import { useBodyAnalysis } from '@/hooks/useBodyAnalysis';
import { useSavedOutfits } from '@/hooks/useSavedOutfits';

interface OutfitRecommendation {
  id: string;
  title: string;
  description: string;
  items: string[];
  occasion: string;
  season: string;
  imageUrl?: string;
}

export default function AIStylistScreen() {
  const { measurements } = useBodyAnalysis();
  const { outfits } = useSavedOutfits();
  const [recommendations, setRecommendations] = useState<OutfitRecommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedOccasion, setSelectedOccasion] = useState<string>('casual');

  const occasions = [
    { id: 'casual', label: 'Casual', icon: 'home' },
    { id: 'work', label: 'Work', icon: 'work' },
    { id: 'formal', label: 'Formal', icon: 'event' },
    { id: 'sport', label: 'Sport', icon: 'directions-run' },
    { id: 'party', label: 'Party', icon: 'celebration' },
  ];

  const handleGetRecommendations = async () => {
    if (!measurements) {
      Alert.alert('No Measurements', 'Please complete your body scan first to get personalized recommendations.');
      return;
    }

    setLoading(true);
    try {
      // TODO: Backend Integration - Call OpenAI GPT-5.2 API for outfit recommendations
      // Send user measurements, saved outfits, and occasion preference
      console.log('Getting AI recommendations for:', {
        measurements,
        occasion: selectedOccasion,
        wardrobeSize: outfits.length,
      });

      // Mock recommendations for now
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const mockRecommendations: OutfitRecommendation[] = [
        {
          id: '1',
          title: 'Classic Casual Look',
          description: 'A timeless combination that flatters your body type. The fitted top balances your proportions perfectly.',
          items: [
            'White fitted t-shirt',
            'High-waisted blue jeans',
            'White sneakers',
            'Denim jacket',
          ],
          occasion: selectedOccasion,
          season: 'Spring/Fall',
          imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=400',
        },
        {
          id: '2',
          title: 'Elegant Evening Outfit',
          description: 'This outfit accentuates your best features while maintaining comfort and style.',
          items: [
            'Black midi dress',
            'Heeled ankle boots',
            'Statement earrings',
            'Clutch bag',
          ],
          occasion: selectedOccasion,
          season: 'All seasons',
          imageUrl: 'https://images.unsplash.com/photo-1515372039744-b8f02a3ae446?w=400',
        },
        {
          id: '3',
          title: 'Smart Casual Mix',
          description: 'Perfect for your body measurements. The proportions create a balanced silhouette.',
          items: [
            'Blazer',
            'Striped top',
            'Dark wash jeans',
            'Loafers',
          ],
          occasion: selectedOccasion,
          season: 'Year-round',
          imageUrl: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?w=400',
        },
      ];

      setRecommendations(mockRecommendations);
    } catch (error) {
      console.log('Error getting recommendations:', error);
      Alert.alert('Error', 'Failed to get outfit recommendations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const renderRecommendationCard = (rec: OutfitRecommendation) => (
    <GlassView key={rec.id} style={styles.recommendationCard} glassEffectStyle="regular">
      {rec.imageUrl && (
        <Image source={{ uri: rec.imageUrl }} style={styles.recommendationImage} />
      )}
      <View style={styles.recommendationContent}>
        <Text style={styles.recommendationTitle}>{rec.title}</Text>
        <Text style={styles.recommendationDescription}>{rec.description}</Text>
        
        <View style={styles.metaInfo}>
          <View style={styles.metaItem}>
            <IconSymbol ios_icon_name="calendar" android_material_icon_name="event" size={14} color={colors.textSecondary} />
            <Text style={styles.metaText}>{rec.season}</Text>
          </View>
          <View style={styles.metaItem}>
            <IconSymbol ios_icon_name="tag" android_material_icon_name="local-offer" size={14} color={colors.textSecondary} />
            <Text style={styles.metaText}>{rec.occasion}</Text>
          </View>
        </View>

        <View style={styles.itemsList}>
          <Text style={styles.itemsTitle}>Items:</Text>
          {rec.items.map((item, index) => (
            <View key={index} style={styles.itemRow}>
              <Text style={styles.itemBullet}>•</Text>
              <Text style={styles.itemText}>{item}</Text>
            </View>
          ))}
        </View>
      </View>
    </GlassView>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.title}>AI Stylist</Text>
        <Text style={styles.subtitle}>Get personalized outfit recommendations</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <GlassView style={styles.occasionSelector} glassEffectStyle="regular">
          <Text style={styles.sectionTitle}>Select Occasion</Text>
          <View style={styles.occasionGrid}>
            {occasions.map((occasion) => (
              <TouchableOpacity
                key={occasion.id}
                style={[
                  styles.occasionButton,
                  selectedOccasion === occasion.id && styles.occasionButtonActive,
                ]}
                onPress={() => setSelectedOccasion(occasion.id)}
              >
                <IconSymbol
                  ios_icon_name={occasion.icon}
                  android_material_icon_name={occasion.icon}
                  size={24}
                  color={selectedOccasion === occasion.id ? '#fff' : colors.text}
                />
                <Text
                  style={[
                    styles.occasionLabel,
                    selectedOccasion === occasion.id && styles.occasionLabelActive,
                  ]}
                >
                  {occasion.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </GlassView>

        {measurements && (
          <GlassView style={styles.measurementsInfo} glassEffectStyle="regular">
            <IconSymbol ios_icon_name="checkmark.circle" android_material_icon_name="check-circle" size={20} color={colors.primary} />
            <Text style={styles.measurementsText}>
              Body measurements available - Ready for personalized recommendations
            </Text>
          </GlassView>
        )}

        <TouchableOpacity
          style={[styles.generateButton, loading && styles.generateButtonDisabled]}
          onPress={handleGetRecommendations}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <>
              <IconSymbol ios_icon_name="sparkles" android_material_icon_name="auto-awesome" size={20} color="#fff" />
              <Text style={styles.generateButtonText}>Generate Recommendations</Text>
            </>
          )}
        </TouchableOpacity>

        {recommendations.length > 0 && (
          <View style={styles.recommendationsSection}>
            <Text style={styles.sectionTitle}>Your Personalized Outfits</Text>
            {recommendations.map(renderRecommendationCard)}
          </View>
        )}

        {!loading && recommendations.length === 0 && (
          <View style={styles.emptyState}>
            <IconSymbol ios_icon_name="sparkles" android_material_icon_name="auto-awesome" size={60} color={colors.textSecondary} />
            <Text style={styles.emptyText}>AI-Powered Styling</Text>
            <Text style={styles.emptySubtext}>
              Get personalized outfit recommendations based on your body measurements and style preferences
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingTop: Platform.OS === 'android' ? 48 : 0,
  },
  header: {
    padding: 20,
    paddingBottom: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: colors.textSecondary,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
    paddingBottom: 100,
  },
  occasionSelector: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: colors.cardBackground,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 12,
  },
  occasionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 10,
  },
  occasionButton: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: colors.cardBackground,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  occasionButtonActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  occasionLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    marginTop: 6,
  },
  occasionLabelActive: {
    color: '#fff',
  },
  measurementsInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
    backgroundColor: colors.cardBackground,
  },
  measurementsText: {
    fontSize: 13,
    color: colors.text,
    marginLeft: 8,
    flex: 1,
  },
  generateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    gap: 8,
  },
  generateButtonDisabled: {
    opacity: 0.6,
  },
  generateButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#fff',
  },
  recommendationsSection: {
    marginTop: 8,
  },
  recommendationCard: {
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    backgroundColor: colors.cardBackground,
  },
  recommendationImage: {
    width: '100%',
    height: 200,
    resizeMode: 'cover',
  },
  recommendationContent: {
    padding: 16,
  },
  recommendationTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  recommendationDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
    marginBottom: 12,
  },
  metaInfo: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  itemsList: {
    marginTop: 8,
  },
  itemsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    marginBottom: 8,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  itemBullet: {
    fontSize: 14,
    color: colors.text,
    marginRight: 8,
  },
  itemText: {
    fontSize: 14,
    color: colors.text,
    flex: 1,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '600',
    color: colors.text,
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: colors.textSecondary,
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
});


import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { useAvatarStorage, StyleProfile } from '@/hooks/useAvatarStorage';

const FIT_OPTIONS = [
  { value: 'tight', label: 'Tight', icon: 'arrow.down.right.and.arrow.up.left' },
  { value: 'fitted', label: 'Fitted', icon: 'arrow.left.and.right' },
  { value: 'regular', label: 'Regular', icon: 'square' },
  { value: 'loose', label: 'Loose', icon: 'arrow.up.left.and.arrow.down.right' },
  { value: 'oversized', label: 'Oversized', icon: 'square.stack.3d.up' },
];

const INSECURITY_OPTIONS = [
  'Arms', 'Stomach', 'Thighs', 'Hips', 'Chest', 'Shoulders', 'Calves', 'None'
];

const STYLE_OPTIONS = [
  'Casual', 'Formal', 'Sporty', 'Streetwear', 'Minimalist', 
  'Bohemian', 'Vintage', 'Preppy', 'Edgy', 'Classic'
];

export default function StyleQuestionnaireScreen() {
  const router = useRouter();
  const { saveStyleProfile } = useAvatarStorage();
  const [currentStep, setCurrentStep] = useState(1);
  const [fitPreference, setFitPreference] = useState<string>('');
  const [insecurities, setInsecurities] = useState<string[]>([]);
  const [stylePreferences, setStylePreferences] = useState<string[]>([]);

  const toggleInsecurity = (item: string) => {
    if (item === 'None') {
      setInsecurities(['None']);
    } else {
      const filtered = insecurities.filter(i => i !== 'None');
      if (insecurities.includes(item)) {
        setInsecurities(filtered.filter(i => i !== item));
      } else {
        setInsecurities([...filtered, item]);
      }
    }
  };

  const toggleStyle = (item: string) => {
    if (stylePreferences.includes(item)) {
      setStylePreferences(stylePreferences.filter(i => i !== item));
    } else {
      setStylePreferences([...stylePreferences, item]);
    }
  };

  const handleNext = () => {
    if (currentStep === 1 && !fitPreference) {
      Alert.alert('Selection Required', 'Please select your fit preference');
      return;
    }
    if (currentStep === 2 && insecurities.length === 0) {
      Alert.alert('Selection Required', 'Please select at least one option');
      return;
    }
    if (currentStep === 3 && stylePreferences.length === 0) {
      Alert.alert('Selection Required', 'Please select at least one style');
      return;
    }

    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    const profile: StyleProfile = {
      fitPreference: fitPreference as any,
      insecurities,
      stylePreferences,
      completedAt: new Date(),
    };
    await saveStyleProfile(profile);
    Alert.alert('Profile Complete!', 'Your style profile has been saved', [
      { text: 'OK', onPress: () => router.replace('/(tabs)/(home)') }
    ]);
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}>
          <Text style={styles.stepText}>Step {currentStep} of 3</Text>
          <Text style={styles.title}>
            {currentStep === 1 && 'How do you like your clothes to fit?'}
            {currentStep === 2 && 'Any areas you prefer to minimize?'}
            {currentStep === 3 && 'What\'s your style?'}
          </Text>
        </View>

        {currentStep === 1 && (
          <View style={styles.optionsContainer}>
            {FIT_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={[
                  styles.fitOption,
                  fitPreference === option.value && styles.selectedOption
                ]}
                onPress={() => setFitPreference(option.value)}
              >
                <IconSymbol 
                  ios_icon_name={option.icon} 
                  android_material_icon_name="checkroom"
                  size={32} 
                  color={fitPreference === option.value ? colors.accent : colors.text} 
                />
                <Text style={[
                  styles.optionText,
                  fitPreference === option.value && styles.selectedText
                ]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {currentStep === 2 && (
          <View style={styles.optionsContainer}>
            {INSECURITY_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.chipOption,
                  insecurities.includes(option) && styles.selectedChip
                ]}
                onPress={() => toggleInsecurity(option)}
              >
                <Text style={[
                  styles.chipText,
                  insecurities.includes(option) && styles.selectedChipText
                ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {currentStep === 3 && (
          <View style={styles.optionsContainer}>
            {STYLE_OPTIONS.map((option) => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.chipOption,
                  stylePreferences.includes(option) && styles.selectedChip
                ]}
                onPress={() => toggleStyle(option)}
              >
                <Text style={[
                  styles.chipText,
                  stylePreferences.includes(option) && styles.selectedChipText
                ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        <View style={styles.buttonContainer}>
          {currentStep > 1 && (
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => setCurrentStep(currentStep - 1)}
            >
              <Text style={styles.backButtonText}>Back</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={styles.nextButton}
            onPress={handleNext}
          >
            <Text style={styles.nextButtonText}>
              {currentStep === 3 ? 'Complete' : 'Next'}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  content: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    marginBottom: 32,
  },
  stepText: {
    fontSize: 14,
    color: colors.accent,
    marginBottom: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
  },
  optionsContainer: {
    gap: 12,
    marginBottom: 32,
  },
  fitOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.backgroundAlt,
    padding: 20,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedOption: {
    borderColor: colors.accent,
    backgroundColor: colors.card,
  },
  optionText: {
    fontSize: 18,
    color: colors.text,
    marginLeft: 16,
  },
  selectedText: {
    color: colors.accent,
    fontWeight: 'bold',
  },
  chipOption: {
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
    backgroundColor: colors.backgroundAlt,
    alignSelf: 'flex-start',
    marginRight: 8,
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedChip: {
    backgroundColor: colors.card,
    borderColor: colors.accent,
  },
  chipText: {
    fontSize: 16,
    color: colors.text,
  },
  selectedChipText: {
    color: colors.accent,
    fontWeight: 'bold',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  backButton: {
    flex: 1,
    backgroundColor: colors.backgroundAlt,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  backButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  nextButton: {
    flex: 2,
    backgroundColor: colors.primary,
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
});

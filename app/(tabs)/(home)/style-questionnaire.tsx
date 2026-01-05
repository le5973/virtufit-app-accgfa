
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
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IconSymbol } from '@/components/IconSymbol';

const FIT_OPTIONS = ['Tight', 'Fitted', 'Regular', 'Relaxed', 'Oversized'];

const INSECURITY_OPTIONS = [
  'Arms',
  'Stomach',
  'Thighs',
  'Hips',
  'Chest',
  'Shoulders',
  'None',
];

const BRAND_OPTIONS = [
  'Zara',
  'H&M',
  'Nike',
  'Adidas',
  'Lululemon',
  'Gap',
  'Uniqlo',
  'ASOS',
  'Urban Outfitters',
  'Forever 21',
  'Other',
];

const STYLE_QUESTIONNAIRE_KEY = '@style_questionnaire_completed';

export default function StyleQuestionnaireScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [fitPreference, setFitPreference] = useState('');
  const [insecurities, setInsecurities] = useState<string[]>([]);
  const [brands, setBrands] = useState<string[]>([]);

  const toggleInsecurity = (item: string) => {
    if (insecurities.includes(item)) {
      setInsecurities(insecurities.filter((i) => i !== item));
    } else {
      setInsecurities([...insecurities, item]);
    }
  };

  const toggleBrand = (item: string) => {
    if (brands.includes(item)) {
      setBrands(brands.filter((i) => i !== item));
    } else {
      setBrands([...brands, item]);
    }
  };

  const handleNext = () => {
    if (step === 1 && !fitPreference) {
      Alert.alert('Please select a fit preference');
      return;
    }
    if (step === 2 && insecurities.length === 0) {
      Alert.alert('Please select at least one option');
      return;
    }
    if (step === 3 && brands.length === 0) {
      Alert.alert('Please select at least one brand');
      return;
    }
    setStep(step + 1);
  };

  const handleComplete = async () => {
    if (brands.length === 0) {
      Alert.alert('Please select at least one brand');
      return;
    }

    const styleProfile = {
      fitPreference,
      insecurities,
      brands,
      completedAt: new Date().toISOString(),
    };

    await AsyncStorage.setItem('@style_profile', JSON.stringify(styleProfile));
    await AsyncStorage.setItem(STYLE_QUESTIONNAIRE_KEY, 'true');

    router.replace('/(tabs)/(home)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.logo}>Ervenista</Text>
          <Text style={styles.stepIndicator}>
            Step {step} of 3
          </Text>
        </View>

        {step === 1 && (
          <View style={styles.questionContainer}>
            <Text style={styles.question}>How do you like your clothes to fit</Text>
            <View style={styles.optionsContainer}>
              {FIT_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.optionButton,
                    fitPreference === option && styles.optionButtonSelected,
                  ]}
                  onPress={() => setFitPreference(option)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      fitPreference === option && styles.optionTextSelected,
                    ]}
                  >
                    {option}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {step === 2 && (
          <View style={styles.questionContainer}>
            <Text style={styles.question}>
              Any areas you prefer to keep covered or feel less confident about
            </Text>
            <View style={styles.optionsContainer}>
              {INSECURITY_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.optionButton,
                    insecurities.includes(option) && styles.optionButtonSelected,
                  ]}
                  onPress={() => toggleInsecurity(option)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      insecurities.includes(option) && styles.optionTextSelected,
                    ]}
                  >
                    {option}
                  </Text>
                  {insecurities.includes(option) && (
                    <IconSymbol name="checkmark" size={16} color="#fff" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {step === 3 && (
          <View style={styles.questionContainer}>
            <Text style={styles.question}>
              What are your favorite brands to shop at
            </Text>
            <View style={styles.optionsContainer}>
              {BRAND_OPTIONS.map((option) => (
                <TouchableOpacity
                  key={option}
                  style={[
                    styles.optionButton,
                    brands.includes(option) && styles.optionButtonSelected,
                  ]}
                  onPress={() => toggleBrand(option)}
                >
                  <Text
                    style={[
                      styles.optionText,
                      brands.includes(option) && styles.optionTextSelected,
                    ]}
                  >
                    {option}
                  </Text>
                  {brands.includes(option) && (
                    <IconSymbol name="checkmark" size={16} color="#fff" />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}
      </ScrollView>

      <View style={styles.footer}>
        {step < 3 ? (
          <TouchableOpacity style={styles.nextButton} onPress={handleNext}>
            <Text style={styles.nextButtonText}>Next</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.nextButton} onPress={handleComplete}>
            <Text style={styles.nextButtonText}>Complete</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  scrollContent: {
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  logo: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FF1493',
    marginBottom: 10,
  },
  stepIndicator: {
    fontSize: 14,
    color: '#666',
  },
  questionContainer: {
    marginBottom: 20,
  },
  question: {
    fontSize: 24,
    fontWeight: '600',
    color: '#000',
    marginBottom: 30,
    textAlign: 'center',
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    backgroundColor: '#fff',
  },
  optionButtonSelected: {
    borderColor: '#FF1493',
    backgroundColor: '#FF1493',
  },
  optionText: {
    fontSize: 16,
    color: '#000',
    fontWeight: '500',
  },
  optionTextSelected: {
    color: '#fff',
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  nextButton: {
    backgroundColor: '#FF1493',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  nextButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
});

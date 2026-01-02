
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';

// Altitude color palette - vibrant and energetic
export const colors = {
  // Primary colors from Altitude palette
  blushPink: '#FFE5F1',      // Colour 1 - soft backgrounds
  cyan: '#87F5F5',           // Colour 2 - bright accents
  magenta: '#F042FF',        // Colour 3 - vibrant highlights
  purple: '#7226FF',         // Colour 4 - primary actions
  deepPurple: '#160078',     // Colour 5 - emphasis/headers
  navy: '#010030',           // Colour 6 - dark text/backgrounds
  
  // Semantic colors
  background: '#FFE5F1',     // Blush pink for main background
  text: '#010030',           // Navy for primary text
  textSecondary: '#160078',  // Deep purple for secondary text
  primary: '#7226FF',        // Purple for primary actions
  secondary: '#F042FF',      // Magenta for secondary actions
  accent: '#87F5F5',         // Cyan for accents
  card: '#FFFFFF',           // Pure white for cards
  highlight: '#F042FF',      // Magenta for highlights
  border: '#87F5F5',         // Cyan for borders
  error: '#EF4444',
  milkyWay: '#FFFFFF',       // White for text on dark backgrounds
  meteor: '#E5E7EB',         // Light gray for subtle backgrounds
};

export const buttonStyles = StyleSheet.create({
  instructionsButton: {
    backgroundColor: colors.primary,
    alignSelf: 'center',
    width: '100%',
  },
  backButton: {
    backgroundColor: colors.card,
    alignSelf: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: colors.border,
  },
});

export const commonStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 800,
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    color: colors.text,
    marginBottom: 10
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
    lineHeight: 24,
    textAlign: 'center',
  },
  section: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    width: '100%',
    boxShadow: '0px 2px 8px rgba(135, 245, 245, 0.3)',
    elevation: 2,
  },
  icon: {
    width: 60,
    height: 60,
    tintColor: colors.primary,
  },
});

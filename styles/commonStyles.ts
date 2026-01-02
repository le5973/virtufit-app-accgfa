
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';

// Ervenista color palette - elegant blue scheme
export const colors = {
  // Primary colors from blue palette
  darkNavy: '#162456',       // Deep navy blue - dark backgrounds
  royalBlue: '#193cb8',      // Royal blue - primary actions
  skyBlue: '#64B5F6',        // Sky blue - accents and highlights
  lightBlue: '#E3F2FD',      // Light blue - soft backgrounds
  white: '#FFFFFF',          // Pure white
  
  // Semantic colors
  background: '#FFFFFF',     // White for main background
  text: '#162456',           // Dark navy for primary text
  textSecondary: '#193cb8',  // Royal blue for secondary text
  primary: '#193cb8',        // Royal blue for primary actions
  secondary: '#64B5F6',      // Sky blue for secondary actions
  accent: '#64B5F6',         // Sky blue for accents
  card: '#FFFFFF',           // Pure white for cards
  highlight: '#193cb8',      // Royal blue for highlights
  border: '#E3F2FD',         // Light blue for borders
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
    boxShadow: '0px 2px 8px rgba(100, 181, 246, 0.2)',
    elevation: 2,
  },
  icon: {
    width: 60,
    height: 60,
    tintColor: colors.primary,
  },
});

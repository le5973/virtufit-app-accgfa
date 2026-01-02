
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';

// Cosmic color palette from the design
export const colors = {
  // Primary colors
  planetary: '#334EAC',      // Deep blue - primary actions
  venus: '#BAD6EB',          // Light blue - accents
  universe: '#7096D1',       // Medium blue - secondary
  meteor: '#F7F2EB',         // Light cream - backgrounds
  galaxy: '#081F5C',         // Dark blue - headers/emphasis
  milkyWay: '#FFF9F0',       // Cream white - cards
  sky: '#D0E3FF',            // Sky blue - highlights
  
  // Semantic colors
  background: '#FFF9F0',     // Milky Way
  text: '#081F5C',           // Galaxy
  textSecondary: '#7096D1',  // Universe
  primary: '#334EAC',        // Planetary
  secondary: '#7096D1',      // Universe
  accent: '#BAD6EB',         // Venus
  card: '#FFFFFF',           // Pure white for cards
  highlight: '#D0E3FF',      // Sky
  border: '#BAD6EB',         // Venus
  error: '#EF4444',
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
    boxShadow: '0px 2px 8px rgba(186, 214, 235, 0.3)',
    elevation: 2,
  },
  icon: {
    width: 60,
    height: 60,
    tintColor: colors.primary,
  },
});

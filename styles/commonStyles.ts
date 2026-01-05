
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';

// Modern vibrant color scheme inspired by fitness/health apps
export const colors = {
  // Primary deep purples
  primary: '#2D1B69',
  primaryDark: '#1A0F3E',
  primaryLight: '#4A2C7F',
  
  // Vibrant accents
  accent: '#00D9C0',      // Teal/Cyan
  accentPink: '#FF4081',  // Hot Pink
  accentCoral: '#FF6B6B', // Coral
  accentPurple: '#9C27B0', // Purple
  
  // Backgrounds
  background: '#1A0F3E',
  backgroundAlt: '#2D1B69',
  backgroundCard: '#3D2A7A',
  
  // Text
  text: '#FFFFFF',
  textSecondary: '#B8B8D1',
  textMuted: '#8E8EA9',
  
  // UI Elements
  success: '#00D9C0',
  warning: '#FFB74D',
  error: '#FF6B6B',
  info: '#64B5F6',
  
  // Gradients
  gradientStart: '#2D1B69',
  gradientEnd: '#4A2C7F',
  
  // Glass/Overlay
  overlay: 'rgba(29, 27, 105, 0.85)',
  glass: 'rgba(255, 255, 255, 0.1)',
};

export const buttonStyles = StyleSheet.create({
  instructionsButton: {
    backgroundColor: colors.accent,
    alignSelf: 'center',
    width: '100%',
    borderRadius: 16,
    paddingVertical: 16,
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  backButton: {
    backgroundColor: colors.backgroundCard,
    alignSelf: 'center',
    width: '100%',
    borderRadius: 16,
    paddingVertical: 16,
  },
  primaryButton: {
    backgroundColor: colors.accent,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: colors.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  secondaryButton: {
    backgroundColor: colors.accentPink,
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
    justifyContent: 'center',
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
    fontSize: 28,
    fontWeight: '800',
    textAlign: 'center',
    color: colors.text,
    marginBottom: 12,
    letterSpacing: 0.5,
  },
  subtitle: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 10,
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.textSecondary,
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
    backgroundColor: colors.backgroundCard,
    borderRadius: 20,
    padding: 20,
    marginVertical: 10,
    width: '100%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  glassCard: {
    backgroundColor: colors.glass,
    borderRadius: 20,
    padding: 20,
    marginVertical: 10,
    width: '100%',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)',
  },
  icon: {
    width: 60,
    height: 60,
    tintColor: colors.accent,
  },
  input: {
    backgroundColor: colors.backgroundCard,
    borderRadius: 12,
    padding: 16,
    color: colors.text,
    fontSize: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  badge: {
    backgroundColor: colors.accent,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  badgeText: {
    color: colors.primary,
    fontSize: 12,
    fontWeight: '700',
  },
});

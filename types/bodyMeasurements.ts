
export interface BodyMeasurements {
  bust: number;        // in cm
  waist: number;       // in cm
  hip: number;         // in cm
  shoulders: number;   // in cm
  armLength: number;   // in cm
  legsLength: number;  // in cm
  feetSize: number;    // in cm or shoe size
}

export interface BodyScan {
  height: number;      // in cm
  weight: number;      // in kg
  image: string | null;
  video: string | null; // Added video support
}

export interface BodyAnalysisResult {
  measurements: BodyMeasurements;
  confidence: number;
}

export interface SavedOutfit {
  id: string;
  name: string;
  imageUrl: string;
  websiteUrl: string;
  websiteName: string;
  price?: string;
  dateAdded: string;
  notes?: string;
  syncedToCloud?: boolean; // Supabase sync status
  userId?: string; // For cloud storage
}

export interface WishlistItem {
  id: string;
  name: string;
  imageUrl: string;
  websiteUrl: string;
  websiteName: string;
  price?: string;
  dateAdded: string;
  notes?: string;
  isPublic: boolean;
  syncedToCloud?: boolean; // Supabase sync status
  userId?: string; // For cloud storage
}

export interface SizeGuide {
  brand: string;
  category: string; // 'tops', 'bottoms', 'shoes', etc.
  measurements: {
    size: string;
    bust?: number;
    waist?: number;
    hip?: number;
    length?: number;
  }[];
}

export interface FitPrediction {
  size: string;
  fitScore: number; // 0-100
  tooSmall: boolean;
  tooLarge: boolean;
  perfectFit: boolean;
  recommendations: string[];
}

export interface Friend {
  id: string;
  name: string;
  email: string;
  image?: string;
  createdAt: string;
}

export interface FriendRequest {
  id: string;
  fromUserId: string;
  toUserId: string;
  fromUser?: Friend;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
}

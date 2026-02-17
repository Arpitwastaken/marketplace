// Listing data models
export interface Listing {
  id: string;
  type: 'buyer' | 'seller';
  category: string;
  price: number;
  location: {
    lat: number;
    lng: number;
    city: string;
  };
  description: string;
  createdAt: Date;
}

export interface Match {
  id: string;
  buyerId: string;
  sellerId: string;
  score: number;
  priceMatch: boolean;
  categoryMatch: boolean;
  locationScore: number;
  createdAt: Date;
}

export interface MatchingConfig {
  minScore: number;
  maxDistance: number;
  priceTolerance: number;
}

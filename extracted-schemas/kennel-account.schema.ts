/**
 * Kennel/Account Schema - Extracted from BreedPride
 * Modernized for S0Fractal Collective Integration
 */

// Core Enums and Types
export enum AccountType {
  KENNEL = 'kennel',
  BREEDER = 'breeder',
  ORGANIZATION = 'organization',
  FEDERATION = 'federation',
  CLUB = 'club'
}

export enum AccountStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  SUSPENDED = 'suspended',
  PENDING = 'pending'
}

export enum AccountOwnership {
  INDIVIDUAL = 'individual',
  PARTNERSHIP = 'partnership',
  CORPORATION = 'corporation',
  NON_PROFIT = 'non_profit'
}

export enum AffixType {
  PREFIX = 'prefix',
  SUFFIX = 'suffix',
  BOTH = 'both'
}

export enum AccountCategory {
  HOBBY = 'hobby',
  PROFESSIONAL = 'professional',
  COMMERCIAL = 'commercial',
  PRESERVATION = 'preservation',
  RESCUE = 'rescue'
}

export enum IndustryType {
  BREEDING = 'breeding',
  TRAINING = 'training',
  SHOWING = 'showing',
  GROOMING = 'grooming',
  VETERINARY = 'veterinary',
  RETAIL = 'retail',
  SERVICES = 'services'
}

// Address and Location
export interface KennelAddress {
  type: string;
  street: string;
  city: string;
  region: string;
  zipCode: string;
  country: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  isPrimary: boolean;
}

// Federation and Registration
export interface Federation {
  id: string;
  name: string;
  alternativeName?: string;
  url?: string;
  country: string;
  registrationNumber?: string;
}

// Kennel Breeds
export interface KennelBreed {
  breedId: string;
  breedName: string;
  isPrimary: boolean;
  specialization?: string;
  activeSince: Date;
  petCount: number;
  achievements: string[];
}

// Services Offered
export interface KennelService {
  id: string;
  name: string;
  description: string;
  category: 'breeding' | 'training' | 'boarding' | 'grooming' | 'health' | 'showing';
  price?: number;
  currency?: string;
  availability: boolean;
}

// Reviews and Recommendations
export interface KennelReview {
  id: string;
  reviewerId: string;
  reviewerName: string;
  rating: number;
  title: string;
  comment: string;
  reviewDate: Date;
  category: 'breeding' | 'service' | 'health' | 'communication';
  verified: boolean;
}

export interface KennelRecommendation {
  id: string;
  recommenderId: string;
  recommenderName: string;
  message: string;
  dateGiven: Date;
  category: string;
}

// Achievements and Recognition
export interface KennelAchievement {
  id: string;
  title: string;
  description: string;
  awardedDate: Date;
  awardingBody: string;
  category: 'breeding' | 'showing' | 'service' | 'community';
  level: 'local' | 'national' | 'international';
}

// Core Kennel/Account Schema
export interface KennelAccountSchema {
  // Core Identity
  id: string;
  name: string;
  alternativeName?: string;
  code?: string;
  registeredName?: string;
  
  // Account Classification
  type: AccountType;
  category: AccountCategory;
  status: AccountStatus;
  ownership: AccountOwnership;
  
  // Kennel Specific
  hasKennelName: boolean;
  affixType?: AffixType;
  kennelPrefix?: string;
  kennelSuffix?: string;
  
  // Ownership and Management
  ownerId: string;
  ownerName: string;
  primaryContactId?: string;
  parentAccountId?: string;
  
  // Business Information
  industry: IndustryType;
  foundationDate: Date;
  companyFoundationDate?: Date;
  since?: Date;
  aboutUs?: string;
  
  // Contact Information
  phone?: string;
  additionalPhone?: string;
  email?: string;
  website?: string;
  
  // Address
  addresses: KennelAddress[];
  
  // Registration and Certification
  federation?: Federation;
  registrations: Federation[];
  verified: boolean;
  verificationStatus: string;
  
  // Visual Identity
  avatarUrl?: string;
  coverImageUrl?: string;
  profileUrl?: string;
  
  // Breeds and Specialization
  breeds: KennelBreed[];
  primaryBreeds: string[];
  
  // Pets and Inventory
  pets: string[]; // Pet IDs
  topPetId?: string;
  offspringCount: number;
  activePetCount: number;
  petsForSale: string[];
  
  // Services and Operations
  services: KennelService[];
  specializations: string[];
  
  // Performance and Recognition
  rating: number;
  ratingCount: number;
  ratingPlacementInBreed?: number;
  achievements: KennelAchievement[];
  
  // Reviews and Social Proof
  reviews: KennelReview[];
  recommendations: KennelRecommendation[];
  
  // Social Media and Communication
  socialMedia: {
    facebook?: string;
    instagram?: string;
    website?: string;
    youtube?: string;
  };
  communicationChannels: {
    viber?: string;
    whatsapp?: string;
    telegram?: string;
  };
  
  // GPS and Location
  gpsCoordinates?: {
    north: string;
    east: string;
  };
  
  // Privacy and Visibility
  isPublic: boolean;
  hasUser: boolean;
  
  // System Metadata
  notes?: string;
  createdOn: Date;
  createdBy: string;
  modifiedOn: Date;
  modifiedBy: string;
  
  // S0Fractal Integration
  glyphId?: string;
  collectiveRole?: string;
  operationLevel: number;
  trustScore: number;
}

// Extended Types for Specific Use Cases
export interface BreedingKennel extends KennelAccountSchema {
  type: AccountType.KENNEL;
  category: AccountCategory.PROFESSIONAL | AccountCategory.HOBBY;
  breedingProgram: {
    philosophy: string;
    goals: string[];
    healthTesting: string[];
    geneticScreening: boolean;
    lineBreeding: boolean;
    outcrossing: boolean;
  };
  studServices: {
    available: boolean;
    studs: string[]; // Pet IDs
    fees: { petId: string; fee: number; currency: string }[];
  };
  litterPlanning: {
    planned: Array<{
      sireId: string;
      damId: string;
      expectedDate: Date;
      status: 'planned' | 'confirmed' | 'completed';
    }>;
  };
}

// Field Configuration for S0Fractal
export interface KennelFieldConfig {
  fieldName: string;
  fieldType: 'text' | 'email' | 'phone' | 'date' | 'select' | 'multiselect' | 'boolean' | 'number' | 'url' | 'textarea';
  label: string;
  required: boolean;
  validation?: {
    pattern?: string;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
  };
  options?: { value: string; label: string }[];
  glyph?: string;
}

export const KENNEL_FIELD_CONFIGS: KennelFieldConfig[] = [
  {
    fieldName: 'name',
    fieldType: 'text',
    label: 'Kennel Name',
    required: true,
    validation: { minLength: 2, maxLength: 100 },
    glyph: 'identity.name'
  },
  {
    fieldName: 'type',
    fieldType: 'select',
    label: 'Account Type',
    required: true,
    options: [
      { value: 'kennel', label: 'Kennel' },
      { value: 'breeder', label: 'Breeder' },
      { value: 'organization', label: 'Organization' },
      { value: 'federation', label: 'Federation' },
      { value: 'club', label: 'Club' }
    ],
    glyph: 'organization.type'
  },
  {
    fieldName: 'category',
    fieldType: 'select',
    label: 'Category',
    required: true,
    options: [
      { value: 'hobby', label: 'Hobby' },
      { value: 'professional', label: 'Professional' },
      { value: 'commercial', label: 'Commercial' },
      { value: 'preservation', label: 'Preservation' },
      { value: 'rescue', label: 'Rescue' }
    ],
    glyph: 'organization.category'
  },
  {
    fieldName: 'foundationDate',
    fieldType: 'date',
    label: 'Foundation Date',
    required: false,
    glyph: 'time.foundation'
  },
  {
    fieldName: 'hasKennelName',
    fieldType: 'boolean',
    label: 'Has Registered Kennel Name',
    required: false,
    glyph: 'registration.kennel'
  }
];

// Business Logic Patterns
export class KennelAccountService {
  /**
   * Calculate kennel reputation score
   */
  static calculateReputationScore(kennel: KennelAccountSchema): number {
    let score = 0;
    
    // Base verification (30 points)
    if (kennel.verified) score += 30;
    else if (kennel.verificationStatus === 'pending') score += 15;
    
    // Rating contribution (25 points)
    if (kennel.ratingCount > 0) {
      score += Math.min(25, (kennel.rating / 5) * 25);
    }
    
    // Achievements (20 points)
    score += Math.min(20, kennel.achievements.length * 5);
    
    // Years in operation (15 points)
    const yearsInOperation = (new Date().getFullYear() - kennel.foundationDate.getFullYear());
    score += Math.min(15, yearsInOperation * 2);
    
    // Federation membership (10 points)
    if (kennel.federation) score += 10;
    
    return Math.round(score);
  }
  
  /**
   * Calculate breeding program quality score
   */
  static calculateBreedingQuality(kennel: BreedingKennel): number {
    let score = 0;
    
    // Health testing program (40 points)
    if (kennel.breedingProgram.healthTesting.length > 0) {
      score += Math.min(40, kennel.breedingProgram.healthTesting.length * 10);
    }
    
    // Genetic screening (20 points)
    if (kennel.breedingProgram.geneticScreening) score += 20;
    
    // Breeding philosophy documented (20 points)
    if (kennel.breedingProgram.philosophy.length > 100) score += 20;
    
    // Clear breeding goals (20 points)
    if (kennel.breedingProgram.goals.length > 0) {
      score += Math.min(20, kennel.breedingProgram.goals.length * 5);
    }
    
    return Math.round(score);
  }
  
  /**
   * Get kennel specialty badges
   */
  static getSpecialtyBadges(kennel: KennelAccountSchema): string[] {
    const badges: string[] = [];
    
    if (kennel.verified) badges.push('verified');
    if (kennel.federation) badges.push('registered');
    if (kennel.achievements.length > 5) badges.push('accomplished');
    if (kennel.rating > 4.5 && kennel.ratingCount > 10) badges.push('highly-rated');
    if (kennel.breeds.length === 1) badges.push('specialist');
    else if (kennel.breeds.length > 3) badges.push('multi-breed');
    
    // Check for specific categories
    if (kennel.category === AccountCategory.PRESERVATION) badges.push('preservation');
    if (kennel.category === AccountCategory.RESCUE) badges.push('rescue');
    
    // Check for international recognition
    const internationalAchievements = kennel.achievements.filter(a => a.level === 'international');
    if (internationalAchievements.length > 0) badges.push('international');
    
    return badges;
  }
  
  /**
   * Calculate operation sustainability score
   */
  static calculateSustainabilityScore(kennel: KennelAccountSchema): number {
    let score = 0;
    
    // Diversified breeds (20 points)
    if (kennel.breeds.length > 1) {
      score += Math.min(20, kennel.breeds.length * 5);
    }
    
    // Multiple service offerings (30 points)
    score += Math.min(30, kennel.services.length * 6);
    
    // Strong review base (25 points)
    if (kennel.reviews.length > 5) {
      const avgRating = kennel.reviews.reduce((sum, r) => sum + r.rating, 0) / kennel.reviews.length;
      score += (avgRating / 5) * 25;
    }
    
    // Years of operation (25 points)
    const yearsInOperation = (new Date().getFullYear() - kennel.foundationDate.getFullYear());
    score += Math.min(25, yearsInOperation * 3);
    
    return Math.round(score);
  }
  
  /**
   * Validate kennel data for S0Fractal integration
   */
  static validateForGlyphSystem(kennel: Partial<KennelAccountSchema>): boolean {
    return !!(
      kennel.name &&
      kennel.type &&
      kennel.category &&
      kennel.ownerId &&
      kennel.foundationDate
    );
  }
  
  /**
   * Generate operation efficiency metrics
   */
  static generateEfficiencyMetrics(kennel: KennelAccountSchema): Record<string, number> {
    return {
      petsPerBreed: kennel.breeds.length > 0 ? kennel.activePetCount / kennel.breeds.length : 0,
      achievementsPerYear: kennel.achievements.length / Math.max(1, new Date().getFullYear() - kennel.foundationDate.getFullYear()),
      serviceUtilization: kennel.services.filter(s => s.availability).length / Math.max(1, kennel.services.length) * 100,
      reviewSatisfaction: kennel.reviews.length > 0 ? (kennel.reviews.reduce((sum, r) => sum + r.rating, 0) / kennel.reviews.length) * 20 : 0
    };
  }
}

export default KennelAccountSchema;
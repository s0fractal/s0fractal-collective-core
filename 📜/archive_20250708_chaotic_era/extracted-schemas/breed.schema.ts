/**
 * Breed Schema - Extracted from BreedPride
 * Modernized for S0Fractal Collective Integration
 */

// Core Enums and Types
export enum BreedCategory {
  SPORTING = 'sporting',
  HOUND = 'hound',
  WORKING = 'working',
  TERRIER = 'terrier',
  TOY = 'toy',
  NON_SPORTING = 'non_sporting',
  HERDING = 'herding',
  MISCELLANEOUS = 'miscellaneous'
}

export enum BreedRecognitionStatus {
  FULLY_RECOGNIZED = 'fully_recognized',
  PROVISIONAL = 'provisional',
  FOUNDATION_STOCK = 'foundation_stock',
  NOT_RECOGNIZED = 'not_recognized'
}

export enum PatronTier {
  BRONZE = 'bronze',
  SILVER = 'silver',
  GOLD = 'gold',
  PLATINUM = 'platinum',
  DIAMOND = 'diamond'
}

// Breed Characteristics
export interface BreedCharacteristics {
  // Physical traits that may vary
  differByCoatColor: boolean;
  differByCoatType: boolean;
  differBySize: boolean;
  differByBodyFeature: boolean;
  
  // Size ranges
  heightRange?: {
    male: { min: number; max: number };
    female: { min: number; max: number };
    unit: 'cm' | 'inches';
  };
  
  weightRange?: {
    male: { min: number; max: number };
    female: { min: number; max: number };
    unit: 'kg' | 'lbs';
  };
  
  // Temperament traits
  temperament: string[];
  energyLevel: 1 | 2 | 3 | 4 | 5;
  exerciseNeeds: 1 | 2 | 3 | 4 | 5;
  trainability: 1 | 2 | 3 | 4 | 5;
  groomingNeeds: 1 | 2 | 3 | 4 | 5;
  
  // Health considerations
  commonHealthIssues: string[];
  lifeExpectancy: { min: number; max: number };
  recommendedHealthTests: string[];
}

// Breed Standards
export interface BreedStandard {
  id: string;
  organization: string; // FCI, AKC, UKC, etc.
  country: string;
  version: string;
  lastUpdated: Date;
  documentUrl?: string;
  sections: {
    generalAppearance: string;
    headAndSkull: string;
    eyes: string;
    ears: string;
    mouthAndTeeth: string;
    neck: string;
    body: string;
    limbs: string;
    coat: string;
    color: string;
    gait: string;
    temperament: string;
    faults: string[];
    disqualifications: string[];
  };
}

// Breed Achievements
export interface BreedAchievement {
  id: string;
  name: string;
  description: string;
  date: Date;
  position: number;
  active: boolean;
  category: 'championship' | 'specialty' | 'milestone' | 'recognition' | 'community';
  level: 'local' | 'national' | 'international' | 'world';
  awardingBody: string;
}

// Patron System
export interface BreedPatron {
  contactId: string;
  contactName: string;
  tier: PatronTier;
  supportLevel: number;
  startDate: Date;
  endDate?: Date;
  totalContribution: number;
  currency: string;
  benefits: string[];
  isActive: boolean;
}

// Support Level Definitions
export interface SupportLevel {
  level: number;
  name: string;
  tier: PatronTier;
  minContribution: number;
  maxContribution?: number;
  benefits: string[];
  duration: number; // months
  renewable: boolean;
}

// Breed Statistics
export interface BreedStatistics {
  totalPets: number;
  registeredPets: number;
  kennelCount: number;
  activeBreederCount: number;
  patronCount: number;
  achievementCount: number;
  
  // Geographic distribution
  countryDistribution: Array<{
    country: string;
    petCount: number;
    kennelCount: number;
  }>;
  
  // Breeding statistics
  annualRegistrations: Array<{
    year: number;
    count: number;
  }>;
  
  // Health statistics
  healthTestingRate: number;
  commonTestResults: Array<{
    testName: string;
    clearRate: number;
    carrierRate: number;
    affectedRate: number;
  }>;
}

// Core Breed Schema
export interface BreedSchema {
  // Core Identity
  id: string;
  name: string;
  authenticName?: string;
  adminName?: string;
  alternativeNames: string[];
  
  // Classification
  petType: string; // Dog, Cat, Horse, etc.
  category: BreedCategory;
  group?: string; // FCI Group, AKC Group, etc.
  section?: string; // FCI Section
  
  // Recognition and Registration
  recognitionStatus: BreedRecognitionStatus;
  recognizedBy: string[]; // Organization codes
  originCountry: string;
  
  // Language and Localization
  language: string;
  localizedNames: Array<{
    language: string;
    name: string;
  }>;
  
  // Characteristics and Standards
  characteristics: BreedCharacteristics;
  standards: BreedStandard[];
  hasRelatedBreeds: boolean;
  relatedBreeds?: string[]; // Breed IDs
  
  // Community and Management
  accountId?: string; // Managing organization/club
  adminContactId?: string;
  
  // Visual Identity
  avatarUrl?: string;
  coverImageUrl?: string;
  profileUrl?: string;
  
  // Statistics and Metrics
  statistics: BreedStatistics;
  rating: number;
  paymentRating?: number;
  achievementProgress: number;
  
  // Patronage System
  patrons: BreedPatron[];
  supportLevels: SupportLevel[];
  majorPatronId?: string;
  
  // Achievements and Recognition
  achievements: BreedAchievement[];
  currentAchievement?: BreedAchievement;
  
  // Health and Genetic Information
  geneticDiversityScore?: number;
  foundationBloodlines: string[];
  criticalPopulationStatus: boolean;
  
  // Privacy and Visibility
  isPublic: boolean;
  publicData?: any;
  
  // System Metadata
  createdOn: Date;
  createdBy: string;
  modifiedOn: Date;
  modifiedBy: string;
  
  // S0Fractal Integration
  glyphId?: string;
  communityHash?: string;
  preservationLevel: number;
  geneticImportance: number;
}

// Extended Types
export interface RareBreed extends BreedSchema {
  criticalPopulationStatus: true;
  preservationProgram: {
    status: 'critical' | 'threatened' | 'watch' | 'recovering';
    populationEstimate: number;
    activePreservationKennels: string[];
    geneticBottlenecks: Array<{
      year: number;
      population: number;
      description: string;
    }>;
    conservationStrategies: string[];
  };
}

// Field Configuration for S0Fractal
export interface BreedFieldConfig {
  fieldName: string;
  fieldType: 'text' | 'select' | 'multiselect' | 'number' | 'boolean' | 'textarea' | 'date';
  label: string;
  required: boolean;
  validation?: {
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
  };
  options?: { value: string; label: string }[];
  glyph?: string;
}

export const BREED_FIELD_CONFIGS: BreedFieldConfig[] = [
  {
    fieldName: 'name',
    fieldType: 'text',
    label: 'Breed Name',
    required: true,
    validation: { minLength: 2, maxLength: 100 },
    glyph: 'identity.name'
  },
  {
    fieldName: 'category',
    fieldType: 'select',
    label: 'Breed Category',
    required: true,
    options: [
      { value: 'sporting', label: 'Sporting' },
      { value: 'hound', label: 'Hound' },
      { value: 'working', label: 'Working' },
      { value: 'terrier', label: 'Terrier' },
      { value: 'toy', label: 'Toy' },
      { value: 'non_sporting', label: 'Non-Sporting' },
      { value: 'herding', label: 'Herding' },
      { value: 'miscellaneous', label: 'Miscellaneous' }
    ],
    glyph: 'classification.category'
  },
  {
    fieldName: 'originCountry',
    fieldType: 'select',
    label: 'Country of Origin',
    required: true,
    glyph: 'geography.origin'
  },
  {
    fieldName: 'characteristics.energyLevel',
    fieldType: 'select',
    label: 'Energy Level',
    required: false,
    options: [
      { value: '1', label: 'Very Low' },
      { value: '2', label: 'Low' },
      { value: '3', label: 'Moderate' },
      { value: '4', label: 'High' },
      { value: '5', label: 'Very High' }
    ],
    glyph: 'traits.energy'
  }
];

// Business Logic Patterns
export class BreedService {
  /**
   * Calculate breed community health score
   */
  static calculateCommunityHealth(breed: BreedSchema): number {
    let score = 0;
    
    // Population size (30 points)
    const totalPets = breed.statistics.totalPets;
    if (totalPets > 10000) score += 30;
    else if (totalPets > 5000) score += 25;
    else if (totalPets > 1000) score += 20;
    else if (totalPets > 500) score += 15;
    else if (totalPets > 100) score += 10;
    else score += 5;
    
    // Genetic diversity (25 points)
    if (breed.geneticDiversityScore) {
      score += (breed.geneticDiversityScore / 100) * 25;
    }
    
    // Active breeding community (25 points)
    const activeBreederRatio = breed.statistics.activeBreederCount / Math.max(1, breed.statistics.kennelCount);
    score += Math.min(25, activeBreederRatio * 50);
    
    // Health testing adoption (20 points)
    score += Math.min(20, breed.statistics.healthTestingRate * 20);
    
    return Math.round(score);
  }
  
  /**
   * Calculate breed preservation priority
   */
  static calculatePreservationPriority(breed: BreedSchema): number {
    let priority = 0;
    
    // Population criticality (40 points)
    const totalPets = breed.statistics.totalPets;
    if (totalPets < 100) priority += 40;
    else if (totalPets < 500) priority += 30;
    else if (totalPets < 1000) priority += 20;
    else if (totalPets < 2000) priority += 10;
    
    // Geographic concentration (30 points)
    const primaryCountryPets = Math.max(...breed.statistics.countryDistribution.map(c => c.petCount));
    const concentrationRatio = primaryCountryPets / totalPets;
    if (concentrationRatio > 0.8) priority += 30;
    else if (concentrationRatio > 0.6) priority += 20;
    else if (concentrationRatio > 0.4) priority += 10;
    
    // Breeding activity decline (20 points)
    const recentRegistrations = breed.statistics.annualRegistrations.slice(-3);
    if (recentRegistrations.length >= 2) {
      const trend = recentRegistrations[recentRegistrations.length - 1].count - recentRegistrations[0].count;
      if (trend < -50) priority += 20;
      else if (trend < -20) priority += 15;
      else if (trend < 0) priority += 10;
    }
    
    // Genetic importance (10 points)
    if (breed.foundationBloodlines.length > 0) priority += 10;
    
    return Math.round(priority);
  }
  
  /**
   * Calculate patronage effectiveness score
   */
  static calculatePatronageEffectiveness(breed: BreedSchema): number {
    let score = 0;
    
    const activePatrons = breed.patrons.filter(p => p.isActive);
    
    // Patron diversity (40 points)
    const tierDistribution = activePatrons.reduce((acc, p) => {
      acc[p.tier] = (acc[p.tier] || 0) + 1;
      return acc;
    }, {} as Record<PatronTier, number>);
    
    const tierCount = Object.keys(tierDistribution).length;
    score += Math.min(40, tierCount * 10);
    
    // Support consistency (30 points)
    const avgPatronDuration = activePatrons.reduce((sum, p) => {
      const duration = (new Date().getTime() - p.startDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
      return sum + duration;
    }, 0) / Math.max(1, activePatrons.length);
    
    score += Math.min(30, avgPatronDuration / 12 * 30);
    
    // Achievement correlation (30 points)
    const achievementsPerPatron = breed.achievements.length / Math.max(1, activePatrons.length);
    score += Math.min(30, achievementsPerPatron * 10);
    
    return Math.round(score);
  }
  
  /**
   * Generate breed health insights
   */
  static generateHealthInsights(breed: BreedSchema): Record<string, any> {
    const insights: Record<string, any> = {};
    
    // Health testing coverage
    insights.healthTestingCoverage = breed.statistics.healthTestingRate;
    
    // Common health concerns
    insights.primaryHealthConcerns = breed.characteristics.commonHealthIssues.slice(0, 3);
    
    // Test result analysis
    insights.geneticRiskFactors = breed.statistics.commonTestResults
      .filter(test => test.affectedRate > 0.05 || test.carrierRate > 0.20)
      .map(test => ({
        condition: test.testName,
        riskLevel: test.affectedRate > 0.10 ? 'high' : test.affectedRate > 0.05 ? 'moderate' : 'low'
      }));
    
    // Breeding recommendations
    insights.breedingRecommendations = [];
    if (breed.statistics.healthTestingRate < 0.8) {
      insights.breedingRecommendations.push('Increase health testing adoption');
    }
    if (breed.geneticDiversityScore && breed.geneticDiversityScore < 70) {
      insights.breedingRecommendations.push('Focus on genetic diversity in breeding programs');
    }
    
    return insights;
  }
  
  /**
   * Validate breed data for S0Fractal integration
   */
  static validateForGlyphSystem(breed: Partial<BreedSchema>): boolean {
    return !!(
      breed.name &&
      breed.category &&
      breed.petType &&
      breed.originCountry &&
      breed.characteristics
    );
  }
  
  /**
   * Generate community engagement metrics
   */
  static generateEngagementMetrics(breed: BreedSchema): Record<string, number> {
    return {
      patronEngagement: breed.patrons.filter(p => p.isActive).length / Math.max(1, breed.patrons.length) * 100,
      breederActivity: breed.statistics.activeBreederCount / Math.max(1, breed.statistics.kennelCount) * 100,
      achievementMomentum: breed.achievements.filter(a => 
        (new Date().getTime() - a.date.getTime()) < (365 * 24 * 60 * 60 * 1000)
      ).length,
      globalPresence: breed.statistics.countryDistribution.length,
      populationGrowth: breed.statistics.annualRegistrations.length > 1 ? 
        ((breed.statistics.annualRegistrations[breed.statistics.annualRegistrations.length - 1].count - 
          breed.statistics.annualRegistrations[breed.statistics.annualRegistrations.length - 2].count) / 
         Math.max(1, breed.statistics.annualRegistrations[breed.statistics.annualRegistrations.length - 2].count)) * 100 : 0
    };
  }
}

export default BreedSchema;
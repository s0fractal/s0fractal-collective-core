/**
 * Health & Show Result Schemas - Extracted from BreedPride
 * Modernized for S0Fractal Collective Integration
 */

// Health Examination Enums and Types
export enum HealthTestResult {
  CLEAR = 'clear',
  CARRIER = 'carrier',
  AFFECTED = 'affected',
  PENDING = 'pending',
  INCONCLUSIVE = 'inconclusive',
  FAILED = 'failed'
}

export enum HealthTestCategory {
  GENETIC = 'genetic',
  ORTHOPEDIC = 'orthopedic',
  CARDIAC = 'cardiac',
  OPHTHALMOLOGIC = 'ophthalmologic',
  NEUROLOGIC = 'neurologic',
  ENDOCRINE = 'endocrine',
  IMMUNOLOGIC = 'immunologic',
  GENERAL = 'general'
}

export enum HealthTestPriority {
  REQUIRED = 'required',
  RECOMMENDED = 'recommended',
  OPTIONAL = 'optional',
  BREED_SPECIFIC = 'breed_specific'
}

// Show Result Enums and Types
export enum ShowType {
  CONFORMATION = 'conformation',
  SPECIALTY = 'specialty',
  MATCH = 'match',
  FUN_MATCH = 'fun_match',
  PERFORMANCE = 'performance',
  WORKING = 'working'
}

export enum ShowLevel {
  LOCAL = 'local',
  REGIONAL = 'regional',
  NATIONAL = 'national',
  INTERNATIONAL = 'international',
  WORLD = 'world'
}

export enum AwardType {
  BEST_IN_SHOW = 'best_in_show',
  BEST_IN_GROUP = 'best_in_group',
  GROUP_PLACEMENT = 'group_placement',
  WINNERS_DOG = 'winners_dog',
  WINNERS_BITCH = 'winners_bitch',
  BEST_OF_WINNERS = 'best_of_winners',
  BEST_OF_BREED = 'best_of_breed',
  BEST_OF_OPPOSITE_SEX = 'best_of_opposite_sex',
  SELECT_DOG = 'select_dog',
  SELECT_BITCH = 'select_bitch',
  AWARD_OF_MERIT = 'award_of_merit',
  CLASS_PLACEMENT = 'class_placement'
}

// Health Examination Object Schema
export interface HealthExamObject {
  id: string;
  name: string;
  code?: string;
  description: string;
  category: HealthTestCategory;
  priority: HealthTestPriority;
  
  // Test specifications
  methodology: string;
  sampleType: 'blood' | 'saliva' | 'tissue' | 'xray' | 'ultrasound' | 'physical' | 'other';
  processingTime: number; // days
  validityPeriod?: number; // months
  
  // Cost and availability
  estimatedCost?: number;
  currency?: string;
  availableLabs: string[];
  
  // Breed relevance
  applicableBreeds: string[];
  breedSpecificRecommendations?: Record<string, string>;
  
  // Results interpretation
  resultTypes: HealthTestResult[];
  interpretationGuide: Record<HealthTestResult, string>;
  
  // Regulatory information
  requiredByOrganizations: string[];
  acceptedByRegistries: string[];
  
  // Documentation
  referenceDocuments: Array<{
    title: string;
    url: string;
    type: 'study' | 'guideline' | 'standard' | 'protocol';
  }>;
  
  // System metadata
  createdOn: Date;
  modifiedOn: Date;
  isActive: boolean;
  
  // S0Fractal integration
  glyphId?: string;
  importanceScore: number;
}

// Health Examination Result Schema
export interface HealthExamResult {
  id: string;
  petId: string;
  petName: string;
  ownerId: string;
  examObjectId: string;
  examName: string;
  
  // Test execution
  testDate: Date;
  laboratoryName: string;
  laboratoryId?: string;
  testMethod?: string;
  
  // Results
  result: HealthTestResult;
  numericValue?: number;
  unit?: string;
  resultDetails?: string;
  interpretation: string;
  
  // Certification
  certificateNumber?: string;
  certificateUrl?: string;
  veterinarianId?: string;
  veterinarianName?: string;
  
  // Validity and verification
  expirationDate?: Date;
  verified: boolean;
  verificationDate?: Date;
  verifiedBy?: string;
  
  // Privacy and sharing
  isPublic: boolean;
  shareWithBreedDb: boolean;
  
  // Attachments
  attachments: Array<{
    type: 'certificate' | 'report' | 'image' | 'other';
    filename: string;
    url: string;
    uploadDate: Date;
  }>;
  
  // System metadata
  notes?: string;
  createdOn: Date;
  modifiedOn: Date;
  
  // S0Fractal integration
  glyphId?: string;
  reliabilityScore: number;
}

// Show Event Schema
export interface ShowEvent {
  id: string;
  name: string;
  alternativeName?: string;
  showType: ShowType;
  level: ShowLevel;
  
  // Event details
  startDate: Date;
  endDate: Date;
  location: {
    venue: string;
    city: string;
    region: string;
    country: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  
  // Organization
  organizingClub: string;
  sanctioningBody: string;
  showChairman?: string;
  showSuperintendent?: string;
  
  // Judging panel
  judges: Array<{
    judgeId: string;
    judgeName: string;
    assignment: string; // breed, group, all-breed
    approvalNumber?: string;
  }>;
  
  // Entry information
  totalEntries: number;
  entryFee?: number;
  currency?: string;
  entryDeadline?: Date;
  
  // Awards and prizes
  specialAwards: Array<{
    name: string;
    sponsor?: string;
    value?: number;
    description: string;
  }>;
  
  // Documentation
  premiumList?: string;
  resultSheet?: string;
  photos?: string[];
  
  // System metadata
  isActive: boolean;
  createdOn: Date;
  modifiedOn: Date;
  
  // S0Fractal integration
  glyphId?: string;
  prestigeScore: number;
}

// Show Result Schema
export interface ShowResult {
  id: string;
  petId: string;
  petName: string;
  ownerId: string;
  handlerId?: string;
  handlerName?: string;
  
  // Event information
  eventId: string;
  eventName: string;
  eventDate: Date;
  judgeId: string;
  judgeName: string;
  
  // Competition details
  class: string;
  division?: string;
  variety?: string;
  
  // Results
  placement: number;
  totalEntries: number;
  award: AwardType;
  awardTitle: string;
  points?: number;
  
  // Performance details
  scores?: Array<{
    category: string;
    score: number;
    maxScore: number;
    comments?: string;
  }>;
  
  // Recognition
  majorWin: boolean;
  titleEarned?: string;
  qualifyingScore?: boolean;
  
  // Documentation
  certificateUrl?: string;
  photos: string[];
  video?: string;
  
  // Critiques and feedback
  judgeCritique?: string;
  handlerNotes?: string;
  
  // Privacy and sharing
  isPublic: boolean;
  
  // System metadata
  notes?: string;
  createdOn: Date;
  modifiedOn: Date;
  
  // S0Fractal integration
  glyphId?: string;
  achievementValue: number;
}

// Aggregate Health Profile
export interface HealthProfile {
  petId: string;
  lastUpdated: Date;
  
  // Overall health status
  overallStatus: 'excellent' | 'good' | 'fair' | 'concerns' | 'unknown';
  completenessScore: number;
  
  // Test categories summary
  categories: Array<{
    category: HealthTestCategory;
    testsCompleted: number;
    testsRecommended: number;
    latestUpdate: Date;
    status: 'complete' | 'partial' | 'missing';
  }>;
  
  // Critical findings
  criticalFindings: Array<{
    testName: string;
    result: HealthTestResult;
    severity: 'high' | 'medium' | 'low';
    recommendedAction: string;
  }>;
  
  // Breed-specific compliance
  breedCompliance: {
    breedId: string;
    requiredTests: string[];
    completedTests: string[];
    compliancePercentage: number;
  };
  
  // Genetic information
  geneticProfile: {
    carrierStatus: Array<{
      condition: string;
      status: HealthTestResult;
    }>;
    riskFactors: string[];
    clearances: string[];
  };
}

// Show Career Summary
export interface ShowCareer {
  petId: string;
  lastUpdated: Date;
  
  // Career overview
  totalShows: number;
  totalWins: number;
  winPercentage: number;
  majorWins: number;
  
  // Points and rankings
  totalPoints: number;
  currentRanking?: number;
  highestRanking?: number;
  
  // Titles and achievements
  titlesEarned: Array<{
    title: string;
    dateEarned: Date;
    organization: string;
  }>;
  
  // Performance by category
  performanceByType: Array<{
    showType: ShowType;
    showCount: number;
    winCount: number;
    winRate: number;
    bestAward: AwardType;
  }>;
  
  // Career highlights
  highlights: Array<{
    eventName: string;
    date: Date;
    achievement: string;
    significance: 'high' | 'medium' | 'low';
  }>;
  
  // Judging patterns
  judgePreferences: Array<{
    judgeId: string;
    judgeName: string;
    timesShown: number;
    wins: number;
    successRate: number;
  }>;
}

// Business Logic Patterns
export class HealthShowService {
  /**
   * Calculate health completeness score
   */
  static calculateHealthCompleteness(
    results: HealthExamResult[], 
    breedRequirements: HealthExamObject[]
  ): number {
    const requiredTests = breedRequirements.filter(req => 
      req.priority === HealthTestPriority.REQUIRED || 
      req.priority === HealthTestPriority.RECOMMENDED
    );
    
    const completedRequired = requiredTests.filter(req =>
      results.some(result => 
        result.examObjectId === req.id && 
        result.result !== HealthTestResult.PENDING &&
        result.result !== HealthTestResult.FAILED
      )
    );
    
    return requiredTests.length > 0 ? 
      Math.round((completedRequired.length / requiredTests.length) * 100) : 100;
  }
  
  /**
   * Calculate show achievement score
   */
  static calculateAchievementScore(results: ShowResult[]): number {
    let score = 0;
    
    results.forEach(result => {
      // Base points for placement
      const placementPoints = Math.max(0, 11 - result.placement);
      
      // Multiplier based on competition size
      const competitionMultiplier = Math.min(2, result.totalEntries / 50);
      
      // Award type bonus
      let awardBonus = 0;
      switch (result.award) {
        case AwardType.BEST_IN_SHOW: awardBonus = 50; break;
        case AwardType.BEST_IN_GROUP: awardBonus = 30; break;
        case AwardType.GROUP_PLACEMENT: awardBonus = 20; break;
        case AwardType.BEST_OF_BREED: awardBonus = 15; break;
        case AwardType.WINNERS_DOG:
        case AwardType.WINNERS_BITCH: awardBonus = 10; break;
        default: awardBonus = 5;
      }
      
      // Major win bonus
      const majorBonus = result.majorWin ? 10 : 0;
      
      score += (placementPoints * competitionMultiplier) + awardBonus + majorBonus;
    });
    
    return Math.round(score);
  }
  
  /**
   * Generate health recommendations
   */
  static generateHealthRecommendations(
    profile: HealthProfile,
    breedRequirements: HealthExamObject[]
  ): Array<{priority: string, recommendation: string, timeframe: string}> {
    const recommendations: Array<{priority: string, recommendation: string, timeframe: string}> = [];
    
    // Check missing required tests
    const requiredTests = breedRequirements.filter(req => req.priority === HealthTestPriority.REQUIRED);
    requiredTests.forEach(test => {
      const hasResult = profile.categories.some(cat => 
        cat.category === test.category && cat.status !== 'missing'
      );
      
      if (!hasResult) {
        recommendations.push({
          priority: 'high',
          recommendation: `Complete ${test.name} testing`,
          timeframe: 'immediate'
        });
      }
    });
    
    // Check for critical findings
    profile.criticalFindings.forEach(finding => {
      if (finding.severity === 'high') {
        recommendations.push({
          priority: 'urgent',
          recommendation: finding.recommendedAction,
          timeframe: 'immediate'
        });
      }
    });
    
    return recommendations;
  }
  
  /**
   * Validate health/show data for S0Fractal integration
   */
  static validateForGlyphSystem(data: Partial<HealthExamResult | ShowResult>): boolean {
    if ('examObjectId' in data) {
      // Health exam validation
      return !!(data.petId && data.examObjectId && data.testDate && data.result);
    } else {
      // Show result validation
      return !!(data.petId && data.eventId && data.eventDate && data.placement);
    }
  }
}

export {
  HealthExamObject,
  HealthExamResult,
  ShowEvent,
  ShowResult,
  HealthProfile,
  ShowCareer,
  HealthShowService
};
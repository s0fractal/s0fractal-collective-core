/**
 * Litter Schema - Extracted from BreedPride
 * Modernized for S0Fractal Collective Integration
 */

// Core Enums and Types
export enum LitterStatus {
  PLANNED = 'planned',
  CONFIRMED = 'confirmed',
  BORN = 'born',
  WEANED = 'weaned',
  READY = 'ready',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled'
}

export enum MatingType {
  NATURAL = 'natural',
  ARTIFICIAL_INSEMINATION = 'artificial_insemination',
  FROZEN_SEMEN = 'frozen_semen',
  CHILLED_SEMEN = 'chilled_semen'
}

export enum LitterLetter {
  A = 'A', B = 'B', C = 'C', D = 'D', E = 'E', F = 'F', G = 'G', H = 'H', I = 'I', J = 'J',
  K = 'K', L = 'L', M = 'M', N = 'N', O = 'O', P = 'P', Q = 'Q', R = 'R', S = 'S', T = 'T',
  U = 'U', V = 'V', W = 'W', X = 'X', Y = 'Y', Z = 'Z'
}

// Mating and Breeding Information
export interface MatingPeriod {
  id: string;
  startDate: Date;
  endDate: Date;
  type: MatingType;
  location?: string;
  veterinarianId?: string;
  notes?: string;
  progesteroneTests: Array<{
    date: Date;
    level: number;
    unit: string;
  }>;
  matings: Array<{
    date: Date;
    time?: string;
    successful: boolean;
    notes?: string;
  }>;
}

// Health and Veterinary Care
export interface LitterHealthRecord {
  mothersHealth: {
    preBreedingExam: {
      date: Date;
      veterinarianId: string;
      approved: boolean;
      notes?: string;
    };
    pregnancyMonitoring: Array<{
      date: Date;
      gestationDay: number;
      weight: number;
      heartRate?: number;
      bloodPressure?: string;
      ultrasoundFindings?: string;
      notes?: string;
    }>;
    birthComplications?: string;
    postBirthRecovery?: string;
  };
  
  litterHealthChecks: Array<{
    date: Date;
    ageInDays: number;
    veterinarianId: string;
    overallHealth: 'excellent' | 'good' | 'fair' | 'poor';
    notes?: string;
    individualChecks?: Array<{
      pupId: string;
      weight: number;
      condition: string;
      issues?: string[];
    }>;
  }>;
  
  vaccinations: Array<{
    date: Date;
    vaccine: string;
    manufacturer: string;
    lotNumber: string;
    veterinarianId: string;
    puppiesVaccinated: string[];
  }>;
  
  dewormings: Array<{
    date: Date;
    medication: string;
    dosage: string;
    allPuppies: boolean;
    specificPuppies?: string[];
  }>;
}

// Financial and Sales Information
export interface LitterFinancials {
  expenses: Array<{
    category: 'veterinary' | 'feed' | 'supplies' | 'marketing' | 'registration' | 'other';
    description: string;
    amount: number;
    currency: string;
    date: Date;
    receipt?: string;
  }>;
  
  income: Array<{
    source: 'puppy_sale' | 'stud_fee' | 'deposit' | 'other';
    description: string;
    amount: number;
    currency: string;
    date: Date;
    puppyId?: string;
    buyerId?: string;
  }>;
  
  studFee?: {
    amount: number;
    currency: string;
    paidDate?: Date;
    pickOfLitter: boolean;
    puppyBack: boolean;
  };
}

// Puppy Information
export interface PuppyInfo {
  id: string;
  temporaryName?: string;
  registeredName?: string;
  sex: 'male' | 'female';
  birthWeight: number;
  currentWeight?: number;
  color: string;
  markings?: string;
  microchipNumber?: string;
  microchipDate?: Date;
  
  // Health status
  healthStatus: 'healthy' | 'concerns' | 'special_needs';
  healthIssues?: string[];
  
  // Availability
  status: 'available' | 'reserved' | 'sold' | 'keeping' | 'deceased';
  price?: number;
  currency?: string;
  reservedBy?: string;
  reservationDate?: Date;
  soldTo?: string;
  saleDate?: Date;
  
  // Early assessment
  temperamentNotes?: string;
  earlyEvaluation?: {
    structure: string;
    movement: string;
    temperament: string;
    showPotential: 1 | 2 | 3 | 4 | 5;
    breedingPotential: 1 | 2 | 3 | 4 | 5;
  };
}

// Core Litter Schema
export interface LitterSchema {
  // Core Identity
  id: string;
  name: string;
  letter?: LitterLetter;
  kennelId?: string;
  kennelName?: string;
  
  // Parent Information
  fatherId: string;
  fatherName: string;
  motherId: string;
  motherName: string;
  
  // Basic Information
  petType: string;
  breedId?: string;
  breedName?: string;
  
  // Breeding and Birth
  matingPeriod: MatingPeriod;
  dateOfBirth?: Date;
  expectedDueDate?: Date;
  gestationPeriod?: number; // days
  
  // Litter Composition
  totalPuppies?: number;
  maleCount: number;
  femaleCount: number;
  puppies: PuppyInfo[];
  
  // Status and Timeline
  status: LitterStatus;
  startDate?: Date; // When planning began
  endDate?: Date; // When litter is complete
  
  // Ownership and Responsibility
  breederId: string;
  breederName: string;
  coBreederId?: string;
  coBreederName?: string;
  
  // Health and Veterinary
  healthRecord: LitterHealthRecord;
  
  // Financial Management
  financials: LitterFinancials;
  
  // Documentation and Media
  profileUrl?: string;
  coverImageUrl?: string;
  photos: string[];
  videos: string[];
  documents: Array<{
    type: 'health_certificate' | 'breeding_agreement' | 'registration' | 'other';
    url: string;
    filename: string;
    uploadDate: Date;
  }>;
  
  // Services and Features
  serviceFeatures: Array<{
    serviceId: string;
    serviceName: string;
    description: string;
    included: boolean;
    additionalCost?: number;
  }>;
  
  // Privacy and Visibility
  isPublic: boolean;
  showPrices: boolean;
  showReservedPuppies: boolean;
  
  // System Metadata
  notes?: string;
  createdOn: Date;
  createdBy: string;
  modifiedOn: Date;
  modifiedBy: string;
  
  // S0Fractal Integration
  glyphId?: string;
  lineageHash?: string;
  breedingValue: number;
  geneticContribution: number;
}

// Extended Types
export interface PlannedLitter extends LitterSchema {
  status: LitterStatus.PLANNED | LitterStatus.CONFIRMED;
  breedingPlan: {
    objectives: string[];
    expectedTraits: string[];
    healthConsiderations: string[];
    geneticGoals: string[];
    marketAnalysis?: {
      demandLevel: 'low' | 'moderate' | 'high';
      priceRange: { min: number; max: number; currency: string };
      competitionLevel: 'low' | 'moderate' | 'high';
    };
  };
  expectedPuppyCount: number;
  waitingList: Array<{
    contactId: string;
    contactName: string;
    joinDate: Date;
    preferences: {
      sex?: 'male' | 'female' | 'either';
      color?: string;
      purpose: 'pet' | 'show' | 'breeding' | 'performance';
    };
    deposit?: number;
    priority: number;
  }>;
}

// Field Configuration for S0Fractal
export interface LitterFieldConfig {
  fieldName: string;
  fieldType: 'text' | 'date' | 'select' | 'number' | 'boolean' | 'multiselect' | 'textarea';
  label: string;
  required: boolean;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
  options?: { value: string; label: string }[];
  glyph?: string;
}

export const LITTER_FIELD_CONFIGS: LitterFieldConfig[] = [
  {
    fieldName: 'name',
    fieldType: 'text',
    label: 'Litter Name',
    required: true,
    glyph: 'identity.name'
  },
  {
    fieldName: 'letter',
    fieldType: 'select',
    label: 'Litter Letter',
    required: false,
    options: Object.values(LitterLetter).map(letter => ({ value: letter, label: letter })),
    glyph: 'classification.letter'
  },
  {
    fieldName: 'status',
    fieldType: 'select',
    label: 'Status',
    required: true,
    options: [
      { value: 'planned', label: 'Planned' },
      { value: 'confirmed', label: 'Confirmed' },
      { value: 'born', label: 'Born' },
      { value: 'weaned', label: 'Weaned' },
      { value: 'ready', label: 'Ready for Homes' },
      { value: 'completed', label: 'Completed' },
      { value: 'cancelled', label: 'Cancelled' }
    ],
    glyph: 'lifecycle.status'
  },
  {
    fieldName: 'expectedDueDate',
    fieldType: 'date',
    label: 'Expected Due Date',
    required: false,
    glyph: 'time.due'
  },
  {
    fieldName: 'maleCount',
    fieldType: 'number',
    label: 'Male Count',
    required: false,
    validation: { min: 0, max: 20 },
    glyph: 'biology.male'
  },
  {
    fieldName: 'femaleCount',
    fieldType: 'number',
    label: 'Female Count',
    required: false,
    validation: { min: 0, max: 20 },
    glyph: 'biology.female'
  }
];

// Business Logic Patterns
export class LitterService {
  /**
   * Calculate litter success score
   */
  static calculateSuccessScore(litter: LitterSchema): number {
    let score = 0;
    
    // Successful birth (30 points)
    if (litter.status === LitterStatus.BORN || 
        litter.status === LitterStatus.WEANED || 
        litter.status === LitterStatus.READY || 
        litter.status === LitterStatus.COMPLETED) {
      score += 30;
    }
    
    // Puppy survival rate (25 points)
    const alivePuppies = litter.puppies.filter(p => p.status !== 'deceased').length;
    const survivalRate = alivePuppies / Math.max(1, litter.puppies.length);
    score += survivalRate * 25;
    
    // Health management (25 points)
    const healthChecks = litter.healthRecord.litterHealthChecks.length;
    const vaccinations = litter.healthRecord.vaccinations.length;
    score += Math.min(25, (healthChecks * 5) + (vaccinations * 5));
    
    // Sales/placement success (20 points)
    const placedPuppies = litter.puppies.filter(p => 
      p.status === 'sold' || p.status === 'keeping'
    ).length;
    const placementRate = placedPuppies / Math.max(1, litter.puppies.length);
    score += placementRate * 20;
    
    return Math.round(score);
  }
  
  /**
   * Calculate breeding value of litter
   */
  static calculateBreedingValue(litter: LitterSchema): number {
    let value = 0;
    
    // Parent quality (40 points)
    // This would need parent data, assuming it's available
    value += 20; // Base value
    
    // Genetic diversity (30 points)
    // Would need COI calculation from parent data
    value += 15; // Base value
    
    // Health clearances (20 points)
    const healthyPuppies = litter.puppies.filter(p => p.healthStatus === 'healthy').length;
    const healthRate = healthyPuppies / Math.max(1, litter.puppies.length);
    value += healthRate * 20;
    
    // Documentation quality (10 points)
    const docScore = Math.min(10, litter.documents.length * 2);
    value += docScore;
    
    return Math.round(value);
  }
  
  /**
   * Generate breeding insights
   */
  static generateBreedingInsights(litter: LitterSchema): Record<string, any> {
    const insights: Record<string, any> = {};
    
    // Timing analysis
    if (litter.matingPeriod && litter.dateOfBirth) {
      const gestationDays = Math.floor(
        (litter.dateOfBirth.getTime() - litter.matingPeriod.startDate.getTime()) / 
        (1000 * 60 * 60 * 24)
      );
      insights.gestationLength = gestationDays;
      insights.gestationNormal = gestationDays >= 58 && gestationDays <= 68;
    }
    
    // Litter size analysis
    insights.litterSize = litter.puppies.length;
    insights.litterSizeCategory = litter.puppies.length < 3 ? 'small' : 
                                  litter.puppies.length < 6 ? 'average' : 'large';
    
    // Sex ratio
    const maleRatio = litter.maleCount / Math.max(1, litter.maleCount + litter.femaleCount);
    insights.sexRatio = {
      male: Math.round(maleRatio * 100),
      female: Math.round((1 - maleRatio) * 100),
      balanced: Math.abs(maleRatio - 0.5) < 0.2
    };
    
    // Health summary
    const healthyCount = litter.puppies.filter(p => p.healthStatus === 'healthy').length;
    insights.healthSummary = {
      healthyPuppies: healthyCount,
      healthRate: Math.round((healthyCount / Math.max(1, litter.puppies.length)) * 100),
      commonIssues: litter.puppies
        .filter(p => p.healthIssues && p.healthIssues.length > 0)
        .flatMap(p => p.healthIssues!)
        .reduce((acc, issue) => {
          acc[issue] = (acc[issue] || 0) + 1;
          return acc;
        }, {} as Record<string, number>)
    };
    
    return insights;
  }
  
  /**
   * Calculate financial performance
   */
  static calculateFinancialPerformance(litter: LitterSchema): Record<string, number> {
    const totalExpenses = litter.financials.expenses.reduce((sum, expense) => sum + expense.amount, 0);
    const totalIncome = litter.financials.income.reduce((sum, income) => sum + income.amount, 0);
    const netResult = totalIncome - totalExpenses;
    
    const soldPuppies = litter.puppies.filter(p => p.status === 'sold').length;
    const avgPuppyPrice = soldPuppies > 0 ? 
      litter.puppies
        .filter(p => p.status === 'sold' && p.price)
        .reduce((sum, p) => sum + (p.price || 0), 0) / soldPuppies : 0;
    
    return {
      totalExpenses,
      totalIncome,
      netResult,
      profitMargin: totalIncome > 0 ? (netResult / totalIncome) * 100 : 0,
      costPerPuppy: litter.puppies.length > 0 ? totalExpenses / litter.puppies.length : 0,
      avgPuppyPrice,
      soldPuppies,
      remainingPuppies: litter.puppies.filter(p => p.status === 'available').length
    };
  }
  
  /**
   * Validate litter data for S0Fractal integration
   */
  static validateForGlyphSystem(litter: Partial<LitterSchema>): boolean {
    return !!(
      litter.name &&
      litter.fatherId &&
      litter.motherId &&
      litter.breederId &&
      litter.status
    );
  }
  
  /**
   * Generate timeline milestones
   */
  static generateMilestones(litter: LitterSchema): Array<{date: Date, event: string, status: 'completed' | 'upcoming' | 'overdue'}> {
    const milestones: Array<{date: Date, event: string, status: 'completed' | 'upcoming' | 'overdue'}> = [];
    const now = new Date();
    
    // Mating milestone
    milestones.push({
      date: litter.matingPeriod.startDate,
      event: 'Mating Period',
      status: litter.matingPeriod.startDate <= now ? 'completed' : 'upcoming'
    });
    
    // Expected due date
    if (litter.expectedDueDate) {
      milestones.push({
        date: litter.expectedDueDate,
        event: 'Expected Due Date',
        status: litter.dateOfBirth ? 'completed' : 
                litter.expectedDueDate <= now ? 'overdue' : 'upcoming'
      });
    }
    
    // Birth
    if (litter.dateOfBirth) {
      milestones.push({
        date: litter.dateOfBirth,
        event: 'Birth',
        status: 'completed'
      });
      
      // 8-week ready milestone
      const readyDate = new Date(litter.dateOfBirth);
      readyDate.setDate(readyDate.getDate() + 56); // 8 weeks
      milestones.push({
        date: readyDate,
        event: 'Ready for New Homes (8 weeks)',
        status: readyDate <= now ? 'completed' : 'upcoming'
      });
    }
    
    return milestones.sort((a, b) => a.date.getTime() - b.date.getTime());
  }
}

export default LitterSchema;
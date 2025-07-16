/**
 * Pet Pedigree Schema - Extracted from BreedPride
 * Modernized for S0Fractal Collective Integration
 */

// Core Enums and Types
export enum Sex {
  MALE = 'male',
  FEMALE = 'female'
}

export enum PetStatus {
  ACTIVE = 'active',
  DECEASED = 'deceased',
  MISSING = 'missing',
  RETIRED = 'retired'
}

export enum PetType {
  DOG = 'dog',
  CAT = 'cat',
  HORSE = 'horse',
  OTHER = 'other'
}

export enum CoatType {
  SHORT = 'short',
  MEDIUM = 'medium',
  LONG = 'long',
  WIRE = 'wire',
  CURLY = 'curly',
  DOUBLE = 'double'
}

export enum PetSize {
  TOY = 'toy',
  SMALL = 'small',
  MEDIUM = 'medium',
  LARGE = 'large',
  GIANT = 'giant'
}

// Identification and Registration
export interface PetIdentifier {
  id: string;
  type: {
    code: string;
    name: string;
  };
  value: string;
  issuedBy?: string;
  issuedDate?: Date;
  verified: boolean;
}

// Title and Achievement System
export interface PetTitle {
  id: string;
  title: string;
  abbreviation: string;
  awardedDate: Date;
  awardingBody: string;
  country: string;
  level: 'national' | 'international' | 'world';
  category: 'conformation' | 'performance' | 'working' | 'specialty';
}

// Health Records
export interface HealthExam {
  id: string;
  examType: string;
  result: 'clear' | 'carrier' | 'affected' | 'pending';
  testDate: Date;
  laboratoryName: string;
  certificateNumber?: string;
  notes?: string;
  attachments?: string[];
}

// Show Results
export interface ShowResult {
  id: string;
  eventName: string;
  eventDate: Date;
  judgeName: string;
  placement: number;
  totalEntries: number;
  award: string;
  points?: number;
  notes?: string;
  class: string;
}

// Timeline Events
export interface PetTimelineEvent {
  id: string;
  type: 'birth' | 'title' | 'health' | 'show' | 'breeding' | 'other';
  name: string;
  text: string;
  date: Date;
  publicationDate: Date;
}

// Measurements and Physical Data
export interface PetMeasurement {
  type: 'height' | 'weight' | 'length' | 'chest' | 'head';
  value: number;
  unit: string;
  measurementDate: Date;
  measuredBy?: string;
}

// Core Pet Schema
export interface PetPedigreeSchema {
  // Core Identity
  id: string;
  name: string;
  callName?: string;
  registeredName?: string;
  
  // Basic Information
  petType: PetType;
  breedId: string;
  breedName: string;
  breedDivision?: string;
  sex: Sex;
  dateOfBirth: Date;
  dateOfDeath?: Date;
  status: PetStatus;
  
  // Physical Characteristics
  coatType?: CoatType;
  coatColor?: string;
  size?: PetSize;
  bodyFeature?: string;
  weight?: number;
  measurements: PetMeasurement[];
  
  // Ownership and Breeding
  ownerId: string;
  ownerName: string;
  ownerKennelId?: string;
  breederId: string;
  breederName: string;
  kennelId?: string;
  kennelName?: string;
  
  // Pedigree Information
  fatherId?: string;
  fatherName?: string;
  motherId?: string;
  motherName?: string;
  litterId?: string;
  
  // Breeding Metrics
  inbreedingPercent?: number;
  coi?: number; // Coefficient of Inbreeding
  
  // Location
  countryOfBirth: string;
  countryOfStay?: string;
  
  // Identification
  identifiers: PetIdentifier[];
  
  // Achievements and Records
  titles: PetTitle[];
  healthExams: HealthExam[];
  showResults: ShowResult[];
  timeline: PetTimelineEvent[];
  
  // Visual Identity
  avatarUrl?: string;
  coverImageUrl?: string;
  profileUrl?: string;
  
  // Verification and Quality
  verificationStatus: string;
  rating: number;
  ratingPlacementInBreed?: number;
  
  // Availability and Services
  availableForSale: boolean;
  availableForBreeding: boolean;
  studFee?: number;
  serviceFeatures: string[];
  
  // Offspring and Family
  children?: string[]; // Pet IDs
  siblings?: string[]; // Pet IDs
  
  // Privacy and Visibility
  isPublic: boolean;
  publicData?: any;
  
  // System Metadata
  notes?: string;
  createdOn: Date;
  createdBy: string;
  modifiedOn: Date;
  modifiedBy: string;
  
  // S0Fractal Integration
  glyphId?: string;
  geneticHash?: string;
  pedigreeDepth: number;
  lineageScore: number;
}

// Pedigree Tree Structure
export interface PedigreeNode {
  pet: PetPedigreeSchema;
  father?: PedigreeNode;
  mother?: PedigreeNode;
  generation: number;
  inbreedingContribution: number;
}

// Field Configuration for S0Fractal
export interface PetFieldConfig {
  fieldName: string;
  fieldType: 'text' | 'date' | 'select' | 'number' | 'boolean' | 'multiselect' | 'file';
  label: string;
  required: boolean;
  validation?: {
    pattern?: string;
    min?: number;
    max?: number;
  };
  options?: { value: string; label: string }[];
  glyph?: string;
}

export const PET_FIELD_CONFIGS: PetFieldConfig[] = [
  {
    fieldName: 'name',
    fieldType: 'text',
    label: 'Pet Name',
    required: true,
    glyph: 'identity.name'
  },
  {
    fieldName: 'sex',
    fieldType: 'select',
    label: 'Sex',
    required: true,
    options: [
      { value: 'male', label: 'Male' },
      { value: 'female', label: 'Female' }
    ],
    glyph: 'biology.sex'
  },
  {
    fieldName: 'dateOfBirth',
    fieldType: 'date',
    label: 'Date of Birth',
    required: true,
    glyph: 'time.birth'
  },
  {
    fieldName: 'breedId',
    fieldType: 'select',
    label: 'Breed',
    required: true,
    glyph: 'genetics.breed'
  },
  {
    fieldName: 'coatColor',
    fieldType: 'text',
    label: 'Coat Color',
    required: false,
    glyph: 'appearance.coat'
  },
  {
    fieldName: 'weight',
    fieldType: 'number',
    label: 'Weight (kg)',
    required: false,
    validation: { min: 0, max: 200 },
    glyph: 'biology.weight'
  }
];

// Business Logic Patterns
export class PetPedigreeService {
  /**
   * Calculate pedigree completeness score
   */
  static calculatePedigreeCompleteness(pet: PetPedigreeSchema): number {
    let score = 0;
    const maxScore = 100;
    
    // Basic info (30 points)
    if (pet.name) score += 5;
    if (pet.dateOfBirth) score += 5;
    if (pet.breedId) score += 5;
    if (pet.sex) score += 5;
    if (pet.avatarUrl) score += 5;
    if (pet.countryOfBirth) score += 5;
    
    // Parents (30 points)
    if (pet.fatherId) score += 15;
    if (pet.motherId) score += 15;
    
    // Health and titles (20 points)
    score += Math.min(10, pet.healthExams.length * 2);
    score += Math.min(10, pet.titles.length * 3);
    
    // Identification (10 points)
    score += Math.min(10, pet.identifiers.length * 5);
    
    // Show results (10 points)
    score += Math.min(10, pet.showResults.length * 2);
    
    return Math.round((score / maxScore) * 100);
  }
  
  /**
   * Generate genetic diversity score
   */
  static calculateGeneticDiversity(pet: PetPedigreeSchema): number {
    if (!pet.inbreedingPercent && !pet.coi) return 0;
    
    const inbreeding = pet.inbreedingPercent || 0;
    const coi = pet.coi || 0;
    
    // Lower inbreeding = higher diversity
    const diversityScore = Math.max(0, 100 - (inbreeding * 10) - (coi * 100));
    return Math.round(diversityScore);
  }
  
  /**
   * Build pedigree tree to specified depth
   */
  static async buildPedigreeTree(
    petId: string, 
    depth: number = 4,
    petLookup: (id: string) => Promise<PetPedigreeSchema | null>
  ): Promise<PedigreeNode | null> {
    const pet = await petLookup(petId);
    if (!pet) return null;
    
    const node: PedigreeNode = {
      pet,
      generation: 0,
      inbreedingContribution: 0
    };
    
    if (depth > 0) {
      if (pet.fatherId) {
        node.father = await this.buildPedigreeTree(pet.fatherId, depth - 1, petLookup);
        if (node.father) node.father.generation = 1;
      }
      
      if (pet.motherId) {
        node.mother = await this.buildPedigreeTree(pet.motherId, depth - 1, petLookup);
        if (node.mother) node.mother.generation = 1;
      }
    }
    
    return node;
  }
  
  /**
   * Calculate lineage score based on achievements in bloodline
   */
  static calculateLineageScore(pedigreeTree: PedigreeNode): number {
    let score = 0;
    const visited = new Set<string>();
    
    function traverse(node: PedigreeNode | undefined, generation: number): void {
      if (!node || visited.has(node.pet.id) || generation > 4) return;
      
      visited.add(node.pet.id);
      
      // Score contribution decreases with generation
      const generationMultiplier = Math.pow(0.5, generation);
      
      // Points for titles
      score += node.pet.titles.length * 10 * generationMultiplier;
      
      // Points for show results
      const majorWins = node.pet.showResults.filter(r => r.placement <= 3).length;
      score += majorWins * 5 * generationMultiplier;
      
      // Points for health clearances
      const healthClears = node.pet.healthExams.filter(h => h.result === 'clear').length;
      score += healthClears * 3 * generationMultiplier;
      
      traverse(node.father, generation + 1);
      traverse(node.mother, generation + 1);
    }
    
    traverse(pedigreeTree, 0);
    return Math.round(score);
  }
  
  /**
   * Validate pet data for S0Fractal integration
   */
  static validateForGlyphSystem(pet: Partial<PetPedigreeSchema>): boolean {
    return !!(
      pet.name &&
      pet.sex &&
      pet.dateOfBirth &&
      pet.breedId &&
      pet.ownerId
    );
  }
  
  /**
   * Generate genetic hash for lineage tracking
   */
  static generateGeneticHash(pet: PetPedigreeSchema): string {
    const components = [
      pet.id,
      pet.fatherId || 'unknown',
      pet.motherId || 'unknown',
      pet.breedId,
      pet.sex,
      pet.dateOfBirth.getTime().toString()
    ];
    
    // Simple hash generation (in production, use crypto)
    return btoa(components.join('|')).slice(0, 16);
  }
}

export default PetPedigreeSchema;
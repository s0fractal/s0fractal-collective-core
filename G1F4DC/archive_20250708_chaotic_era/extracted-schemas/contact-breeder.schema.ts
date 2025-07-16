/**
 * Contact/Breeder Schema - Extracted from BreedPride
 * Modernized for S0Fractal Collective Integration
 */

// Core Enums and Types
export enum VerificationStatus {
  UNVERIFIED = 'unverified',
  PENDING = 'pending',
  VERIFIED = 'verified',
  PREMIUM = 'premium',
  EXPERT = 'expert'
}

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other'
}

export enum ContactDecisionRole {
  OWNER = 'owner',
  BREEDER = 'breeder',
  AGENT = 'agent',
  JUDGE = 'judge',
  VETERINARIAN = 'veterinarian'
}

export enum SalutationType {
  MR = 'Mr.',
  MRS = 'Mrs.',
  MS = 'Ms.',
  DR = 'Dr.',
  PROF = 'Prof.'
}

// Address and Location Types
export interface Address {
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
}

// Social Media Integration
export interface SocialMedia {
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
  website?: string;
  facebookId?: string;
  instagramId?: string;
  twitterId?: string;
  linkedinId?: string;
}

// Career and Professional Information
export interface Career {
  isBreeder: boolean;
  isJudge: boolean;
  isVeterinarian: boolean;
  specializations: string[];
  experience: number; // years
  achievements: string[];
}

// Breed Patronage System
export interface BreedPatronage {
  breedId: string;
  breedName: string;
  place: number;
  tier: 'bronze' | 'silver' | 'gold' | 'platinum';
  supportLevel: number;
  startDate: Date;
  endDate?: Date;
}

// Contact/Breeder Core Schema
export interface ContactBreederSchema {
  // Core Identity
  id: string;
  name: string;
  givenName: string;
  surname: string;
  middleName?: string;
  alternateNames?: string[];
  callName?: string;
  
  // Professional Information
  salutationType?: SalutationType;
  jobTitle?: string;
  decisionRole: ContactDecisionRole;
  career: Career;
  
  // Personal Information
  gender?: Gender;
  birthDate?: Date;
  age?: number;
  language: string;
  
  // Contact Information
  email: string;
  isEmailConfirmed: boolean;
  isNonActualEmail: boolean;
  phone?: string;
  mobilePhone?: string;
  homePhone?: string;
  skype?: string;
  
  // Address
  address?: Address;
  
  // Social Media
  socialMedia: SocialMedia;
  
  // Visual Identity
  avatarUrl?: string;
  coverImageUrl?: string;
  profileUrl?: string;
  
  // Verification and Trust
  verificationStatus: VerificationStatus;
  isVerified: boolean;
  rating: number;
  reviewCount: number;
  
  // Breed Community Involvement
  breedPatronage: BreedPatronage[];
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
  fractalLevel: number;
}

// Judge-Specific Extensions
export interface JudgeCompetition {
  id: string;
  name: string;
  internationalJudgment: boolean;
  nationalJudgment: boolean;
  order: number;
  subCompetitions?: JudgeCompetition[];
}

export interface JudgeProfile extends ContactBreederSchema {
  career: Career & {
    isJudge: true;
    competitions: JudgeCompetition[];
    certifications: string[];
    countries: string[];
  };
}

// Form Field Configuration for S0Fractal
export interface ContactFieldConfig {
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
  placeholder?: string;
  options?: { value: string; label: string }[];
  glyph?: string; // S0Fractal glyph mapping
}

export const CONTACT_FIELD_CONFIGS: ContactFieldConfig[] = [
  {
    fieldName: 'name',
    fieldType: 'text',
    label: 'Full Name',
    required: true,
    validation: { minLength: 2, maxLength: 100 },
    glyph: 'identity.name'
  },
  {
    fieldName: 'email',
    fieldType: 'email',
    label: 'Email Address',
    required: true,
    validation: { pattern: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$' },
    glyph: 'contact.email'
  },
  {
    fieldName: 'phone',
    fieldType: 'phone',
    label: 'Phone Number',
    required: false,
    glyph: 'contact.phone'
  },
  {
    fieldName: 'verificationStatus',
    fieldType: 'select',
    label: 'Verification Status',
    required: true,
    options: [
      { value: 'unverified', label: 'Unverified' },
      { value: 'pending', label: 'Pending' },
      { value: 'verified', label: 'Verified' },
      { value: 'premium', label: 'Premium' },
      { value: 'expert', label: 'Expert' }
    ],
    glyph: 'trust.verification'
  },
  {
    fieldName: 'career.isBreeder',
    fieldType: 'boolean',
    label: 'Is Breeder',
    required: false,
    glyph: 'role.breeder'
  },
  {
    fieldName: 'career.isJudge',
    fieldType: 'boolean',
    label: 'Is Judge',
    required: false,
    glyph: 'role.judge'
  }
];

// Business Logic Patterns
export class ContactBreederService {
  /**
   * Calculate trust score based on verification, rating, and patronage
   */
  static calculateTrustScore(contact: ContactBreederSchema): number {
    let score = 0;
    
    // Base verification score
    switch (contact.verificationStatus) {
      case VerificationStatus.EXPERT: score += 50; break;
      case VerificationStatus.PREMIUM: score += 40; break;
      case VerificationStatus.VERIFIED: score += 30; break;
      case VerificationStatus.PENDING: score += 10; break;
      default: score += 0;
    }
    
    // Rating contribution (0-40 points)
    score += Math.min(40, (contact.rating / 5) * 40);
    
    // Patronage contribution (0-10 points)
    const patronageScore = Math.min(10, contact.breedPatronage.length * 2);
    score += patronageScore;
    
    return Math.round(score);
  }
  
  /**
   * Determine display badges for contact
   */
  static getDisplayBadges(contact: ContactBreederSchema): string[] {
    const badges: string[] = [];
    
    if (contact.career.isBreeder) badges.push('breeder');
    if (contact.career.isJudge) badges.push('judge');
    if (contact.career.isVeterinarian) badges.push('veterinarian');
    if (contact.verificationStatus === VerificationStatus.EXPERT) badges.push('expert');
    if (contact.breedPatronage.length > 0) badges.push('patron');
    
    return badges;
  }
  
  /**
   * Validate contact data for S0Fractal integration
   */
  static validateForGlyphSystem(contact: Partial<ContactBreederSchema>): boolean {
    return !!(
      contact.name &&
      contact.email &&
      contact.verificationStatus &&
      contact.career
    );
  }
}

export default ContactBreederSchema;
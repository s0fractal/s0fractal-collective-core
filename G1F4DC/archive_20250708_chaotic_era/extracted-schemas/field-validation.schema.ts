/**
 * Field Validation & Configuration Schema
 * Comprehensive validation patterns extracted from BreedPride
 */

// Core Validation Types
export interface ValidationRule {
  type: 'required' | 'pattern' | 'length' | 'range' | 'custom' | 'enum' | 'email' | 'phone' | 'url';
  value?: any;
  message?: string;
  errorCode?: string;
}

export interface FieldValidation {
  fieldName: string;
  rules: ValidationRule[];
  dependencies?: string[]; // Other fields this validation depends on
  conditional?: {
    condition: string;
    thenRules: ValidationRule[];
    elseRules?: ValidationRule[];
  };
}

// Common Validation Patterns
export const COMMON_PATTERNS = {
  email: '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$',
  phone: '^[\\+]?[1-9]?[0-9]{7,15}$',
  url: '^https?:\\/\\/(www\\.)?[-a-zA-Z0-9@:%._\\+~#=]{1,256}\\.[a-zA-Z0-9()]{1,6}\\b([-a-zA-Z0-9()@:%_\\+.~#?&//=]*)$',
  kennelName: '^[A-Za-z][A-Za-z0-9\\s\\-\\.\']{1,49}$',
  petName: '^[A-Za-z][A-Za-z0-9\\s\\-\\.\'\\(\\)]{1,99}$',
  microchip: '^[0-9]{15}$',
  registrationNumber: '^[A-Z]{2,4}[0-9]{4,8}$',
  zipCode: '^[0-9]{5}(-[0-9]{4})?$',
  currency: '^[A-Z]{3}$',
  hex_color: '^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$'
} as const;

// Validation Rule Definitions
export const VALIDATION_RULES: Record<string, FieldValidation> = {
  // Contact/Breeder Validations
  'contact.name': {
    fieldName: 'name',
    rules: [
      { type: 'required', message: 'Name is required' },
      { type: 'length', value: { min: 2, max: 100 }, message: 'Name must be 2-100 characters' },
      { type: 'pattern', value: '^[A-Za-z][A-Za-z0-9\\s\\-\\.\']{1,99}$', message: 'Invalid name format' }
    ]
  },
  
  'contact.email': {
    fieldName: 'email',
    rules: [
      { type: 'required', message: 'Email is required' },
      { type: 'email', message: 'Invalid email format' },
      { type: 'length', value: { max: 255 }, message: 'Email too long' }
    ]
  },
  
  'contact.phone': {
    fieldName: 'phone',
    rules: [
      { type: 'pattern', value: COMMON_PATTERNS.phone, message: 'Invalid phone number format' }
    ]
  },
  
  'contact.birthDate': {
    fieldName: 'birthDate',
    rules: [
      { type: 'range', value: { 
        min: new Date('1920-01-01'), 
        max: new Date() 
      }, message: 'Invalid birth date' }
    ]
  },
  
  // Pet Validations
  'pet.name': {
    fieldName: 'name',
    rules: [
      { type: 'required', message: 'Pet name is required' },
      { type: 'length', value: { min: 1, max: 100 }, message: 'Pet name must be 1-100 characters' },
      { type: 'pattern', value: COMMON_PATTERNS.petName, message: 'Invalid pet name format' }
    ]
  },
  
  'pet.dateOfBirth': {
    fieldName: 'dateOfBirth',
    rules: [
      { type: 'required', message: 'Date of birth is required' },
      { type: 'range', value: { 
        min: new Date('1990-01-01'), 
        max: new Date() 
      }, message: 'Invalid birth date' }
    ]
  },
  
  'pet.weight': {
    fieldName: 'weight',
    rules: [
      { type: 'range', value: { min: 0.1, max: 200 }, message: 'Weight must be between 0.1 and 200 kg' }
    ]
  },
  
  'pet.microchipNumber': {
    fieldName: 'microchipNumber',
    rules: [
      { type: 'pattern', value: COMMON_PATTERNS.microchip, message: 'Microchip must be 15 digits' }
    ]
  },
  
  'pet.coi': {
    fieldName: 'coi',
    rules: [
      { type: 'range', value: { min: 0, max: 1 }, message: 'COI must be between 0 and 1' }
    ]
  },
  
  // Kennel Validations
  'kennel.name': {
    fieldName: 'name',
    rules: [
      { type: 'required', message: 'Kennel name is required' },
      { type: 'length', value: { min: 2, max: 50 }, message: 'Kennel name must be 2-50 characters' },
      { type: 'pattern', value: COMMON_PATTERNS.kennelName, message: 'Invalid kennel name format' }
    ]
  },
  
  'kennel.foundationDate': {
    fieldName: 'foundationDate',
    rules: [
      { type: 'required', message: 'Foundation date is required' },
      { type: 'range', value: { 
        min: new Date('1800-01-01'), 
        max: new Date() 
      }, message: 'Invalid foundation date' }
    ]
  },
  
  'kennel.website': {
    fieldName: 'website',
    rules: [
      { type: 'url', message: 'Invalid website URL format' }
    ]
  },
  
  // Litter Validations
  'litter.expectedDueDate': {
    fieldName: 'expectedDueDate',
    rules: [
      { type: 'range', value: { 
        min: new Date(), 
        max: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) 
      }, message: 'Due date must be within the next year' }
    ]
  },
  
  'litter.maleCount': {
    fieldName: 'maleCount',
    rules: [
      { type: 'range', value: { min: 0, max: 20 }, message: 'Male count must be 0-20' }
    ]
  },
  
  'litter.femaleCount': {
    fieldName: 'femaleCount',
    rules: [
      { type: 'range', value: { min: 0, max: 20 }, message: 'Female count must be 0-20' }
    ]
  },
  
  // Health Exam Validations
  'health.testDate': {
    fieldName: 'testDate',
    rules: [
      { type: 'required', message: 'Test date is required' },
      { type: 'range', value: { 
        min: new Date('2000-01-01'), 
        max: new Date() 
      }, message: 'Test date must be between 2000 and today' }
    ]
  },
  
  'health.certificateNumber': {
    fieldName: 'certificateNumber',
    rules: [
      { type: 'pattern', value: '^[A-Z0-9\\-]{5,20}$', message: 'Invalid certificate number format' }
    ]
  },
  
  // Show Result Validations
  'show.placement': {
    fieldName: 'placement',
    rules: [
      { type: 'required', message: 'Placement is required' },
      { type: 'range', value: { min: 1, max: 1000 }, message: 'Placement must be 1-1000' }
    ]
  },
  
  'show.totalEntries': {
    fieldName: 'totalEntries',
    rules: [
      { type: 'required', message: 'Total entries is required' },
      { type: 'range', value: { min: 1, max: 10000 }, message: 'Total entries must be 1-10000' }
    ]
  },
  
  // Breed Validations
  'breed.name': {
    fieldName: 'name',
    rules: [
      { type: 'required', message: 'Breed name is required' },
      { type: 'length', value: { min: 2, max: 100 }, message: 'Breed name must be 2-100 characters' }
    ]
  },
  
  'breed.originCountry': {
    fieldName: 'originCountry',
    rules: [
      { type: 'required', message: 'Origin country is required' },
      { type: 'pattern', value: '^[A-Z]{2}$', message: 'Country code must be 2 uppercase letters' }
    ]
  }
};

// Conditional Validation Examples
export const CONDITIONAL_VALIDATIONS: FieldValidation[] = [
  {
    fieldName: 'dateOfDeath',
    rules: [],
    conditional: {
      condition: 'status === "deceased"',
      thenRules: [
        { type: 'required', message: 'Date of death is required for deceased pets' }
      ]
    }
  },
  
  {
    fieldName: 'studFee',
    rules: [],
    dependencies: ['sex', 'availableForBreeding'],
    conditional: {
      condition: 'sex === "male" && availableForBreeding === true',
      thenRules: [
        { type: 'required', message: 'Stud fee is required for breeding males' },
        { type: 'range', value: { min: 0, max: 50000 }, message: 'Stud fee must be 0-50000' }
      ]
    }
  },
  
  {
    fieldName: 'kennelPrefix',
    rules: [],
    dependencies: ['hasKennelName', 'affixType'],
    conditional: {
      condition: 'hasKennelName === true && (affixType === "prefix" || affixType === "both")',
      thenRules: [
        { type: 'required', message: 'Kennel prefix is required' },
        { type: 'length', value: { min: 2, max: 20 }, message: 'Prefix must be 2-20 characters' }
      ]
    }
  },
  
  {
    fieldName: 'litterId',
    rules: [],
    dependencies: ['dateOfBirth'],
    conditional: {
      condition: 'dateOfBirth && new Date() - dateOfBirth < 365 * 24 * 60 * 60 * 1000',
      thenRules: [
        { type: 'required', message: 'Litter ID is required for pets under 1 year' }
      ]
    }
  }
];

// Cross-Field Validation Rules
export interface CrossFieldValidation {
  name: string;
  fields: string[];
  validator: (values: Record<string, any>) => boolean;
  message: string;
  errorCode?: string;
}

export const CROSS_FIELD_VALIDATIONS: CrossFieldValidation[] = [
  {
    name: 'parent_age_validation',
    fields: ['fatherId', 'motherId', 'dateOfBirth'],
    validator: (values) => {
      // Parents should be at least 1 year old when offspring is born
      // This would need access to parent birth dates
      return true; // Simplified for example
    },
    message: 'Parents must be at least 1 year old at time of breeding'
  },
  
  {
    name: 'litter_count_validation',
    fields: ['maleCount', 'femaleCount', 'totalPuppies'],
    validator: (values) => {
      const total = (values.maleCount || 0) + (values.femaleCount || 0);
      return total === (values.totalPuppies || total);
    },
    message: 'Male count + Female count must equal total puppies'
  },
  
  {
    name: 'show_placement_validation',
    fields: ['placement', 'totalEntries'],
    validator: (values) => {
      return values.placement <= values.totalEntries;
    },
    message: 'Placement cannot be higher than total entries'
  },
  
  {
    name: 'breeding_age_validation',
    fields: ['dateOfBirth', 'availableForBreeding'],
    validator: (values) => {
      if (!values.availableForBreeding) return true;
      const birthDate = new Date(values.dateOfBirth);
      const ageInMonths = (new Date().getTime() - birthDate.getTime()) / (1000 * 60 * 60 * 24 * 30);
      return ageInMonths >= 18; // At least 18 months old
    },
    message: 'Pet must be at least 18 months old to be available for breeding'
  },
  
  {
    name: 'test_date_vs_birth_date',
    fields: ['testDate', 'petBirthDate'],
    validator: (values) => {
      return new Date(values.testDate) >= new Date(values.petBirthDate);
    },
    message: 'Test date cannot be before birth date'
  }
];

// Validation Engine
export class ValidationEngine {
  /**
   * Validate a single field value
   */
  static validateField(fieldName: string, value: any, allValues?: Record<string, any>): string[] {
    const validation = VALIDATION_RULES[fieldName];
    if (!validation) return [];
    
    const errors: string[] = [];
    
    // Apply base rules
    for (const rule of validation.rules) {
      const error = this.applyRule(rule, value);
      if (error) errors.push(error);
    }
    
    // Apply conditional rules
    if (validation.conditional && allValues) {
      const conditionMet = this.evaluateCondition(validation.conditional.condition, allValues);
      const rulesToApply = conditionMet ? 
        validation.conditional.thenRules : 
        (validation.conditional.elseRules || []);
      
      for (const rule of rulesToApply) {
        const error = this.applyRule(rule, value);
        if (error) errors.push(error);
      }
    }
    
    return errors;
  }
  
  /**
   * Validate all fields in an object
   */
  static validateObject(obj: Record<string, any>): Record<string, string[]> {
    const errors: Record<string, string[]> = {};
    
    // Single field validations
    for (const [key, value] of Object.entries(obj)) {
      const fieldErrors = this.validateField(key, value, obj);
      if (fieldErrors.length > 0) {
        errors[key] = fieldErrors;
      }
    }
    
    // Cross-field validations
    for (const crossValidation of CROSS_FIELD_VALIDATIONS) {
      const hasAllFields = crossValidation.fields.every(field => field in obj);
      if (hasAllFields) {
        const fieldValues = crossValidation.fields.reduce((acc, field) => {
          acc[field] = obj[field];
          return acc;
        }, {} as Record<string, any>);
        
        if (!crossValidation.validator(fieldValues)) {
          // Add error to the first field in the validation
          const firstField = crossValidation.fields[0];
          if (!errors[firstField]) errors[firstField] = [];
          errors[firstField].push(crossValidation.message);
        }
      }
    }
    
    return errors;
  }
  
  /**
   * Apply a single validation rule
   */
  private static applyRule(rule: ValidationRule, value: any): string | null {
    switch (rule.type) {
      case 'required':
        return (value === null || value === undefined || value === '') ? 
          (rule.message || 'This field is required') : null;
      
      case 'pattern':
        if (value && typeof value === 'string') {
          const regex = new RegExp(rule.value);
          return regex.test(value) ? null : (rule.message || 'Invalid format');
        }
        return null;
      
      case 'email':
        if (value && typeof value === 'string') {
          const emailRegex = new RegExp(COMMON_PATTERNS.email);
          return emailRegex.test(value) ? null : (rule.message || 'Invalid email format');
        }
        return null;
      
      case 'length':
        if (value && typeof value === 'string') {
          const { min, max } = rule.value;
          if (min && value.length < min) return rule.message || `Minimum length is ${min}`;
          if (max && value.length > max) return rule.message || `Maximum length is ${max}`;
        }
        return null;
      
      case 'range':
        if (value !== null && value !== undefined) {
          const { min, max } = rule.value;
          const numValue = Number(value);
          if (!isNaN(numValue)) {
            if (min !== undefined && numValue < min) return rule.message || `Minimum value is ${min}`;
            if (max !== undefined && numValue > max) return rule.message || `Maximum value is ${max}`;
          }
          if (value instanceof Date) {
            if (min && value < min) return rule.message || `Date must be after ${min.toLocaleDateString()}`;
            if (max && value > max) return rule.message || `Date must be before ${max.toLocaleDateString()}`;
          }
        }
        return null;
      
      case 'enum':
        return rule.value.includes(value) ? null : 
          (rule.message || `Value must be one of: ${rule.value.join(', ')}`);
      
      case 'url':
        if (value && typeof value === 'string') {
          const urlRegex = new RegExp(COMMON_PATTERNS.url);
          return urlRegex.test(value) ? null : (rule.message || 'Invalid URL format');
        }
        return null;
      
      default:
        return null;
    }
  }
  
  /**
   * Evaluate a condition string (simplified)
   */
  private static evaluateCondition(condition: string, values: Record<string, any>): boolean {
    // This is a simplified implementation
    // In production, you'd want a more robust expression evaluator
    try {
      const func = new Function('values', `with(values) { return ${condition}; }`);
      return func(values);
    } catch {
      return false;
    }
  }
  
  /**
   * Get validation rules for a specific field
   */
  static getValidationRules(fieldName: string): FieldValidation | undefined {
    return VALIDATION_RULES[fieldName];
  }
  
  /**
   * Check if a field is required
   */
  static isFieldRequired(fieldName: string, allValues?: Record<string, any>): boolean {
    const validation = VALIDATION_RULES[fieldName];
    if (!validation) return false;
    
    // Check base rules
    const hasRequiredRule = validation.rules.some(rule => rule.type === 'required');
    if (hasRequiredRule) return true;
    
    // Check conditional rules
    if (validation.conditional && allValues) {
      const conditionMet = this.evaluateCondition(validation.conditional.condition, allValues);
      const rulesToCheck = conditionMet ? 
        validation.conditional.thenRules : 
        (validation.conditional.elseRules || []);
      
      return rulesToCheck.some(rule => rule.type === 'required');
    }
    
    return false;
  }
}

export default {
  VALIDATION_RULES,
  CONDITIONAL_VALIDATIONS,
  CROSS_FIELD_VALIDATIONS,
  COMMON_PATTERNS,
  ValidationEngine
};
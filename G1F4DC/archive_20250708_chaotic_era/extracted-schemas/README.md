# BreedPride Schema Extraction for S0Fractal Collective

This directory contains the extracted and modernized domain models from the BreedPride project, adapted for integration with the S0Fractal collective architecture.

## 📁 Schema Files

### Core Entity Schemas
- **`contact-breeder.schema.ts`** - Contact/Breeder management with verification and social features
- **`pet-pedigree.schema.ts`** - Pet genealogy tracking with health records and achievements
- **`kennel-account.schema.ts`** - Breeding operation management and kennel information
- **`breed.schema.ts`** - Breed characteristics, patronage system, and community management
- **`litter.schema.ts`** - Breeding tracking and puppy management
- **`health-show.schema.ts`** - Health examinations and show result tracking

### Integration Schema
- **`s0fractal-integration.schema.ts`** - Glyph-based collective integration patterns

## 🌟 Key Features Extracted

### 1. Contact/Breeder Management
- **Verification System**: Multi-tier verification (unverified → pending → verified → premium → expert)
- **Social Integration**: Facebook, Instagram, LinkedIn, Twitter profiles
- **Professional Roles**: Breeder, Judge, Veterinarian classifications
- **Trust Scoring**: Calculated from verification, rating, and patronage
- **Breed Patronage**: Tiered support system for breed communities

### 2. Pet Pedigree & Genealogy
- **Complete Lineage**: Father/mother tracking with unlimited depth
- **Health Records**: Comprehensive health examination tracking
- **Show Results**: Competition achievements and titles
- **Genetic Metrics**: Inbreeding coefficient (COI) and diversity scoring
- **Timeline System**: Life events and milestones tracking
- **Identification**: Multiple ID types (microchip, registration, etc.)

### 3. Kennel Operations
- **Multi-Breed Support**: Kennel specialization tracking
- **Service Management**: Breeding, training, boarding services
- **Review System**: Customer feedback and recommendations
- **Achievement Tracking**: Awards and recognition system
- **Financial Metrics**: Operation efficiency and sustainability scoring

### 4. Breed Community
- **Characteristics**: Physical traits and temperament profiling
- **Patronage System**: Tiered community support (Bronze → Diamond)
- **Health Standards**: Breed-specific health requirements
- **Achievement System**: Community milestones and recognition
- **Preservation Tracking**: Population monitoring for rare breeds

### 5. Breeding Operations
- **Litter Planning**: Mating schedules and genetic planning
- **Health Monitoring**: Pregnancy and puppy health tracking
- **Financial Management**: Expense and income tracking
- **Puppy Management**: Individual puppy tracking and sales
- **Timeline Milestones**: Breeding cycle management

### 6. Health & Show Systems
- **Health Testing**: Genetic and physical examination protocols
- **Test Management**: Laboratory results and certification
- **Show Tracking**: Competition results and career statistics
- **Achievement Scoring**: Performance-based ranking systems
- **Compliance Monitoring**: Breed-specific health requirements

## 🔮 S0Fractal Integration Features

### Glyph System Integration
Each entity type maps to specific glyphs for collective representation:

- **Identity Glyphs**: `◈` (name), `⬟` (registration)
- **Genetics Glyphs**: `⟐` (lineage), `◊` (breed), `⟡` (COI)
- **Health Glyphs**: `⚕` (status), `✓` (clearance), `⚠` (carrier)
- **Achievement Glyphs**: `♔` (title), `★` (show), `♚` (breeding)
- **Social Glyphs**: `⌘` (trust), `⚊` (verification), `♦` (patronage)
- **Temporal Glyphs**: `◐` (birth), `◑` (foundation), `◒` (achievement)
- **Geographic Glyphs**: `⬢` (origin), `⬡` (territory)

### Collective Node Structure
```typescript
interface CollectiveNode {
  nodeId: string;
  nodeType: 'contact' | 'pet' | 'kennel' | 'breed' | 'litter' | 'event';
  glyphSignature: string;
  fractalLevel: number;  // 1-5 complexity
  trustScore: number;    // 0-100 trust rating
  parentNodes: string[];
  childNodes: string[];
}
```

### Consensus Mechanisms
- **Verification Proposals**: Community-driven verification process
- **Standard Updates**: Collaborative breed standard maintenance
- **Knowledge Contributions**: Shared research and data integration
- **Dispute Resolution**: Decentralized conflict resolution

## 🏗️ Business Logic Patterns

### Trust Scoring Algorithms
Each entity type includes sophisticated trust calculation:
- **Contacts**: Verification status + rating + patronage activity
- **Pets**: Health testing + show achievements + lineage quality
- **Kennels**: Years of operation + reviews + achievements + verification

### Data Validation
Comprehensive validation patterns for S0Fractal integration:
- Required field validation
- Cross-entity relationship validation
- Glyph signature generation and verification
- Data integrity checks

### Performance Metrics
Built-in scoring systems for community assessment:
- **Health Completeness**: Percentage of recommended tests completed
- **Breeding Success**: Litter success rates and genetic diversity
- **Show Achievement**: Competition performance scoring
- **Community Engagement**: Participation and contribution metrics

## 🔧 Integration Utilities

### Data Transformation
The `S0FractalTransformer` class provides methods to convert BreedPride entities into S0Fractal collective nodes:

```typescript
// Convert entities to collective nodes
const contactNode = S0FractalTransformer.contactToNode(contact);
const petNode = S0FractalTransformer.petToNode(pet);
const kennelNode = S0FractalTransformer.kennelToNode(kennel);
```

### Field Configuration
Each schema includes form field configurations ready for UI integration:
- Field types, validation rules, and glyph mappings
- Multi-language support patterns
- Responsive validation patterns

### Service Classes
Business logic encapsulated in service classes:
- `ContactBreederService` - Trust scoring and badge management
- `PetPedigreeService` - Lineage analysis and genetic scoring
- `KennelAccountService` - Reputation and efficiency metrics
- `BreedService` - Community health and preservation scoring
- `LitterService` - Breeding success and financial analysis
- `HealthShowService` - Health completeness and achievement scoring

## 📋 Form Field Configurations

Each schema includes ready-to-use field configurations:

```typescript
interface FieldConfig {
  fieldName: string;
  fieldType: 'text' | 'email' | 'select' | 'date' | 'number' | 'boolean';
  label: string;
  required: boolean;
  validation?: ValidationRules;
  options?: OptionsList;
  glyph?: string;  // S0Fractal glyph mapping
}
```

## 🔐 Privacy & Security

### Data Privacy Levels
- **Public**: Community-visible information
- **Verified**: Available to verified collective members
- **Private**: Owner/authorized access only
- **Collective**: Shared within specific breeding collectives

### Verification Tiers
- **Unverified**: Basic profile information
- **Pending**: Verification in progress
- **Verified**: Community-verified identity
- **Premium**: Enhanced verification with additional features
- **Expert**: Professional recognition with full privileges

## 🚀 Integration Roadmap

### Phase 1: Core Entity Integration
1. Implement basic entity schemas in S0Fractal
2. Set up glyph mapping system
3. Create collective node structure
4. Implement trust scoring algorithms

### Phase 2: Relationship Mapping
1. Establish parent-child relationships
2. Implement lineage tracking
3. Create breeding operation connections
4. Set up community patronage links

### Phase 3: Consensus System
1. Implement verification proposals
2. Create knowledge contribution system
3. Set up dispute resolution mechanisms
4. Establish collective governance

### Phase 4: Advanced Features
1. AI-powered genetic analysis
2. Predictive breeding recommendations
3. Health trend analysis
4. Market intelligence integration

## 📊 Validation & Testing

### Data Integrity Checks
- Cross-reference validation between related entities
- Temporal consistency validation
- Genetic relationship verification
- Health data completeness scoring

### Performance Benchmarks
- Trust score calculation efficiency
- Glyph signature generation speed
- Collective consensus processing
- Real-time synchronization performance

## 🔗 External Integrations

### Registry Connections
- AKC (American Kennel Club) integration
- FCI (Fédération Cynologique Internationale) support
- UKC (United Kennel Club) compatibility
- National breed registry connections

### Health Database Integration
- OFA (Orthopedic Foundation for Animals)
- CHIC (Canine Health Information Center)
- Laboratory result imports
- Veterinary system connections

### Show System Integration
- AKC event results
- UKC show data
- International competition results
- Specialty show tracking

## 📝 License & Usage

These schemas are extracted from the BreedPride project and adapted for S0Fractal collective use. They maintain compatibility with the original data structures while adding modern collective intelligence features.

For implementation questions or integration support, refer to the individual schema files for detailed type definitions and business logic patterns.
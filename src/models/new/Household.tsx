import { PersonAddress } from "./PersonAddress";
import {
    AccommodationType, CheckListAnswer,
    EntryPoint, EstimatedMonthlyIncome, HouseholdBecoming, HouseholdClassification,
    HousingSituation,
    MainCombustible,
    MainElectricitySource,
    MainWaterSource
} from "./Enumerations";

export interface Household {
    geographicalLocation?: any;
    householdAddress?: PersonAddress;
    location?: any;
    identifiers?: HouseholdIdentifier[];
    socialCenter?: any;
    members?: HouseholdMember[];
    evaluations?: HouseholdEvaluation[];
    characteristics?: HouseholdCharacteristic[];
    structures?: HouseholdStructure[];
    addresses?: HouseholdAddress[];
    graduations?: HouseholdGraduation[];
    uuid?: string;
}

export interface HouseholdAddress {
    startDate?: Date;
    geographicalLocation?: any;
    endDate?: Date;
    address?: any;
    uuid?: string;
}

export interface HouseholdCharacteristic {
    householdSize?: number;
    registrationDate?: Date;
    location?: any;
    numberOfActivePerson?: number;
    numberOfOvc?: number;
    numberOfMealPerDay?: number;
    entryPoint?: EntryPoint;
    otherEntryPoint?: string;
    accommodationType?: AccommodationType;
    otherAccommodationType?: string;
    numberOfRoom?: number;
    housingSituation?: HousingSituation;
    otherHousingSituation?: string;
    hasWaterCloset?: boolean;
    hasLatrine?: boolean;
    hasBathroom?: boolean;
    hasKitchen?: boolean;
    mainWaterSource?: MainWaterSource;
    otherMainWaterSource?: string;
    mainElectricitySource?: MainElectricitySource;
    otherMainElectricitySource?: string;
    mainCombustible?: MainCombustible;
    otherMainCombustible?: string;
    hasTelephone?: boolean;
    hasTelevision?: boolean;
    hasRadio?: boolean;
    hasRefrigerator?: boolean;
    hasSocialCapital?: boolean;
    socialCapital?: string;
    incomeFromProfessionalActivity?: boolean;
    incomeFromFamilySupport?: boolean;
    incomeFromExternalSupport?: boolean;
    otherIncomeSource?: string;
    estimatedMonthlyIncome?: EstimatedMonthlyIncome;
    estimatedMonthlyExpenses?: number;
    socialCenter?: any;
    householdClassification?: HouseholdClassification;
    householdBecoming?: HouseholdBecoming;
    householdBecomingDate?: Date;
    otherHouseholdBecoming?: string;
    transferDestination?: string;
    uuid?: string;
}

export interface HouseholdEvaluation {
    evaluationDate?: Date;
    firstEvaluation?: boolean;
    
    foodSecurityScore?: number; // nutritional_security
    nutritionScore?: number; // water_accessibility
    healthScore?: number; // household_health
    childrenEducationScore?: number; // education
    incomeScore?: number; // household_income
    employmentScore?: number; // household_employment
    shelterAndAccommodationScore?: number; // shelter_housing
    personInChargeScore?: number; // head_household
    protectionScore?: number; // protection

    evaluator1?: any;
    evaluator2?: any;
    location?: string;
    uuid?: string;
}

export interface HouseholdIdentifier {
    identifier?: string;
    identifierLocation?: any;
    uuid?: string;
}

export interface HouseholdMember {
    patient?: any;
    joiningDate?: Date;
    householdChief?: boolean;
    careGiver?: boolean;
    vulnerableChild?: boolean;
    orderNumber?: string;
    takingCareOrderNumber?: string;
    location?: any;
    leavingDate?: Date;
    uuid?: string;
}

export interface HouseholdGraduation {
    graduationDate?: Date;
    memberHivStatusKnown?: CheckListAnswer;
    memberViralLoadSuppressed?: CheckListAnswer;
    memberHealthCareInsured?: CheckListAnswer;
    childrenOverTenInAnnouncingStatus?: CheckListAnswer;
    hivPatientSharedStatus?: CheckListAnswer
    householdEconomicallyStable?: CheckListAnswer
    unreportedMalnutrition?: CheckListAnswer
    homeSafeForChildren?: CheckListAnswer
    noVedanLastSixMonths?: CheckListAnswer
    appropriateServiceVedanSixIssues?: CheckListAnswer
    adultInHouseholdSinceSixMonth?: CheckListAnswer
    childrenAttendingRegularlySchool?: CheckListAnswer
    nonSchoolInApprenticeshipForSixMonth?: CheckListAnswer;
    schoolFeesCovered?: CheckListAnswer;
    intervention1?: string;
    intervention1Date?: Date;
    intervention2?: string;
    intervention2Date?: Date;
    intervention3?: string;
    intervention3Date?: Date;
    intervention4?: string;
    intervention4Date?: Date;
    intervention5?: string;
    intervention5Date?: Date;
    intervention6?: string;
    intervention6Date?: Date;
    intervention7?: string;
    intervention7Date?: Date;
    intervention8?: string;
    intervention8Date?: Date;
    intervention9?: string;
    intervention9Date?: Date;
    intervention10?: string;
    intervention10Date?: Date;
    location?: any;
    uuid?: string;
}

export interface HouseholdStructure {
    startDate?: Date;
    structure?: any;
    endDate?: Date;
    uuid?: string;
}
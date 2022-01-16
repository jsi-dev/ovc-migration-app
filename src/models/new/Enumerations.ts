export enum EntryPoint {
  CDV,
  PTME,
  CDIP,
  ASSOC_PVVIH,
  CS,
  CAT_CDT,
  OTHER,
}

export enum AccommodationType {
  VILLA,
  FLAT,
  STRIP_HOUSE,
  COMMON_COURTYARD,
  HUT,
  OTHER,
}

export enum HousingSituation {
  OWNER,
  TENANT,
  FAMILY_HOME,
  OTHER,
}

export enum MainWaterSource {
  RUNNING_WATER,
  HYDRAULIC_WATER_OR_DRILLING,
  WELL,
  SPRING_WATER,
  OTHER,
}

export enum MainElectricitySource {
  ELECTRICITY,
  STORM_LAMP,
  NOTHING,
  OTHER,
}

export enum MainCombustible {
  GAZ,
  CHARCOAL,
  WOOD,
  OTHER,
}

export enum EstimatedMonthlyIncome {
  LESS_THAN_50000,
  FROM_50001_TO_100000,
  FROM_100001_TO_200000,
  FROM_200001_TO_300000,
  FROM_300001_TO_500000,
  MORE_THAN_500000,
}

export enum HouseholdClassification {
  EXTREMELY_VULNERABLE,
  HIGHLY_VULNERABLE,
  VULNERABLE,
  NOT_VULNERABLE,
}

export enum HouseholdBecoming {
  RELOCATED,
  TRANSFERRED,
  GRADUATED,
  OTHER,
}

export enum CheckListAnswer {
  YES,
  NO,
  NOT_APPLICABLE,
}

export const getEntryPoint = (value: string | undefined) => {
  if (!value) {
    return undefined;
  }
  let entryPoint: EntryPoint;
  switch (parseInt(value)) {
    case 1:
      entryPoint = EntryPoint.CDV;
      break;
    case 2:
      entryPoint = EntryPoint.PTME;
      break;
    case 3:
      entryPoint = EntryPoint.CDIP;
      break;
    case 4:
      entryPoint = EntryPoint.ASSOC_PVVIH;
      break;
    case 5:
      entryPoint = EntryPoint.CS;
      break;
    case 6:
      entryPoint = EntryPoint.CAT_CDT;
      break;
    default:
      entryPoint = EntryPoint.OTHER;
  }
  return entryPoint;
};

export const getAccommodationType = (value: string | undefined) => {
  if (!value) {
    return undefined;
  }
  let accommodation: AccommodationType;
  switch (parseInt(value)) {
    case 1:
      accommodation = AccommodationType.VILLA;
      break;
    case 2:
      accommodation = AccommodationType.FLAT;
      break;
    case 3:
      accommodation = AccommodationType.STRIP_HOUSE;
      break;
    case 4:
      accommodation = AccommodationType.COMMON_COURTYARD;
      break;
    case 5:
      accommodation = AccommodationType.HUT;
      break;

    default:
      accommodation = AccommodationType.OTHER;
  }
  return accommodation;
};

export const getHouseSituation = (value: string | undefined) => {
  if (!value) {
    return undefined;
  }

  let houseSituation: HousingSituation;

  switch (parseInt(value)) {
    case 1:
      houseSituation = HousingSituation.OWNER;
      break;
    case 2:
      houseSituation = HousingSituation.TENANT;
      break;
    case 3:
      houseSituation = HousingSituation.FAMILY_HOME;
      break;

    default:
      houseSituation = HousingSituation.OTHER;
      break;
  }

  return houseSituation;
};

export const getMainWaterSource = (
  value: string | undefined
): MainWaterSource | undefined => {
  if (!value) {
    return undefined;
  }
  let mainWaterSource: MainWaterSource;
  switch (parseInt(value)) {
    case 1:
      mainWaterSource = MainWaterSource.RUNNING_WATER;
      break;
    case 2:
      mainWaterSource = MainWaterSource.HYDRAULIC_WATER_OR_DRILLING;
      break;
    case 3:
      mainWaterSource = MainWaterSource.SPRING_WATER;
      break;
    case 4:
      mainWaterSource = MainWaterSource.WELL;
      break;
    default:
      mainWaterSource = MainWaterSource.OTHER;
      break;
  }
  return mainWaterSource;
};

export const getMainCombustible = (
  value: string | undefined
): MainCombustible | undefined => {
  if (value) {
    let mainCombustible: MainCombustible;
    switch (parseInt(value)) {
      case 1:
        mainCombustible = MainCombustible.GAZ;
        break;
      case 2:
        mainCombustible = MainCombustible.CHARCOAL;
        break;
      case 3:
        mainCombustible = MainCombustible.WOOD;
        break;
      default:
        mainCombustible = MainCombustible.OTHER;
        break;
    }
    return mainCombustible;
  }
  return undefined;
};

export const getMainElectricitySource = (
  value: string | undefined
): MainElectricitySource | undefined => {
  if (value) {
    let mainElectricitySource: MainElectricitySource;
    switch (parseInt(value)) {
      case 1:
        mainElectricitySource = MainElectricitySource.ELECTRICITY;
        break;
      case 2:
        mainElectricitySource = MainElectricitySource.STORM_LAMP;
        break;
      default:
        mainElectricitySource = MainElectricitySource.OTHER;
        break;
    }
    return mainElectricitySource;
  }
  return undefined;
};

export const getEstimatedMonthlyIncome = (
  value: string | undefined
): EstimatedMonthlyIncome | undefined => {
  let estimatedMonthlyIncome: EstimatedMonthlyIncome | undefined;
  if (value){
    switch (parseInt(value)) {
      case 1:
        estimatedMonthlyIncome = EstimatedMonthlyIncome.LESS_THAN_50000;
        break;
      case 2:
        estimatedMonthlyIncome = EstimatedMonthlyIncome.FROM_50001_TO_100000;
        break;
      case 3:
        estimatedMonthlyIncome = EstimatedMonthlyIncome.FROM_100001_TO_200000;
        break;
      case 4:
        estimatedMonthlyIncome = EstimatedMonthlyIncome.FROM_200001_TO_300000;
        break;
      case 5:
        estimatedMonthlyIncome = EstimatedMonthlyIncome.FROM_300001_TO_500000;
        break;
      case 6:
        estimatedMonthlyIncome = EstimatedMonthlyIncome.MORE_THAN_500000;
        break;
      default:
        estimatedMonthlyIncome = undefined;
        break;
    }
  }
  return estimatedMonthlyIncome;
};

export const getHouseClassification = (
  value: string | undefined
): HouseholdClassification | undefined => {
  if (value) {
    let householdClassification: HouseholdClassification | undefined;
    switch (parseInt(value)) {
      case 1:
        householdClassification = HouseholdClassification.EXTREMELY_VULNERABLE;
        break;
      case 2:
        householdClassification = HouseholdClassification.EXTREMELY_VULNERABLE;
        break;
      case 3:
        householdClassification = HouseholdClassification.VULNERABLE;
        break;
      case 4:
        householdClassification = HouseholdClassification.NOT_VULNERABLE;
        break;

      default:
        householdClassification = undefined;
        break;
    }

    return householdClassification;
  }
  return undefined;
};

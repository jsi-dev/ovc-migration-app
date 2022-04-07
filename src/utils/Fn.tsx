import { TransferListData, TransferListItem } from '@mantine/core';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import dayjs from 'dayjs';
import { Encounter } from '../models/new/Encounter';
import {
  CheckListAnswer,
  getAccommodationType,
  getEntryPoint,
  getEstimatedMonthlyIncome,
  getHouseClassification,
  getHouseSituation,
  getMainCombustible,
  getMainElectricitySource,
  getMainWaterSource,
} from '../models/new/Enumerations';
import {
  Household,
  HouseholdAddress,
  HouseholdCharacteristic,
  HouseholdEvaluation,
  HouseholdGraduation,
  HouseholdMember,
} from '../models/new/Household';
import { Obs } from '../models/new/Obs';
import { Patient } from '../models/new/Patient';
import { PatientIdentifier } from '../models/new/PatientIdentifier';
import { Person, PersonAddress } from '../models/new/Person';
import {
  OldHousehold,
  OldHouseholdEvaluation,
  OldHouseholdGraduation,
} from '../models/old/Household';
import { Member } from '../models/old/Member';
import { MemberEvaluation } from '../models/old/MemberEvaluation';
import { MemberSupportActivity } from '../models/old/MemberSupportActivity';
import { NutritionalFollowupInfo } from '../models/old/NutritionalFollowup';
import { Reference } from '../models/old/Reference';
import { SchoolFollowupInfo } from '../models/old/SchoolFollowup';
import {
  activityMapping,
  evaluationMapping,
  identificationMapping,
  nutritionalFollowupMapping,
  referenceMapping,
  schoolFollowupMapping,
} from './mapping';
import { ErrorMessage } from '../models/other/utils';

dayjs.extend(customParseFormat);

const minLimitDate = dayjs('31/12/2018', 'DD/MM/YYYY');

// const errorMessages: ErrorMessage[] = [];

// console.log(minLimitDate.isBefore('01/01/2018'))

const isEmptyOrSpaces = (str: any) => {
  // console.log(str);
  return (
    str === undefined ||
    str === null ||
    (str instanceof String && str.match(/^ *$/)) !== null
  );
};

const isGoodHouseholdCode = (code: string): boolean => {
  if (code.match(/^[0-9]{3}.{3}[0-9]{4}[0-9]{4}$/)) {
    return true;
  }
  return false;
};

const isGoodBeneficiaryCode = (code: string): boolean => {
  if (code.match(/^[0-9]{3}.{3}[0-9]{4}[0-9]{6}$/)) {
    return true;
  }
  // console.log('is not correct', code);
  return false;
};
const getName = (
  id: number | undefined,
  structures: TransferListItem[]
): TransferListItem[] => {
  return structures.filter((s) => id && parseInt(s.description) === id);
};

const createTransferListData = (
  data: any,
  value: string,
  label: string,
  labelTxt: string,
  image: string,
  description: string
): TransferListData => {
  const listItem: TransferListItem[] = data.map((d: any) => {
    return {
      value: d[value],
      image: '000'.slice(d[image]?.toString().length) + d[image],
      label: labelTxt + ' ' + d[label],
      description: d[description],
    };
  });
  return [listItem, []];
};

const getLocation = (
  isSocialCenter: boolean,
  socialCenterCode: string | undefined,
  structureId: number | undefined
) => {
  if (isSocialCenter && socialCenterCode) {
    return getSocialCenter(socialCenterCode);
  }
  if (structureId) {
    return getNgo(structureId);
  }
  return '';
};

const getSocialCenter = (code: string | undefined) => {
  if (code) return 'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS' + code;
  return undefined;
};

const getNgo = (structureId: number | undefined) => {
  const code = '000'.slice(structureId?.toString().length) + structureId + 'O';
  return 'OOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO'.slice(code.length) + code;
};

const getIsSocialCenter = (
  structure: number | undefined,
  structures: TransferListItem[]
): boolean => {
  return (
    getName(structure, structures)[0].value.includes('CS ') ||
    getName(structure, structures)[0].value.includes('CENTRE SOCIAL')
  );
};

const addZero = (value: string | number | undefined) => {
  if (value) {
    if (
      (typeof value === 'number' && value < 10) ||
      (typeof value === 'string' && value.length === 1)
    )
      return '0' + value;
    // else if (typeof value === 'string' && value.length === 1) return '0' + value;
    return value;
  }
  return '';
};

const transformCharacteristic = (
  old: OldHousehold,
  structures: TransferListItem[]
) => {
  const isSocialCenter = getIsSocialCenter(old?.structure, structures);

  const messages: ErrorMessage[] = [];

  const characteristics: HouseholdCharacteristic[] = [];

  const registrationDateString =
    addZero(old.identification_date_month?.toString()) +
    '-' +
    addZero(old.identification_date_day?.toString()) +
    '-' +
    old.identification_date_year;
  // console.log(
  //   dayjs(registrationDateString, 'MM-DD-YYYY').toDate(),
  //   'household date'
  // );

  if (!dayjs(registrationDateString, 'MM-DD-YYYY').toDate()) {
    messages.push({
      tool: "Fiche d'identification",
      household: old.household_code,
      member: '',
      structure: getName(old.structure, structures)[0].value,
      message: "Date d'enregistrement",
      data: registrationDateString,
    });
  }
  if (
    !old.member_number ||
    parseInt(old.member_number) === 0 ||
    !parseInt(old.member_number)
  ) {
    messages.push({
      tool: "Fiche d'identification",
      household: old.household_code,
      member: '',
      structure: getName(old.structure, structures)[0].value,
      message: 'Taille du ménage',
      data: old.member_number ? old.member_number : 'Non renseigné',
    });
  }

  if (
    !old.ovc_number ||
    parseInt(old.ovc_number) === 0 ||
    !parseInt(old.ovc_number)
  ) {
    messages.push({
      tool: "Fiche d'identification",
      household: old.household_code,
      member: '',
      structure: getName(old.structure, structures)[0].value,
      message: "Nombre d'OEV",
      data: old.ovc_number ? old.ovc_number : 'Non renseigné',
    });
  }

  if (
    !old.estimated_monthly_income ||
    parseInt(old.estimated_monthly_income) === 0 ||
    !parseInt(old.estimated_monthly_income)
  ) {
    messages.push({
      tool: "Fiche d'identification",
      household: old.household_code,
      member: '',
      structure: getName(old.structure, structures)[0].value,
      message: 'Estimation du revenu',
      data: old.estimated_monthly_income
        ? old.estimated_monthly_income
        : 'Non renseigné',
    });
  }

  // errorMessages.push(...messages);
  // console.log(errorMessages);

  if (messages.length === 0) {
    characteristics.push({
      householdSize: old.member_number
        ? parseInt(old.member_number)
        : undefined,
      registrationDate: dayjs(registrationDateString, 'MM-DD-YYYY').toDate(),
      location: getLocation(
        isSocialCenter,
        old.social_center_code,
        old.structure
      ),
      // (isSocialCenter ? old.social_center_code : old.structure) +
      // 'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS'.slice(
      //   (isSocialCenter ? old.social_center_code : old.structure)?.toString()
      //     .length
      // ),
      numberOfActivePerson: old.active_persons_number
        ? parseInt(old.active_persons_number)
        : undefined,
      numberOfOvc: old.ovc_number ? parseInt(old.ovc_number) : undefined,
      numberOfMealPerDay: old.meal_number
        ? parseInt(old.meal_number)
        : undefined,
      entryPoint: getEntryPoint(old.entry_point),
      otherEntryPoint: old.other_entry_point,
      accommodationType: getAccommodationType(old.housing_type),
      otherAccommodationType: old.other_housing_type,
      numberOfRoom: old.room_number ? parseInt(old.room_number) : undefined,
      housingSituation: getHouseSituation(old.house_situation),
      otherHousingSituation: old.other_housing_type,
      hasWaterCloset: old.commodity?.includes('A'),
      hasLatrine: old.commodity?.includes('B'),
      hasBathroom: old.commodity?.includes('C'),
      hasKitchen: old.commodity?.includes('D'),
      mainWaterSource: getMainWaterSource(old.main_water_source),
      otherMainWaterSource: old.other_main_water_source,
      mainElectricitySource: getMainElectricitySource(
        old.main_electricity_source
      ),
      otherMainElectricitySource: old.other_main_electricity_source,
      mainCombustible: getMainCombustible(old.main_combustible),
      otherMainCombustible: old.other_main_combustible,
      hasTelephone: old.other_household_resource?.includes('A'),
      hasTelevision: old.other_household_resource?.includes('B'),
      hasRadio: old.other_household_resource?.includes('C'),
      hasRefrigerator: old.other_household_resource?.includes('D'),
      hasSocialCapital: old.social_capital
        ? parseInt(old.social_capital) === 1
          ? 1
          : 0
        : 0,
      socialCapital: old.other_social_capital,
      incomeFromProfessionalActivity: old.main_incoming_source?.includes('A'),
      incomeFromFamilySupport: old.main_incoming_source?.includes('B'),
      incomeFromExternalSupport: old.main_incoming_source?.includes('C'),
      otherIncomeSource: old.other_incoming_source,
      estimatedMonthlyIncome: getEstimatedMonthlyIncome(
        old.estimated_monthly_income
      ),
      estimatedMonthlyExpenses: old.estimated_monthly_expense
        ? parseInt(old.estimated_monthly_expense)
        : undefined,
      socialCenter: getSocialCenter(old.social_center_code),
      householdClassification: getHouseClassification(old.classification),
      householdBecoming: undefined,
      householdBecomingDate: undefined,
      otherHouseholdBecoming: undefined,
      transferDestination: undefined,
      uuid: old.household_code + 'HHHHHHHHHHHHHHHHHHHHHHHH',
    });
  }

  return {
    characteristics,
    messages,
  };
};

const createRegionUuid = (code: string | undefined) => {
  if (code) {
    return 'RRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRRR' + code;
  }
  return undefined;
};

const createDepartmentUuid = (code: string | undefined) => {
  if (code) {
    return 'DDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDDD' + code;
  }
  return undefined;
};

const createSubPrefectureUuid = (code: string | undefined) => {
  if (code) {
    return 'SPSPSPSPSPSPSPSPSPSPSPSPSPSPSPS' + code;
  }
  return undefined;
};

const createVillageUuid = (code: string | undefined) => {
  if (code) {
    return 'CCCCCCCCCCCCCCCCCCCCCCCCCCCCC' + code;
  }
  return undefined;
};

const createNeighborhoodUuid = (code: string | undefined) => {
  if (code) {
    return 'QQQQQQQQQQQQQQQQQQQQQQQQQQQ' + code;
  }
  return undefined;
};

const transformHouseholds = (
  oldHouseholds: OldHousehold[],
  structures: TransferListItem[]
) => {
  // console.log('In console', oldHouseholds);
  const households: Household[] = [];
  // const members: HouseholdMember[] = [];
  // const patients: Patient[] = [];
  // const persons: Person[] = [];
  const householdMessages: ErrorMessage[] = [];

  oldHouseholds.forEach((h) => {
    if (h.household_code && isGoodHouseholdCode(h.household_code)) {
      const isSocialCenter =
        getName(h?.structure, structures)[0].value.includes('CS ') ||
        getName(h?.structure, structures)[0].value.includes('CENTRE SOCIAL');

      const regionCode = h.region?.toString();
      const departmentCode = h.region
        ? h.region?.toString() + h.department?.toString()
        : undefined;
      const subPrefectureCode = h.region
        ? h.region?.toString() +
          h.department?.toString() +
          h.sub_prefecture?.toString()
        : undefined;
      const villageCode = h.region
        ? h.region?.toString() +
          h.department?.toString() +
          h.sub_prefecture?.toString() +
          h.village?.toString()
        : undefined;
      const neighborhoodCode = h.region
        ? h.region?.toString() +
          h.department?.toString() +
          h.sub_prefecture?.toString() +
          h.village?.toString() +
          h.neighborhood?.toString()
        : undefined;

      const region = createRegionUuid(regionCode);
      const department = createDepartmentUuid(departmentCode);
      const subPrefecture = createSubPrefectureUuid(subPrefectureCode);
      const village = createVillageUuid(villageCode);
      const neighborhood = createNeighborhoodUuid(neighborhoodCode);

      const { characteristics, messages } = transformCharacteristic(
        h,
        structures
      );

      householdMessages.push(...messages);

      households.push({
        geographicalLocation: null,
        location: getLocation(
          isSocialCenter,
          h.social_center_code,
          h.structure
        ),
        identifiers: [
          {
            identifier: h.household_code,
            identifierLocation: getLocation(
              isSocialCenter,
              h.social_center_code,
              h.structure
            ),
            uuid: h.household_code + 'IIIIIIIIIIIIIIIIIIIIIIII',
          },
        ],
        characteristics,
        socialCenter: getSocialCenter(h.social_center_code),
        addresses: [
          {
            startDate: dayjs(
              addZero(h.identification_date_month?.toString()) +
                '-' +
                addZero(h.identification_date_day?.toString()) +
                '-' +
                h.identification_date_year,
              'MM-DD-YYYY'
            ).toDate(),
            endDate: dayjs(
              addZero(h.identification_date_month?.toString()) +
                '-' +
                addZero(h.identification_date_day?.toString()) +
                '-' +
                h.identification_date_year,
              'MM-DD-YYYY'
            ).toDate(),
            // geographicalLocation: neighborhood,
            address: {
              address1: h.block,
              address2: h.batch,
              address3: h.reference,
              address4: neighborhood,
              country: region,
              countyDistrict: department,
              stateProvince: subPrefecture,
              cityVillage: village,
              uuid: h.household_code + 'AAAAAAAAAAAAAAAAAAAAAAAA',
            },
          },
        ],
        uuid: h.household_code + 'HHHHHHHHHHHHHHHHHHHHHHHH',
      });
    }
  });

  return {
    households,
    householdMessages,
  };
};

const transformHouseholdEvaluations = (
  oldEvaluations: OldHouseholdEvaluation[],
  structures: TransferListItem[]
) => {
  const evaluationMessages: ErrorMessage[] = [];

  const householdEvaluations: HouseholdEvaluation[] = oldEvaluations.reduce(
    (evaluations: HouseholdEvaluation[], e: OldHouseholdEvaluation) => {
      if (e.household_code && isGoodHouseholdCode(e.household_code)) {
        const isSocialCenter =
          getName(e?.structure, structures)[0].value.includes('CS ') ||
          getName(e?.structure, structures)[0].value.includes('CENTRE SOCIAL');

        if (
          !e.nutritional_security1 ||
          parseInt(e.nutritional_security1) === 0 ||
          !parseInt(e.nutritional_security1)
        ) {
          evaluationMessages.push({
            tool: "Fiche d'évaluation",
            household: e.household_code,
            member: '',
            structure: getName(e.structure, structures)[0].value,
            message: 'Score sécurité alimentaire',
            data: e.nutritional_security1
              ? e.nutritional_security1
              : 'Non renseigné',
          });
        }

        if (
          !e.water_accessibility1 ||
          parseInt(e.water_accessibility1) === 0 ||
          !parseInt(e.water_accessibility1)
        ) {
          evaluationMessages.push({
            tool: "Fiche d'évaluation",
            household: e.household_code,
            member: '',
            structure: getName(e.structure, structures)[0].value,
            message: "Score accessibilité à l'eau",
            data: e.water_accessibility1
              ? e.water_accessibility1
              : 'Non renseigné',
          });
        }

        if (
          !e.household_health1 ||
          parseInt(e.household_health1) === 0 ||
          !parseInt(e.household_health1)
        ) {
          evaluationMessages.push({
            tool: "Fiche d'évaluation",
            household: e.household_code,
            member: '',
            structure: getName(e.structure, structures)[0].value,
            message: 'Score santé',
            data: e.household_health1 ? e.household_health1 : 'Non renseigné',
          });
        }

        if (
          !e.eduction1 ||
          parseInt(e.eduction1) === 0 ||
          !parseInt(e.eduction1)
        ) {
          evaluationMessages.push({
            tool: "Fiche d'évaluation",
            household: e.household_code,
            member: '',
            structure: getName(e.structure, structures)[0].value,
            message: 'Score éducation',
            data: e.eduction1 ? e.eduction1 : 'Non renseigné',
          });
        }

        if (
          !e.household_income_1 ||
          parseInt(e.household_income_1) === 0 ||
          !parseInt(e.household_income_1)
        ) {
          evaluationMessages.push({
            tool: "Fiche d'évaluation",
            household: e.household_code,
            member: '',
            structure: getName(e.structure, structures)[0].value,
            message: 'Score du revenu',
            data: e.household_income_1 ? e.household_income_1 : 'Non renseigné',
          });
        }

        if (
          !e.household_employment_1 ||
          parseInt(e.household_employment_1) === 0 ||
          !parseInt(e.household_employment_1)
        ) {
          evaluationMessages.push({
            tool: "Fiche d'évaluation",
            household: e.household_code,
            member: '',
            structure: getName(e.structure, structures)[0].value,
            message: "Score pour l'emploi",
            data: e.household_employment_1
              ? e.household_employment_1
              : 'Non renseigné',
          });
        }

        if (
          !e.shelter_housing_1 ||
          parseInt(e.shelter_housing_1) === 0 ||
          !parseInt(e.shelter_housing_1)
        ) {
          evaluationMessages.push({
            tool: "Fiche d'évaluation",
            household: e.household_code,
            member: '',
            structure: getName(e.structure, structures)[0].value,
            message: 'Score pour abri et logement',
            data: e.shelter_housing_1 ? e.shelter_housing_1 : 'Non renseigné',
          });
        }

        if (
          !e.head_household_1 ||
          parseInt(e.head_household_1) === 0 ||
          !parseInt(e.head_household_1)
        ) {
          evaluationMessages.push({
            tool: "Fiche d'évaluation",
            household: e.household_code,
            member: '',
            structure: getName(e.structure, structures)[0].value,
            message: 'Score pour responsable',
            data: e.head_household_1 ? e.head_household_1 : 'Non renseigné',
          });
        }

        if (
          !e.protection_1 ||
          parseInt(e.protection_1) === 0 ||
          !parseInt(e.protection_1)
        ) {
          evaluationMessages.push({
            tool: "Fiche d'évaluation",
            household: e.household_code,
            member: '',
            structure: getName(e.structure, structures)[0].value,
            message: 'Score pour la protection',
            data: e.protection_1 ? e.protection_1 : 'Non renseigné',
          });
        }

        if (evaluationMessages.length === 0) {
          evaluations.push({
            evaluationDate: dayjs(e.evaluation1_date, 'DD/MM/YYYY').toDate(),
            firstEvaluation: true,
            foodSecurityScore: e.nutritional_security1
              ? parseInt(e.nutritional_security1)
              : undefined, // nutritional_security
            nutritionScore: e.water_accessibility1
              ? parseInt(e.water_accessibility1)
              : undefined, // water_accessibility
            healthScore: e.household_health1
              ? parseInt(e.household_health1)
              : undefined, // household_health
            childrenEducationScore: e.eduction1
              ? parseInt(e.eduction1)
              : undefined, // education
            incomeScore: e.household_income_1
              ? parseInt(e.household_income_1)
              : undefined, // household_income
            employmentScore: e.household_employment_1
              ? parseInt(e.household_employment_1)
              : undefined, // household_employment
            shelterAndAccommodationScore: e.shelter_housing_1
              ? parseInt(e.shelter_housing_1)
              : undefined, // shelter_housing
            personInChargeScore: e.head_household_1
              ? parseInt(e.head_household_1)
              : undefined, // head_household
            protectionScore: e.protection_1
              ? parseInt(e.protection_1)
              : undefined, // protection
            location: getLocation(isSocialCenter, e.cs_code, e.structure),
            // (isSocialCenter ? e.cs_code : e.structure) +
            // 'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS'.slice(
            //   (isSocialCenter ? e.cs_code : e.structure)?.toString().length
            // ),
            uuid:
              e.household_code +
              e.evaluation1_date?.replaceAll('/', '') +
              'EEEEEEEEEEEEEEEE',
          });

          if (e.evaluation2_date) {
            evaluations.push({
              evaluationDate: dayjs(e.evaluation2_date, 'DD/MM/YYYY').toDate(),
              firstEvaluation: false,
              foodSecurityScore: e.nutritional_security_2
                ? parseInt(e.nutritional_security_2)
                : undefined, // nutritional_security
              nutritionScore: e.water_accessibility_2
                ? parseInt(e.water_accessibility_2)
                : undefined, // water_accessibility
              healthScore: e.household_health_2
                ? parseInt(e.household_health_2)
                : undefined, // household_health
              childrenEducationScore: e.eduction_2
                ? parseInt(e.eduction_2)
                : undefined, // education
              incomeScore: e.income_household_2
                ? parseInt(e.income_household_2)
                : undefined, // household_income
              employmentScore: e.household_employment_2
                ? parseInt(e.household_employment_2)
                : undefined, // household_employment
              shelterAndAccommodationScore: e.shelter_housing_2
                ? parseInt(e.shelter_housing_2)
                : undefined, // shelter_housing
              personInChargeScore: e.head_household_2
                ? parseInt(e.head_household_2)
                : undefined, // head_household
              protectionScore: e.protection_2
                ? parseInt(e.protection_2)
                : undefined, // protection
              location: getLocation(isSocialCenter, e.cs_code, e.structure),
              // (isSocialCenter ? e.cs_code : e.structure) +
              // 'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS'.slice(
              //   (isSocialCenter ? e.cs_code : e.structure)?.toString().length
              // ),
              uuid:
                e.household_code +
                e.evaluation2_date.replaceAll('/', '') +
                'EEEEEEEEEEEEEEEE',
            });
          }
        }
      }

      return evaluations;
    },
    []
  );

  return {
    householdEvaluations,
    evaluationMessages,
  };
};

const transformGraduations = (
  oldGraduations: OldHouseholdGraduation[],
  structures: TransferListItem[]
): HouseholdGraduation[] => {
  const householdGraduations: HouseholdGraduation[] = [];

  // console.log('oldGraduations', oldGraduations);

  // if (oldGraduations.length === 0) {
  //   return [];
  // }

  // console.log('beginning graduation transform');

  oldGraduations.forEach((g) => {
    if (g.code_household && isGoodHouseholdCode(g.code_household)) {
      const isSocialCenter =
        getName(g?.structure, structures)[0].value.includes('CS ') ||
        getName(g?.structure, structures)[0].value.includes('CENTRE SOCIAL');

      householdGraduations.push({
        graduationDate: dayjs(g.date_evaluation, 'DD/MM/YYYY').toDate(),
        memberHivStatusKnown:
          g.response_sit1 === 'O'
            ? CheckListAnswer.YES
            : g.response_sit1 === 'N'
            ? CheckListAnswer.NO
            : CheckListAnswer.NOT_APPLICABLE,
        memberViralLoadSuppressed:
          g.response_sit_2 === 'O'
            ? CheckListAnswer.YES
            : g.response_sit_2 === 'N'
            ? CheckListAnswer.NO
            : CheckListAnswer.NOT_APPLICABLE,
        memberHealthCareInsured:
          g.response_sit_3 === 'O'
            ? CheckListAnswer.YES
            : g.response_sit_3 === 'N'
            ? CheckListAnswer.NO
            : CheckListAnswer.NOT_APPLICABLE,
        childrenOverTenInAnnouncingStatus:
          g.response_sit_4 === 'O'
            ? CheckListAnswer.YES
            : g.response_sit_4 === 'N'
            ? CheckListAnswer.NO
            : CheckListAnswer.NOT_APPLICABLE,
        hivPatientSharedStatus:
          g.response_sit_5 === 'O'
            ? CheckListAnswer.YES
            : g.response_sit_5 === 'N'
            ? CheckListAnswer.NO
            : CheckListAnswer.NOT_APPLICABLE,
        householdEconomicallyStable:
          g.response_sit_6 === 'O'
            ? CheckListAnswer.YES
            : g.response_sit_6 === 'N'
            ? CheckListAnswer.NO
            : CheckListAnswer.NOT_APPLICABLE,
        unreportedMalnutrition:
          g.response_sit_7 === 'O'
            ? CheckListAnswer.YES
            : g.response_sit_7 === 'N'
            ? CheckListAnswer.NO
            : CheckListAnswer.NOT_APPLICABLE,
        homeSafeForChildren:
          g.response_sit_8 === 'O'
            ? CheckListAnswer.YES
            : g.response_sit_8 === 'N'
            ? CheckListAnswer.NO
            : CheckListAnswer.NOT_APPLICABLE,
        noVedanLastSixMonths:
          g.response_sit_9 === 'O'
            ? CheckListAnswer.YES
            : g.response_sit_9 === 'N'
            ? CheckListAnswer.NO
            : CheckListAnswer.NOT_APPLICABLE,
        appropriateServiceVedanSixIssues:
          g.response_sit_10 === 'O'
            ? CheckListAnswer.YES
            : g.response_sit_10 === 'N'
            ? CheckListAnswer.NO
            : CheckListAnswer.NOT_APPLICABLE,
        adultInHouseholdSinceSixMonth:
          g.response_sit_11 === 'O'
            ? CheckListAnswer.YES
            : g.response_sit_11 === 'N'
            ? CheckListAnswer.NO
            : CheckListAnswer.NOT_APPLICABLE,
        childrenAttendingRegularlySchool:
          g.response_sit_12 === 'O'
            ? CheckListAnswer.YES
            : g.response_sit_12 === 'N'
            ? CheckListAnswer.NO
            : CheckListAnswer.NOT_APPLICABLE,
        nonSchoolInApprenticeshipForSixMonth:
          g.response_sit_13 === 'O'
            ? CheckListAnswer.YES
            : g.response_sit_13 === 'N'
            ? CheckListAnswer.NO
            : CheckListAnswer.NOT_APPLICABLE,
        schoolFeesCovered:
          g.response_sit_14 === 'O'
            ? CheckListAnswer.YES
            : g.response_sit_14 === 'N'
            ? CheckListAnswer.NO
            : CheckListAnswer.NOT_APPLICABLE,
        location: getLocation(isSocialCenter, g.cs_code, g.structure),
        // (isSocialCenter ? g.cs_code : g.structure) +
        // 'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS'.slice(
        //   (isSocialCenter ? g.cs_code : g.structure)?.toString().length
        // ),
        uuid: g.code_household + 'GGGGGGGGGGGGGGGGGGGGGG',
      });
    }
  });

  return householdGraduations;
};

const transformAddresses = (
  old: OldHousehold[],
  structures: TransferListItem[]
) => {
  const addresses: PersonAddress[] = [];
  const householdAddresses: HouseholdAddress[] = [];
  old.forEach((h) => {
    addresses.push({
      address1: h.block,
      address2: h.batch,
      address3: h.reference,
      uuid: h.household_code + 'AAAAAAAAAAAAAAAAAAAAAA',
    });

    householdAddresses.push({
      startDate: dayjs(
        addZero(h.identification_date_month?.toString()) +
          '-' +
          addZero(h.identification_date_day?.toString()) +
          '-' +
          h.identification_date_year,
        'MM-DD-YYYY'
      ).toDate(),
      geographicalLocation:
        'QQQQQQQQQQQQQQQQQQQQQQQQQQQ' +
        h.region +
        h.department +
        h.sub_prefecture +
        h.village +
        h.neighborhood,
      address: h.household_code + 'AAAAAAAAAAAAAAAAAAAAAA',
      uuid: h.household_code + 'AAAAAAAAAAAAAAAAAAAAAA',
    });

    // householdAddresses.push({
    //   startDate: dayjs(
    //     old.identification_date_month +
    //       "-" +
    //       old.identification_date_day +
    //       "-" +
    //       old.identification_date_year,
    //     "MM-DD-YYYY"
    //   ).toDate(),
    //   geographicalLocation: "",
    //   address,
    //   uuid: uuid,
    // });
  });

  return {
    addresses,
    householdAddresses,
  };
};

const transformMembers = (old: Member[], structures: TransferListItem[]) => {
  const members: HouseholdMember[] = [];
  const persons: Person[] = [];
  const patients: Patient[] = [];
  const identifications: Encounter[] = [];
  // const householdAddresses: HouseholdAddress[] = [];

  const memberErrors: ErrorMessage[] = [];

  old.forEach((member: Member) => {
    if (member.member_code && isGoodBeneficiaryCode(member.member_code)) {
      const isSocialCenter =
        getName(member?.structure, structures)[0].value.includes('CS ') ||
        getName(member?.structure, structures)[0].value.includes(
          'CENTRE SOCIAL'
        );

      if (
        !member.identification_date ||
        !dayjs(member.identification_date, 'DD/MM/YYYY').isValid()
      ) {
        memberErrors.push({
          tool: "Fiche d'identification membre",
          household: member.household_code,
          member: member.member_code,
          structure: getName(member.structure, structures)[0].value,
          message: "Date d'enregistrement",
          data: member.identification_date
            ? member.identification_date
            : 'Non renseigné',
        });
      }

      if (
        !member.birthdate_month ||
        !member.birthdate_year ||
        !dayjs(
          '01-' + addZero(member.birthdate_month) + '-' + member.birthdate_year,
          'DD-MM-YYYY'
        ).isValid()
      ) {
        memberErrors.push({
          tool: "Fiche d'identification membre",
          household: member.household_code,
          member: member.member_code,
          structure: getName(member.structure, structures)[0].value,
          message: 'Date de naissance',
          data:
            member.birthdate_month && member.birthdate_year
              ? member.birthdate_month + '/' + member.birthdate_year
              : 'Non renseigné',
        });
      }

      if (!member.order_number || member.order_number === 0) {
        memberErrors.push({
          tool: "Fiche d'identification membre",
          household: member.household_code,
          member: member.member_code,
          structure: getName(member.structure, structures)[0].value,
          message: 'Date de naissance',
          data: member.order_number ? member.order_number : 'Non renseigné',
        });
      }

      if (!member.last_name) {
        memberErrors.push({
          tool: "Fiche d'identification membre",
          household: member.household_code,
          member: member.member_code,
          structure: getName(member.structure, structures)[0].value,
          message: 'Nom de famille',
          data: member.last_name ? member.last_name : 'Non renseigné',
        });
      }

      if (!member.first_name) {
        memberErrors.push({
          tool: "Fiche d'identification membre",
          household: member.household_code,
          member: member.member_code,
          structure: getName(member.structure, structures)[0].value,
          message: 'Prénoms',
          data: member.first_name ? member.first_name : 'Non renseigné',
        });
      }

      if (!member.gender || (member.gender !== 1 && member.gender !== 2)) {
        memberErrors.push({
          tool: "Fiche d'identification membre",
          household: member.household_code,
          member: member.member_code,
          structure: getName(member.structure, structures)[0].value,
          message: 'Sexe',
          data: member.gender ? member.gender : 'Non renseigné',
        });
      }

      if (
        !member.handicap ||
        !['A', 'B', 'C', 'D', 'E'].some(
          (c) =>
            !member.handicap?.split(' ').includes(c) ||
            (member.handicap?.includes('A') && member.handicap.length > 1)
        )
      ) {
        memberErrors.push({
          tool: "Fiche d'identification membre",
          household: member.household_code,
          member: member.member_code,
          structure: getName(member.structure, structures)[0].value,
          message: 'Handicap',
          data: member.handicap ? member.handicap : 'Non renseigné',
        });
      }

      if (
        !member.vulnerability_type ||
        !['A', 'B', 'C', 'D', 'E'].some((elt) =>
          member.vulnerability_type?.split(' ').includes(elt)
        )
      ) {
        memberErrors.push({
          tool: "Fiche d'identification membre",
          household: member.household_code,
          member: member.member_code,
          structure: getName(member.structure, structures)[0].value,
          message: 'Type de vulnérabilité',
          data: member.vulnerability_type
            ? member.vulnerability_type
            : 'Non renseigné',
        });
      }

      if (
        !member.vulnerability ||
        !['0', '1', '2', '3', '4'].includes(member.vulnerability)
      ) {
        memberErrors.push({
          tool: "Fiche d'identification membre",
          household: member.household_code,
          member: member.member_code,
          structure: getName(member.structure, structures)[0].value,
          message: 'Vulnérabilité',
          data: member.vulnerability ? member.vulnerability : 'Non renseigné',
        });
      }

      if (!member.hiv_status || !['1', '2', '3'].includes(member.hiv_status)) {
        memberErrors.push({
          tool: "Fiche d'identification membre",
          household: member.household_code,
          member: member.member_code,
          structure: getName(member.structure, structures)[0].value,
          message: 'Statut sérologique',
          data: member.hiv_status ? member.hiv_status : 'Non renseigné',
        });
      }

      if (
        !member.arv_treatment_followup ||
        !['1', '2', '3'].includes(member.arv_treatment_followup)
      ) {
        memberErrors.push({
          tool: "Fiche d'identification membre",
          household: member.household_code,
          member: member.member_code,
          structure: getName(member.structure, structures)[0].value,
          message: 'Suivi du traitement ARV',
          data: member.arv_treatment_followup
            ? member.arv_treatment_followup
            : 'Non renseigné',
        });
      }

      if (
        !member.relation_with_chief ||
        !['1', '2', '3', '4', '5', '6', '7', '8', '9', '10', '11'].includes(
          member.relation_with_chief
        )
      ) {
        memberErrors.push({
          tool: "Fiche d'identification membre",
          household: member.household_code,
          member: member.member_code,
          structure: getName(member.structure, structures)[0].value,
          message: 'Lien de parenté avec le chef de ménage',
          data: member.relation_with_chief
            ? member.relation_with_chief
            : 'Non renseigné',
        });
      }

      if (memberErrors.length === 0) {
        const person = {
          birthdate: dayjs(
            '01-' +
              addZero(member.birthdate_month) +
              '-' +
              member.birthdate_year,
            'DD-MM-YYYY'
          ).toDate(),
          gender: member.gender === 1 ? 'M' : 'F',
          names: [
            {
              givenName: member.first_name,
              familyName: member.last_name,
              preferred: true,
              prefix: '',
              uuid: member.member_code + 'NNNNNNNNNNNNNNNNNNNNNN',
            },
          ],
          uuid: member.member_code + 'MMMMMMMMMMMMMMMMMMMMMM',
        };

        persons.push(person);

        // console.log(
        //   dayjs(member.identification_date, 'DD/MM/YYYY').diff(
        //     person.birthdate,
        //     'years'
        //   ),
        //   member.member_code
        // );

        members.push({
          patient: person.uuid,
          joiningDate: dayjs(member.identification_date, 'DD/MM/YYYY').toDate(),
          householdChief: member.order_number === 1,
          careGiver:
            dayjs(member.identification_date, 'DD/MM/YYYY').diff(
              person.birthdate,
              'years'
            ) > 21 && member.needs !== '',
          vulnerableChild:
            dayjs(member.identification_date, 'DD/MM/YYYY').diff(
              person.birthdate,
              'years'
            ) <= 21 &&
            (member.vulnerability_type === 'A' || member.needs !== ''),
          orderNumber: member.order_number?.toString(),
          takingCareOrderNumber: member.care_giver_code?.toString(),
          location: getLocation(
            isSocialCenter,
            member.social_center_code,
            member.structure
          ),
          leavingDate: undefined,
          uuid: member.member_code + 'MMMMMMMMMMMMMMMMMMMMMM',
        });

        const patientIdentifiers: PatientIdentifier[] = [];
        patientIdentifiers.push({
          identifier: member.member_code,
          identifierType: 'OVCTYPEIIIIIIIIIIIIIIIIIIIIIIIIIIIII',
          location: getLocation(
            isSocialCenter,
            member.social_center_code,
            member.structure
          ),
          /* (isSocialCenter ? member.social_center_code : member.structure) +
            'SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS'.slice(
              (isSocialCenter
                ? member.social_center_code
                : member.structure
              )?.toString().length
            ) */
          preferred: true,
        });

        if (member.dreams_code) {
          patientIdentifiers.push({
            identifier: member.dreams_code,
            identifierType: 'DREAMSTYPEIIIIIIIIIIIIIIIIIIIIIIIIII',
            location: getLocation(
              isSocialCenter,
              member.social_center_code,
              member.structure
            ),
            preferred: false,
          });
        }

        patients.push({
          person: person.uuid,
          identifiers: patientIdentifiers,
        });
      }
    }
  });
  // console.log('Members', members, memberErrors);

  return {
    members,
    persons,
    identifications,
    patients,
    memberErrors,
  };
};

const getMemberEvaluationErrorMessages = (
  e: MemberEvaluation,
  structures: TransferListItem[]
): ErrorMessage[] => {
  const memberEvaluationErrors: ErrorMessage[] = [];
  if (
    !e.evaluation_date_1 ||
    !dayjs(e.evaluation_date_1, 'DD/MM/YYYY').isValid()
  ) {
    memberEvaluationErrors.push({
      tool: "Fiche d'évaluation du membre",
      household: e.code_household,
      member: e.beneficiary_code,
      structure: getName(e.structure, structures)[0].value,
      message: "Date d'évaluation",
      data: e.evaluation_date_1 ? e.evaluation_date_1 : 'Non renseigné',
    });
  }

  if (
    !e.nutrition_growth_score_1 ||
    ![1, 2, 3, 4].includes(parseInt(e.nutrition_growth_score_1))
  ) {
    memberEvaluationErrors.push({
      tool: "Fiche d'évaluation du membre",
      household: e.code_household,
      member: e.beneficiary_code,
      structure: getName(e.structure, structures)[0].value,
      message: 'Score pour la croissance nutritionnelle',
      data: e.nutrition_growth_score_1
        ? e.nutrition_growth_score_1
        : 'Non renseigné',
    });
  }

  if (
    !e.nutrition_security_score_1 ||
    ![1, 2, 3, 4].includes(parseInt(e.nutrition_security_score_1))
  ) {
    memberEvaluationErrors.push({
      tool: "Fiche d'évaluation du membre",
      household: e.code_household,
      member: e.beneficiary_code,
      structure: getName(e.structure, structures)[0].value,
      message: 'Score pour la sécurité alimentaire',
      data: e.nutrition_security_score_1
        ? e.nutrition_security_score_1
        : 'Non renseigné',
    });
  }

  if (
    !e.well_being_health_score_1 ||
    ![1, 2, 3, 4].includes(parseInt(e.well_being_health_score_1))
  ) {
    memberEvaluationErrors.push({
      tool: "Fiche d'évaluation du membre",
      household: e.code_household,
      member: e.beneficiary_code,
      structure: getName(e.structure, structures)[0].value,
      message: 'Score pour le bien être',
      data: e.well_being_health_score_1
        ? e.well_being_health_score_1
        : 'Non renseigné',
    });
  }

  if (!e.health_care || ![1, 2, 3, 4].includes(parseInt(e.health_care))) {
    memberEvaluationErrors.push({
      tool: "Fiche d'évaluation du membre",
      household: e.code_household,
      member: e.beneficiary_code,
      structure: getName(e.structure, structures)[0].value,
      message: 'Score pour les soins santé',
      data: e.health_care ? e.health_care : 'Non renseigné',
    });
  }

  if (
    !e.performance_score_1 ||
    ![1, 2, 3, 4].includes(parseInt(e.performance_score_1))
  ) {
    memberEvaluationErrors.push({
      tool: "Fiche d'évaluation du membre",
      household: e.code_household,
      member: e.beneficiary_code,
      structure: getName(e.structure, structures)[0].value,
      message: 'Score pour les performance',
      data: e.performance_score_1 ? e.performance_score_1 : 'Non renseigné',
    });
  }

  // console.log(e.education_score_1, e.beneficiary_code);

  if (
    !e.education_score_1 ||
    // ![1, 2, 3, 4].includes(parseInt(e.education)) ||
    !between(e.education_score_1, 1, 4)
  ) {
    memberEvaluationErrors.push({
      tool: "Fiche d'évaluation du membre",
      household: e.code_household,
      member: e.beneficiary_code,
      structure: getName(e.structure, structures)[0].value,
      message: "Score pour l'éducation",
      data: e.education_score_1 ? e.education_score_1 : 'Non renseigné',
    });
  }

  if (
    !e.dev_educ_score_1 ||
    ![1, 2, 3, 4].includes(parseInt(e.dev_educ_score_1))
  ) {
    memberEvaluationErrors.push({
      tool: "Fiche d'évaluation du membre",
      household: e.code_household,
      member: e.beneficiary_code,
      structure: getName(e.structure, structures)[0].value,
      message: 'Score pour le développement cognitif',
      data: e.dev_educ_score_1 ? e.dev_educ_score_1 : 'Non renseigné',
    });
  }

  if (!e.emotion_score_1 || ![1, 2, 3, 4].includes(e.emotion_score_1)) {
    memberEvaluationErrors.push({
      tool: "Fiche d'évaluation du membre",
      household: e.code_household,
      member: e.beneficiary_code,
      structure: getName(e.structure, structures)[0].value,
      message: 'Score pour le développement cognitif',
      data: e.dev_educ_score_1 ? e.dev_educ_score_1 : 'Non renseigné',
    });
  }

  if (
    !e.social_behavior_score_1 ||
    ![1, 2, 3, 4].includes(e.social_behavior_score_1)
  ) {
    memberEvaluationErrors.push({
      tool: "Fiche d'évaluation du membre",
      household: e.code_household,
      member: e.beneficiary_code,
      structure: getName(e.structure, structures)[0].value,
      message: 'Score pour le comportement',
      data: e.social_behavior_score_1
        ? e.social_behavior_score_1
        : 'Non renseigné',
    });
  }

  if (
    !e.emotional_dev_score_1 ||
    ![1, 2, 3, 4].includes(e.emotional_dev_score_1)
  ) {
    memberEvaluationErrors.push({
      tool: "Fiche d'évaluation du membre",
      household: e.code_household,
      member: e.beneficiary_code,
      structure: getName(e.structure, structures)[0].value,
      message: 'Score pour le développement affectif',
      data: e.emotional_dev_score_1 ? e.emotional_dev_score_1 : 'Non renseigné',
    });
  }

  if (
    !e.finance_management_score_1 ||
    ![1, 2, 3, 4].includes(parseInt(e.finance_management_score_1))
  ) {
    memberEvaluationErrors.push({
      tool: "Fiche d'évaluation du membre",
      household: e.code_household,
      member: e.beneficiary_code,
      structure: getName(e.structure, structures)[0].value,
      message: 'Score pour la gestion financière',
      data: e.finance_management_score_1
        ? e.finance_management_score_1
        : 'Non renseigné',
    });
  }

  if (
    !e.autonomy_score_1 ||
    ![1, 2, 3, 4].includes(parseInt(e.autonomy_score_1))
  ) {
    memberEvaluationErrors.push({
      tool: "Fiche d'évaluation du membre",
      household: e.code_household,
      member: e.beneficiary_code,
      structure: getName(e.structure, structures)[0].value,
      message: "Score pour l'autonomie",
      data: e.autonomy_score_1 ? e.autonomy_score_1 : 'Non renseigné',
    });
  }

  if (!e.housing_score_1 || ![1, 2, 3, 4].includes(e.housing_score_1)) {
    memberEvaluationErrors.push({
      tool: "Fiche d'évaluation du membre",
      household: e.code_household,
      member: e.beneficiary_code,
      structure: getName(e.structure, structures)[0].value,
      message: 'Score pour le logement',
      data: e.housing_score_1 ? e.housing_score_1 : 'Non renseigné',
    });
  }

  if (
    !e.well_being_health_score_1 ||
    // ![1, 2, 3, 4].includes(parseInt(e.well_being_health)) ||
    !between(e.well_being_health_score_1, 1, 4)
  ) {
    memberEvaluationErrors.push({
      tool: "Fiche d'évaluation du membre",
      household: e.code_household,
      member: e.beneficiary_code,
      structure: getName(e.structure, structures)[0].value,
      message: "Score pour l'abus & exploitation",
      data: e.well_being_health_score_1
        ? e.well_being_health_score_1
        : 'Non renseigné',
    });
  }

  if (!e.abuse_score_1 || ![1, 2, 3, 4].includes(e.abuse_score_1)) {
    memberEvaluationErrors.push({
      tool: "Fiche d'évaluation du membre",
      household: e.code_household,
      member: e.beneficiary_code,
      structure: getName(e.structure, structures)[0].value,
      message: "Score pour l'abus & exploitation",
      data: e.abuse_score_1 ? e.abuse_score_1 : 'Non renseigné',
    });
  }

  if (
    !e.legal_protection_score_1 ||
    ![1, 2, 3, 4].includes(e.legal_protection_score_1)
  ) {
    memberEvaluationErrors.push({
      tool: "Fiche d'évaluation du membre",
      household: e.code_household,
      member: e.beneficiary_code,
      structure: getName(e.structure, structures)[0].value,
      message: 'Score pour la protection juridique',
      data: e.legal_protection_score_1
        ? e.legal_protection_score_1
        : 'Non renseigné',
    });
  }

  return memberEvaluationErrors;
};

const transformMemberEvaluations = (
  oldEvaluations: MemberEvaluation[],
  structures: TransferListItem[]
) => {
  const encounters: Encounter[] = [];
  const encounterRole = 'a0b03050-c99b-11e0-9572-0800200c9a66';
  const memberEvaluationErrors: ErrorMessage[] = [];

  oldEvaluations.forEach((e: MemberEvaluation) => {
    // console.log('Beneficiary code', e.beneficiary_code); IDENTIFICATIONEEEEEEEEEEEEEEEEEEEEEEEE

    if (e.beneficiary_code && isGoodBeneficiaryCode(e.beneficiary_code)) {
      // console.log('transforming evaluation');

      memberEvaluationErrors.push(
        ...getMemberEvaluationErrorMessages(e, structures)
      );

      if (memberEvaluationErrors.length === 0) {
        const patient = e.beneficiary_code + 'MMMMMMMMMMMMMMMMMMMMMM';
        const location = getLocation(
          getIsSocialCenter(e.structure, structures),
          e.cs_code,
          e.structure
        );
        encounters.push({
          encounterDatetime: dayjs(e.evaluation_date_1, 'DD/MM/YYYY').toDate(),
          encounterType: 'EVALUATIONEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
          patient,
          location,
          obs: createMemberEvaluationObs(e, patient, location, 1),
          encounterProviders: [
            {
              provider: 'PNOEVPPPPPPPPPPPPPPPPPPPPPPPPPPPP',
              encounterRole,
              uuid:
                e.evaluation_date_1.replaceAll('/', '') +
                e.beneficiary_code +
                'EEEEEEEEEEEEEE',
            },
          ],
          uuid:
            e.evaluation_date_1.replaceAll('/', '') +
            e.beneficiary_code +
            'EEEEEEEEEEEEEE',
        });

        if (e.evaluation_date_2) {
          memberEvaluationErrors.push(
            ...getMemberEvaluationErrorMessages(e, structures)
          );
          encounters.push({
            encounterDatetime: dayjs(
              e.evaluation_date_2,
              'DD/MM/YYYY'
            ).toDate(),
            encounterType: 'EVALUATIONEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
            patient,
            location,
            obs: createMemberEvaluationObs(e, patient, location, 2),
            encounterProviders: [
              {
                provider: 'PNOEVPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP',
                encounterRole,
                uuid:
                  e.evaluation_date_2.replaceAll('/', '') +
                  e.beneficiary_code +
                  'EEEEEEEEEEEEEEEEEEE',
              },
            ],
            uuid:
              e.evaluation_date_2.replaceAll('/', '') +
              e.beneficiary_code +
              'EEEEEEEEEEEEEE',
          });
        }
      }
    }
  });

  // console.log('Evaluation Membre', encounters);

  return { encounters, memberErrors: memberEvaluationErrors };
};

const between = (value: number | string, min: number, max: number): boolean => {
  if (typeof value === 'string') {
    const num = parseInt(value) || null;
    if (num) return num >= min && num <= max;
    return false;
  }
  return value >= min && value <= max;
};

const createMemberEvaluationObs = (
  evaluation: MemberEvaluation,
  person: string,
  location: string | undefined,
  rank: number
): Obs[] => {
  const obsDatetime =
    rank === 1
      ? dayjs(evaluation.evaluation_date_1, 'DD/MM/YYYY').toDate()
      : dayjs(evaluation.evaluation_date_2, 'DD/MM/YYYY').toDate();
  if (rank === 1) {
    return createObs(
      evaluationMapping,
      evaluation,
      person,
      location,
      obsDatetime,
      [
        'nutrition_security_2',
        'nutrition_growth_2',
        'well_being_health_2',
        'health_care_2',
        'motor_development_2',
        'performance_2',
        'education_2',
        'dev_educ_2',
        'emotion_2',
        'social_behavior_2',
        'emotional_dev_2',
        'gest_fin_2',
        'auton_2',
        'housing_2',
        'care_2',
        'abuse_2',
        'legal_protection_2',
      ],
      []
    );
  } else {
    return createObs(
      evaluationMapping,
      evaluation,
      person,
      location,
      obsDatetime,
      [],
      [
        'nutrition_security_2',
        'nutrition_growth_2',
        'well_being_health_2',
        'health_care_2',
        'motor_development_2',
        'performance_2',
        'education_2',
        'dev_educ_2',
        'emotion_2',
        'social_behavior_2',
        'emotional_dev_2',
        'gest_fin_2',
        'auton_2',
        'housing_2',
        'care_2',
        'abuse_2',
        'legal_protection_2',
      ]
    );
  }
};

const transformIdentifiers = (
  old: Member[],
  structures: TransferListItem[]
) => {
  const encounters: Encounter[] = [];
  const encounterRole = 'a0b03050-c99b-11e0-9572-0800200c9a66';
  old.forEach((i) => {
    if (i.member_code && isGoodBeneficiaryCode(i.member_code)) {
      const patient = i.member_code + 'MMMMMMMMMMMMMMMMMMMMMM';
      const location = getLocation(
        getIsSocialCenter(i.structure, structures),
        i.social_center_code,
        i.structure
      );

      encounters.push({
        encounterDatetime: dayjs(i.identification_date, 'DD/MM/YYYY').toDate(),
        encounterType: 'IDENTIFICATIONEEEEEEEEEEEEEEEEEEEEEEEE',
        patient,
        location,
        obs: createObs(
          identificationMapping,
          i,
          patient,
          location,
          dayjs(i.identification_date, 'DD/MM/YYYY').toDate(),
          [],
          []
        ),
        encounterProviders: [
          {
            provider: 'PNOEVPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP',
            encounterRole,
            uuid:
              i.identification_date.replaceAll('/', '') +
              i.member_code +
              'IIIIIIIIIIIIII',
          },
        ],
        uuid:
          i.identification_date.replaceAll('/', '') +
          i.member_code +
          'IIIIIIIIIIIIII',
      });
    }
  });

  return encounters;
};

const transformSupportActivity = (
  old: MemberSupportActivity[],
  structures: TransferListItem[]
) => {
  const encounters: Encounter[] = [];
  const encounterRole = 'a0b03050-c99b-11e0-9572-0800200c9a66';
  old.forEach((i) => {
    if (i.member && isGoodBeneficiaryCode(i.member)) {
      // console.log('is a correct member');
      if (
        i.date_created &&
        i.date_created.trim() !== '' &&
        minLimitDate.isBefore(i.date_created)
      ) {
        // console.log('is correct date ', i.date_created);
        // console.log(
        //   'old date',
        //   i.date_created,
        //   'is before 01/01/2019',
        //   minLimitDate.isBefore(i.date_created)
        // );
        const patient = i.member + 'MMMMMMMMMMMMMMMMMMMMMM';
        const location = getLocation(
          getIsSocialCenter(i.structure, structures),
          i.cs_code,
          i.structure
        );
        const encounterDatetime = dayjs(i.date_created, 'DD/MM/YYYY').toDate();

        encounters.push({
          encounterDatetime,
          encounterType: 'SOUTIENEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
          patient,
          location,
          obs: createObs(
            activityMapping,
            i,
            patient,
            location,
            encounterDatetime,
            [],
            []
          ),
          encounterProviders: [
            {
              provider: 'PNOEVPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP',
              encounterRole,
              uuid:
                i.date_created.replaceAll('/', '') +
                i.member +
                'SSSSSSSSSSSSSS',
            },
          ],
          uuid:
            i.date_created.replaceAll('/', '') + i.member + 'SSSSSSSSSSSSSS',
        });
      }
    }
  });

  return encounters;
};

const transformSchoolFollowups = (
  old: SchoolFollowupInfo[],
  structures: TransferListItem[]
) => {
  const errorMessages: ErrorMessage[] = [];
  const encounters: Encounter[] = [];
  const encounterRole = 'a0b03050-c99b-11e0-9572-0800200c9a66';
  old.forEach((i) => {
    if (i.beneficiary_code && isGoodBeneficiaryCode(i.beneficiary_code)) {
      if (
        i.begin_year &&
        i.begin_year.toString().length === 4 &&
        i.end_year &&
        i.end_year.toString().length === 4 &&
        (minLimitDate.isBefore('01/09/' + i.begin_year) ||
          minLimitDate.isSame('01/09/' + i.begin_year))
      ) {
        if (!i.begin_year || i.begin_year.toString().length !== 4) {
          errorMessages.push({
            tool: 'Fiche de suivi scolaire du membre',
            household: i.followup.beneficiary_code,
            member: i.beneficiary_code,
            structure: getName(i.followup.structure, structures)[0].value,
            message: "Date de début de l'année scolaire",
            data: i.begin_year ? i.begin_year : 'Non renseigné',
          });
        }
        if (!i.end_year || i.end_year.toString().length !== 4) {
          errorMessages.push({
            tool: 'Fiche de suivi scolaire du membre',
            household: i.followup.beneficiary_code,
            member: i.beneficiary_code,
            structure: getName(i.followup.structure, structures)[0].value,
            message: "Date de fin de l'année scolaire",
            data: i.end_year ? i.end_year : 'Non renseigné',
          });
        }

        if (!i.school_class) {
          errorMessages.push({
            tool: 'Fiche de suivi scolaire du membre',
            household: i.followup.beneficiary_code,
            member: i.beneficiary_code,
            structure: getName(i.followup.structure, structures)[0].value,
            message: 'Classe',
            data: i.school_class ? i.school_class : 'Non renseigné',
          });
        }
        if (!i.school) {
          errorMessages.push({
            tool: 'Fiche de suivi scolaire du membre',
            household: i.followup.beneficiary_code,
            member: i.beneficiary_code,
            structure: getName(i.followup.structure, structures)[0].value,
            message: 'Établissement',
            data: i.school ? i.school : 'Non renseigné',
          });
        }

        if (errorMessages.length === 0) {
          const patient = i.beneficiary_code + 'MMMMMMMMMMMMMMMMMMMMMM';
          const location = getLocation(
            getIsSocialCenter(i?.followup.structure, structures),
            i.followup.social_center_code,
            i?.followup.structure
          );

          const encounterDatetime = dayjs(
            '01/09/' + i.begin_year,
            'DD/MM/YYYY'
          ).toDate();

          encounters.push({
            encounterDatetime,
            encounterType: 'SCOLAIREEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
            patient,
            location,
            obs: createObs(
              schoolFollowupMapping,
              i,
              patient,
              location,
              dayjs('01/09/' + i.begin_year, 'DD/MM/YYYY').toDate(),
              [],
              []
            ),
            encounterProviders: [
              {
                provider: 'PNOEVPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP',
                encounterRole,
                uuid:
                  i.begin_year +
                  i.end_year +
                  i.beneficiary_code +
                  'SCSCSCSCSCSCSC',
              },
            ],
            uuid:
              i.begin_year + i.end_year + i.beneficiary_code + 'SCSCSCSCSCSCSC',
          });
        }
      }
    }
  });

  return { encounters, errorMessages };
};

const transformNutritionalFollowups = (
  old: NutritionalFollowupInfo[],
  structures: TransferListItem[]
) => {
  const encounters: Encounter[] = [];
  const encounterRole = 'a0b03050-c99b-11e0-9572-0800200c9a66';
  old.forEach((i) => {
    if (i.beneficiary_code && isGoodBeneficiaryCode(i.beneficiary_code)) {
      const dateString =
        addZero(i.visit_date_day) +
        '/' +
        addZero(i.visit_date_month) +
        '/' +
        i.visit_date_year;
      if (dateString.length === 10 && minLimitDate.isBefore(dateString)) {
        const patient = i.beneficiary_code + 'MMMMMMMMMMMMMMMMMMMMMM';
        const location = getLocation(
          getIsSocialCenter(i.structure, structures),
          i.social_center_code,
          i.structure
        );
        const encounterDatetime = dayjs(dateString, 'DD/MM/YYYY').toDate();

        encounters.push({
          encounterDatetime,
          encounterType: 'NUTRITIONEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
          patient,
          location,
          obs: createObs(
            nutritionalFollowupMapping,
            i,
            patient,
            location,
            encounterDatetime,
            [],
            []
          ),
          encounterProviders: [
            {
              provider: 'PNOEVPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP',
              encounterRole,
              uuid:
                dateString.replaceAll('/', '') +
                i.beneficiary_code +
                'NNNNNNNNNNNNNN',
            },
          ],
          uuid:
            i.visit_date_day +
            i.visit_date_month +
            i.visit_date_year +
            i.beneficiary_code +
            i.beneficiary_code +
            'NNNNNNNNNNNNNN',
        });
      }
    }
  });

  return encounters;
};

const transformReference = (
  old: Reference[],
  structures: TransferListItem[]
) => {
  const errorMessages: ErrorMessage[] = [];
  const encounters: Encounter[] = [];
  const encounterRole = 'a0b03050-c99b-11e0-9572-0800200c9a66';
  old.forEach((i) => {
    if (i.beneficiary_code && isGoodBeneficiaryCode(i.beneficiary_code)) {
      if (!i.hosting_service) {
        errorMessages.push({
          tool: 'Fiche de référence du membre',
          household: i.beneficiary_code,
          member: i.beneficiary_code,
          structure: getName(i.structure, structures)[0].value,
          message: "Structure d'accueil",
          data: i.hosting_service ? i.hosting_service : 'Non renseigné',
        });
      }
      if (
        i.date_reference &&
        i.date_reference.trim() !== '' &&
        minLimitDate.isBefore(dayjs(i.date_reference, 'DD/MM/YYYY'))
      ) {
        const patient = i.beneficiary_code + 'MMMMMMMMMMMMMMMMMMMMMM';
        const location = getLocation(
          getIsSocialCenter(i.structure, structures),
          i.cs_code,
          i.structure
        );
        const encounterDatetime = dayjs(
          i.date_reference,
          'DD/MM/YYYY'
        ).toDate();

        encounters.push({
          encounterDatetime,
          encounterType: 'REFERENCEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE',
          patient,
          location,
          obs: createObs(
            referenceMapping,
            i,
            patient,
            location,
            encounterDatetime,
            [],
            []
          ),
          encounterProviders: [
            {
              provider: 'PNOEVPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP',
              encounterRole,
              uuid:
                i.date_reference.replaceAll('/', '') +
                i.beneficiary_code +
                'RRRRRRRRRRRRRR',
            },
          ],
          uuid:
            i.date_reference.replaceAll('/', '') +
            i.beneficiary_code +
            'RRRRRRRRRRRRRR',
        });

        if (i.counter_reference && i.counter_reference.date_contr_reference) {
          const cr = i.counter_reference;
          encounters.push({
            encounterDatetime: dayjs(
              cr.date_contr_reference,
              'DD/MM/YYYY'
            ).toDate(),
            encounterType: 'CONTREREFERENCEEEEEEEEEEEEEEEEEEEEEEEE',
            patient,
            location,
            obs: createObs(
              referenceMapping,
              i,
              patient,
              location,
              dayjs(cr.date_contr_reference, 'DD/MM/YYYY').toDate(),
              [],
              []
            ),
            encounterProviders: [
              {
                provider: 'PNOEVPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPPP',
                encounterRole,
                uuid: cr.date_contr_reference
                  ? cr.date_contr_reference.replaceAll('/', '') +
                    i.beneficiary_code +
                    'CRCRCRCRCRCRCR'
                  : '',
              },
            ],
            uuid:
              cr.date_contr_reference.replaceAll('/', '') +
              i.beneficiary_code +
              'CRCRCRCRCRCRCR',
          });
        }
      }
    }
  });
  return encounters;
};

const createObs = (
  mapping: any,
  entity: any,
  person: string,
  location: string | undefined,
  obsDatetime: Date,
  excluded: string[],
  selected: string[]
): Obs[] => {
  const obs: Obs[] = [];
  for (const [key, value] of Object.entries(entity)) {
    // console.log(value);
    if (
      // !isEmptyOrSpaces(value) &&
      mapping[key] &&
      value &&
      typeof value === 'string' &&
      value.trim() !== '' &&
      !excluded.includes(key) &&
      ((selected.length > 0 && selected.includes(key)) || selected.length === 0)
    ) {
      if (mapping[key].type === 'group') {
        const d =
          typeof value === 'string' && value !== ''
            ? value.split(' ').filter((v) => v !== '')
            : undefined;
        if (d && d.length > 0) {
          // console.log(key, 'values', d);

          const groupMembers: Obs[] = [];
          d.forEach((k) => {
            if (mapping[key].options[k]) {
              groupMembers.push({
                person,
                concept: mapping[key].options[k].concept,
                value: true,
                obsDatetime,
              });
            }
          });

          obs.push({
            person,
            concept: mapping[key].concept,
            obsDatetime,
            groupMembers,
            // : d.map((v) => {
            //   console.log(
            //     'value of group data : ',
            //     key,
            //     'value=',
            //     v,
            //     person,
            //     location
            //   );
            //   return {
            //     person,
            //     concept: mapping[key].options[v].concept,
            //     value: true,
            //     obsDatetime,
            //   };
            // }),
          });
        }
      } else if (mapping[key].type === 'coded') {
        if (mapping[key].options[value as string]) {
          obs.push({
            person,
            concept: mapping[key].concept,
            value: mapping[key].options[value as string]?.concept,
            obsDatetime,
          });
        }
      } else if (mapping[key].type === 'date') {
        obs.push({
          person,
          concept: mapping[key].concept,
          value: dayjs(value as string, 'DD/MM/YYYY').toDate(),
          obsDatetime,
        });
      } else if (mapping[key].type === 'boolean') {
        obs.push({
          person,
          concept: mapping[key].concept,
          value: value === 'O' || value === '1',
          obsDatetime,
        });
      } else if (mapping[key].type === 'value') {
        obs.push({
          person,
          concept: mapping[key].concept,
          value: mapping[key].options[value as string].concept,
          obsDatetime,
        });
      } else if (mapping[key].type === undefined) {
        (value as string)
          .trim()
          .split(' ')
          .forEach((v) => {
            obs.push({
              person,
              concept: mapping[key].options[v]?.concept,
              value: true,
              obsDatetime,
            });
          });
      } else {
        obs.push({
          person,
          concept: mapping[key].concept,
          value,
          obsDatetime,
        });
      }
    }
  }
  return obs;
};
const getStructureIds = (structures: TransferListItem[]): number[] => {
  return structures.map((s: TransferListItem) => {
    return parseInt(s.description);
  });
};

export const Fn = {
  getStructureIds,
  createTransferListData,
  transformCharacteristic,
  transformMembers,
  transformHouseholds,
  transformHouseholdEvaluations,
  transformGraduations,
  transformIdentifiers,
  transformMemberEvaluations,
  transformSchoolFollowups,
  transformSupportActivity,
  transformNutritionalFollowups,
  transformReference,
  transformAddresses,
  isEmptyOrSpaces,
};

import { TransferListData, TransferListItem } from "@mantine/core";
import customParseFormat from 'dayjs/plugin/customParseFormat';
import dayjs from "dayjs";
import { Encounter } from "../models/new/Encounter";
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
} from "../models/new/Enumerations";
import {
  Household,
  HouseholdEvaluation,
  HouseholdGraduation,
  HouseholdMember,
} from "../models/new/Household";
import { Obs } from "../models/new/Obs";
import { Patient } from "../models/new/Patient";
import { PatientIdentifier } from "../models/new/PatientIdentifier";
import { Person } from "../models/new/Person";
import {
  OldHousehold,
  OldHouseholdEvaluation,
  OldHouseholdGraduation,
} from "../models/old/Household";
import { Member } from "../models/old/Member";
import { MemberEvaluation } from "../models/old/MemberEvaluation";
import { MemberSupportActivity } from "../models/old/MemberSupportActivity";
import { NutritionalFollowupInfo } from "../models/old/NutritionalFollowup";
import { Reference } from "../models/old/Reference";
import { SchoolFollowupInfo } from "../models/old/SchoolFollowup";
import { activityMapping, 
  counterReferenceMapping, evaluationMapping, identificationMapping, nutritionalFollowupMapping, referenceMapping, schoolFollowupMapping } from "./mapping";

dayjs.extend(customParseFormat)

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
      image: "000".slice(d[image]?.toString().length) + d[image],
      label: labelTxt + " " + d[label],
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
  return (
    (isSocialCenter ? socialCenterCode : structureId) +
    "SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS".slice(
      (isSocialCenter ? socialCenterCode : structureId)?.toString().length
    )
  );
};

const getIsSocialCenter = (
  structure: number | undefined,
  structures: TransferListItem[]
): boolean => {
  return (
    getName(structure, structures)[0].value.includes("CS ") ||
    getName(structure, structures)[0].value.includes("CENTRE SOCIAL")
  );
};

const transformCharacteristic = (
  old: OldHousehold,
  structures: TransferListItem[]
) => {
  const isSocialCenter = getIsSocialCenter(old?.structure, structures);

  return {
    householdSize: old.member_number ? parseInt(old.member_number) : undefined,
    registrationDate: dayjs(
      old.identification_date_month +
        "-" +
        old.identification_date_day +
        "-" +
        old.identification_date_year,
      "MM-DD-YYYY"
    ).toDate(),
    location:
      (isSocialCenter ? old.social_center_code : old.structure) +
      "SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS".slice(
        (isSocialCenter ? old.social_center_code : old.structure)?.toString()
          .length
      ),
    numberOfActivePerson: old.active_persons_number
      ? parseInt(old.active_persons_number)
      : undefined,
    numberOfOvc: old.ovc_number ? parseInt(old.ovc_number) : undefined,
    numberOfMealPerDay: old.meal_number ? parseInt(old.meal_number) : undefined,
    entryPoint: getEntryPoint(old.entry_point),
    otherEntryPoint: old.other_entry_point,
    accommodationType: getAccommodationType(old.housing_type),
    otherAccommodationType: old.other_housing_type,
    numberOfRoom: old.room_number ? parseInt(old.room_number) : undefined,
    housingSituation: getHouseSituation(old.house_situation),
    otherHousingSituation: old.other_housing_type,
    hasWaterCloset: old.commodity?.includes("A"),
    hasLatrine: old.commodity?.includes("B"),
    hasBathroom: old.commodity?.includes("C"),
    hasKitchen: old.commodity?.includes("D"),
    mainWaterSource: getMainWaterSource(old.main_water_source),
    otherMainWaterSource: old.other_main_water_source,
    mainElectricitySource: getMainElectricitySource(
      old.main_electricity_source
    ),
    otherMainElectricitySource: old.other_main_electricity_source,
    mainCombustible: getMainCombustible(old.main_combustible),
    otherMainCombustible: old.other_main_combustible,
    hasTelephone: old.other_household_resource?.includes("A"),
    hasTelevision: old.other_household_resource?.includes("B"),
    hasRadio: old.other_household_resource?.includes("C"),
    hasRefrigerator: old.other_household_resource?.includes("D"),
    hasSocialCapital: false,
    socialCapital: old.social_capital,
    incomeFromProfessionalActivity: old.main_incoming_source?.includes("A"),
    incomeFromFamilySupport: old.main_incoming_source?.includes("B"),
    incomeFromExternalSupport: old.main_incoming_source?.includes("C"),
    otherIncomeSource: old.other_incoming_source,
    estimatedMonthlyIncome: getEstimatedMonthlyIncome(
      old.estimated_monthly_income
    ),
    estimatedMonthlyExpenses: old.estimated_monthly_expense
      ? parseInt(old.estimated_monthly_expense)
      : undefined,
    socialCenter:
      old.social_center_code +
      "SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS".slice(
        old.social_center_code?.toString().length
      ),
    householdClassification: getHouseClassification(old.classification),
    householdBecoming: undefined,
    householdBecomingDate: undefined,
    otherHouseholdBecoming: "",
    transferDestination: "",
    uuid: old.household_code + "HHHHHHHHHHHHHHHHHHHHHHHH",
  };
};

const transformHouseholds = (
  oldHouseholds: OldHousehold[],
  structures: TransferListItem[]
) => {
  console.log("In console", oldHouseholds);
  const households: Household[] = [];
  // const members: HouseholdMember[] = [];
  // const patients: Patient[] = [];
  // const persons: Person[] = [];

  oldHouseholds.forEach((h) => {
    const isSocialCenter =
      getName(h?.structure, structures)[0].value.includes("CS ") ||
      getName(h?.structure, structures)[0].value.includes("CENTRE SOCIAL");

    households.push({
      geographicalLocation:
        h.neighborhood +
        "QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ".slice(
          h.neighborhood?.toString().length
        ),
      location:
        (isSocialCenter ? h.social_center_code : h.structure) +
        "SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS".slice(
          (isSocialCenter ? h.social_center_code : h.structure)?.toString()
            .length
        ),
      identifiers: [
        {
          identifier: h.household_code,
          identifierLocation:
            h.structure +
            "SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS".slice(
              h.structure?.toString().length
            ),
          uuid: h.household_code + "IIIIIIIIIIIIIIIIIIIIIIII",
        },
      ],
      characteristics: [transformCharacteristic(h, structures)],
      socialCenter:
        h.social_center_code +
        "SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS".slice(
          h.social_center_code?.toString().length
        ),
      addresses: [
        {
          startDate: dayjs(
            h.identification_date_month +
              "-" +
              h.identification_date_day +
              "-" +
              h.identification_date_year,
            "MM-DD-YYYY"
          ).toDate(),
          geographicalLocation:
            h.neighborhood +
            "QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ".slice(
              h.neighborhood?.toString().length
            ),
          address: {
            address1: h.block,
            address2: h.batch,
            address3: h.reference,
            uuid: h.household_code + "AAAAAAAAAAAAAAAAAAAAAAAA",
          },
        },
      ],
      uuid: h.household_code + "HHHHHHHHHHHHHHHHHHHHHHHH",
    });

    // const {members: m, persons: pe, patients: pa} = transformMembers(h, h.household_code + "HHHHHHHHHHHHHHHHHHHHHHHH");
    // Array.prototype.push.apply(members, m);
    // Array.prototype.push.apply(persons, pe);
    // Array.prototype.push.apply(patients, pa);
  });

  return {
    households,
  };
};

const transformHouseholdEvaluations = (
  oldEvaluations: OldHouseholdEvaluation[],
  structures: TransferListItem[]
): HouseholdEvaluation[] => {
  return oldEvaluations.reduce(
    (evaluations: HouseholdEvaluation[], e: OldHouseholdEvaluation) => {
      const isSocialCenter =
        getName(e?.structure, structures)[0].value.includes("CS ") ||
        getName(e?.structure, structures)[0].value.includes("CENTRE SOCIAL");

      evaluations.push({
        evaluationDate: dayjs(e.evaluation1_date, "DD/MM/YYYY").toDate(),
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
        childrenEducationScore: e.eduction1 ? parseInt(e.eduction1) : undefined, // education
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
        protectionScore: e.protection_1 ? parseInt(e.protection_1) : undefined, // protection
        location:
          (isSocialCenter ? e.cs_code : e.structure) +
          "SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS".slice(
            (isSocialCenter ? e.cs_code : e.structure)?.toString().length
          ),
        uuid: e.household_code + "1EEEEEEEEEEEEEEEEEEEEE",
      });

      if (e.evaluation2_date) {
        evaluations.push({
          evaluationDate: dayjs(e.evaluation2_date, "DD/MM/YYYY").toDate(),
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
          location:
            (isSocialCenter ? e.cs_code : e.structure) +
            "SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS".slice(
              (isSocialCenter ? e.cs_code : e.structure)?.toString().length
            ),
          uuid: e.household_code + "2EEEEEEEEEEEEEEEEEEEEE",
        });
      }

      return evaluations;
    },
    []
  );
};

const transformGraduations = (
  oldGraduations: OldHouseholdGraduation[],
  structures: TransferListItem[]
): HouseholdGraduation[] => {
  const householdGraduations: HouseholdGraduation[] = [];

  console.log("oldGraduations", oldGraduations);

  if (oldGraduations.length === 0) {
    return [];
  }

  oldGraduations.forEach((g) => {
    const isSocialCenter =
      g.structure &&
      (getName(g?.structure, structures)[0].value.includes("CS ") ||
        getName(g?.structure, structures)[0].value.includes("CENTRE SOCIAL"));

    householdGraduations.push({
      graduationDate: dayjs(g.date_evaluation, "DD/MM/YYYY").toDate(),
      memberHivStatusKnown:
        g.response_sit1 === "O"
          ? CheckListAnswer.YES
          : g.response_sit1 === "N"
          ? CheckListAnswer.NO
          : CheckListAnswer.NOT_APPLICABLE,
      memberViralLoadSuppressed:
        g.response_sit_2 === "O"
          ? CheckListAnswer.YES
          : g.response_sit_2 === "N"
          ? CheckListAnswer.NO
          : CheckListAnswer.NOT_APPLICABLE,
      memberHealthCareInsured:
        g.response_sit_3 === "O"
          ? CheckListAnswer.YES
          : g.response_sit_3 === "N"
          ? CheckListAnswer.NO
          : CheckListAnswer.NOT_APPLICABLE,
      childrenOverTenInAnnouncingStatus:
        g.response_sit_4 === "O"
          ? CheckListAnswer.YES
          : g.response_sit_4 === "N"
          ? CheckListAnswer.NO
          : CheckListAnswer.NOT_APPLICABLE,
      hivPatientSharedStatus:
        g.response_sit_5 === "O"
          ? CheckListAnswer.YES
          : g.response_sit_5 === "N"
          ? CheckListAnswer.NO
          : CheckListAnswer.NOT_APPLICABLE,
      householdEconomicallyStable:
        g.response_sit_6 === "O"
          ? CheckListAnswer.YES
          : g.response_sit_6 === "N"
          ? CheckListAnswer.NO
          : CheckListAnswer.NOT_APPLICABLE,
      unreportedMalnutrition:
        g.response_sit_7 === "O"
          ? CheckListAnswer.YES
          : g.response_sit_7 === "N"
          ? CheckListAnswer.NO
          : CheckListAnswer.NOT_APPLICABLE,
      homeSafeForChildren:
        g.response_sit_8 === "O"
          ? CheckListAnswer.YES
          : g.response_sit_8 === "N"
          ? CheckListAnswer.NO
          : CheckListAnswer.NOT_APPLICABLE,
      noVedanLastSixMonths:
        g.response_sit_9 === "O"
          ? CheckListAnswer.YES
          : g.response_sit_9 === "N"
          ? CheckListAnswer.NO
          : CheckListAnswer.NOT_APPLICABLE,
      appropriateServiceVedanSixIssues:
        g.response_sit_10 === "O"
          ? CheckListAnswer.YES
          : g.response_sit_10 === "N"
          ? CheckListAnswer.NO
          : CheckListAnswer.NOT_APPLICABLE,
      adultInHouseholdSinceSixMonth:
        g.response_sit_11 === "O"
          ? CheckListAnswer.YES
          : g.response_sit_11 === "N"
          ? CheckListAnswer.NO
          : CheckListAnswer.NOT_APPLICABLE,
      childrenAttendingRegularlySchool:
        g.response_sit_12 === "O"
          ? CheckListAnswer.YES
          : g.response_sit_12 === "N"
          ? CheckListAnswer.NO
          : CheckListAnswer.NOT_APPLICABLE,
      nonSchoolInApprenticeshipForSixMonth:
        g.response_sit_13 === "O"
          ? CheckListAnswer.YES
          : g.response_sit_13 === "N"
          ? CheckListAnswer.NO
          : CheckListAnswer.NOT_APPLICABLE,
      schoolFeesCovered:
        g.response_sit_14 === "O"
          ? CheckListAnswer.YES
          : g.response_sit_14 === "N"
          ? CheckListAnswer.NO
          : CheckListAnswer.NOT_APPLICABLE,
      location:
        (isSocialCenter ? g.cs_code : g.structure) +
        "SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS".slice(
          (isSocialCenter ? g.cs_code : g.structure)?.toString().length
        ),
      uuid: g.code_household + "GGGGGGGGGGGGGGGGGGGGGG",
    });
  });

  return householdGraduations;
};

const transformMembers = (old: Member[], structures: TransferListItem[]) => {
  const members: HouseholdMember[] = [];
  const persons: Person[] = [];
  const patients: Patient[] = [];
  // const householdAddresses: HouseholdAddress[] = [];

  old.forEach((member: Member) => {
    const isSocialCenter =
      getName(member?.structure, structures)[0].value.includes("CS ") ||
      getName(member?.structure, structures)[0].value.includes("CENTRE SOCIAL");
    members.push({
      patient: member.member_code + "MMMMMMMMMMMMMMMMMMMMMM",
      joiningDate: dayjs(member.identification_date, "DD/MM/YYYY").toDate(),
      householdChief: member.order_number === 1,
      careGiver: false,
      vulnerableChild: false,
      orderNumber: member.order_number?.toString(),
      takingCareOrderNumber: member.care_giver_code?.toString(),
      location:
        (isSocialCenter ? member.social_center_code : member.structure) +
        "SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS".slice(
          (isSocialCenter
            ? member.social_center_code
            : member.structure
          )?.toString().length
        ),
      leavingDate: undefined,
      uuid: member.member_code + "MMMMMMMMMMMMMMMMMMMMMM",
    });

    // const address: PersonAddress = {
    //   address1: old.block,
    //   address2: old.batch,
    //   address3: old.reference,
    //   uuid,
    // };

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

    persons.push({
      birthdate: dayjs(
        "01-" + member.birthdate_month + "-" + member.birthdate_year,
        "DD-MM-YYYY"
      ).toDate(),
      gender: member.gender === 1 ? "M" : "F",
      names: [
        {
          givenName: member.first_name,
          familyName: member.last_name,
          preferred: true,
          prefix: "",
          uuid: member.member_code + "NNNNNNNNNNNNNNNNNNNNNN",
        },
      ],
      uuid: member.member_code + "MMMMMMMMMMMMMMMMMMMMMM",
    });

    const patientIdentifiers: PatientIdentifier[] = [];
    patientIdentifiers.push({
      identifier: member.member_code,
      identifierType: "string",
      location:
        (isSocialCenter ? member.social_center_code : member.structure) +
        "SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS".slice(
          (isSocialCenter
            ? member.social_center_code
            : member.structure
          )?.toString().length
        ),
      preferred: true,
    });

    if (member.dreams_code) {
      patientIdentifiers.push({
        identifier: member.dreams_code,
        identifierType: "string",
        location:
          (isSocialCenter ? member.social_center_code : member.structure) +
          "SSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSSS".slice(
            (isSocialCenter
              ? member.social_center_code
              : member.structure
            )?.toString().length
          ),
        preferred: false,
      });
    }

    patients.push({
      person: member.member_code + "MMMMMMMMMMMMMMMMMMMMMM",
      identifiers: patientIdentifiers,
    });
  });

  return {
    members,
    persons,
    // householdAddresses,
    patients,
  };
};

const transformMemberEvaluations = (
  oldEvaluations: MemberEvaluation[],
  structures: TransferListItem[]
) => {
  const encounters: Encounter[] = [];
  const encounterRole = "a0b03050-c99b-11e0-9572-0800200c9a66";

  oldEvaluations.forEach((e: MemberEvaluation) => {
    const patient = e.code_beneficiary + "MMMMMMMMMMMMMMMMMMMMMM";
    const location = getLocation(
      getIsSocialCenter(e.structure, structures),
      e.cs_code,
      e.structure
    );

    encounters.push({
      encounterDatetime: dayjs(e.evaluation_date_1, "DD/MM/YYYY").toDate(),
      encounterType: "EVALUATIONEEEEEEEEEEEEEEEEEEEEEEEEEE",
      patient,
      location,
      obs: createMemberEvaluationObs(e, patient, location, 1),
      encounterProviders: [
        {
          provider: "PNOEVPPPPPPPPPPPPPPPPPPPPPPPPPPPP",
          encounterRole,
          uuid:
            e.evaluation_date_1.replaceAll("/", "") +
            e.code_beneficiary +
            "EEEEEEEEEEEEEE",
        },
      ],
      uuid:
        e.evaluation_date_1.replaceAll("/", "") +
        e.code_beneficiary +
        "EEEEEEEEEEEEEE",
    });

    if (e.evaluation_date_2) {
      encounters.push({
        encounterDatetime: dayjs(e.evaluation_date_2, "DD/MM/YYYY").toDate(),
        encounterType: "EVALUATIONEEEEEEEEEEEEEEEEEEEEEEEE",
        patient,
        location,
        obs: createMemberEvaluationObs(e, patient, location, 2),
        encounterProviders: [
          {
            provider: "PNOEVPPPPPPPPPPPPPPPPPPPPPPPPPPPP",
            encounterRole,
            uuid:
              e.evaluation_date_2.replaceAll("/", "") +
              e.code_beneficiary +
              "EEEEEEEEEEEEEEEEEEE",
          },
        ],
        uuid:
          e.evaluation_date_2.replaceAll("/", "") +
          e.code_beneficiary +
          "EEEEEEEEEEEEEE",
      });
    }
  });

  return encounters;
};

const createMemberEvaluationObs = (
  evaluation: MemberEvaluation,
  person: string,
  location: string,
  rank: number
): Obs[] => {
  const obsDatetime =
    rank === 1
      ? dayjs(evaluation.evaluation_date_1, "DD/MM/YYYY").toDate()
      : dayjs(evaluation.evaluation_date_2, "DD/MM/YYYY").toDate();
  if (rank === 1) {
    return createObs(
      evaluationMapping,
      evaluation,
      person,
      location,
      obsDatetime,
      [
        "nutrition_security_2",
        "nutrition_growth_2",
        "well_being_health_2",
        "health_care_2",
        "motor_development_2",
        "performance_2",
        "education_2",
        "dev_educ_2",
        "emotion_2",
        "social_behavior_2",
        "emotional_dev_2",
        "gest_fin_2",
        "auton_2",
        "housing_2",
        "care_2",
        "abuse_2",
        "legal_protection_2",
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
        "nutrition_security_2",
        "nutrition_growth_2",
        "well_being_health_2",
        "health_care_2",
        "motor_development_2",
        "performance_2",
        "education_2",
        "dev_educ_2",
        "emotion_2",
        "social_behavior_2",
        "emotional_dev_2",
        "gest_fin_2",
        "auton_2",
        "housing_2",
        "care_2",
        "abuse_2",
        "legal_protection_2",
      ]
    );
  }
};

const transformIdentifiers = (
  old: Member[],
  structures: TransferListItem[]
) => {
  const encounters: Encounter[] = [];
  const encounterRole = "a0b03050-c99b-11e0-9572-0800200c9a66";
  old.forEach((i) => {
    const patient = i.member_code + "MMMMMMMMMMMMMMMMMMMMMM";
    const location = getLocation(
      getIsSocialCenter(i.structure, structures),
      i.social_center_code,
      i.structure
    );

    encounters.push({
      encounterDatetime: dayjs(i.identification_date, "DD/MM/YYYY").toDate(),
      encounterType: "IDENTIFICATIONEEEEEEEEEEEEEEEEEEEEEE",
      patient,
      location,
      obs: createObs(
        identificationMapping,
        i,
        patient,
        location,
        dayjs(i.identification_date, "DD/MM/YYYY").toDate(),
        [],
        []
      ),
      encounterProviders: [
        {
          provider: "PNOEVPPPPPPPPPPPPPPPPPPPPPPPPPPPP",
          encounterRole,
          uuid:
            i.identification_date.replaceAll("/", "") +
            i.member_code +
            "IIIIIIIIIIIIII",
        },
      ],
      uuid:
        i.identification_date.replaceAll("/", "") +
        i.member_code +
        "IIIIIIIIIIIIII",
    });
  });

  return encounters;
};

const transformSupportActivity = (
  old: MemberSupportActivity[],
  structures: TransferListItem[]
) => {
  const encounters: Encounter[] = [];
  const encounterRole = "a0b03050-c99b-11e0-9572-0800200c9a66";
  old.forEach((i) => {
    const patient = i.member + "MMMMMMMMMMMMMMMMMMMMMM";
    const location = getLocation(
      getIsSocialCenter(i.structure, structures),
      i.cs_code,
      i.structure
    );
    const encounterDatetime = dayjs(i.date_created, "DD/MM/YYYY").toDate()

    encounters.push({
      encounterDatetime,
      encounterType: "SOUTIENEEEEEEEEEEEEEEEEEEEEEEEEEEEEE",
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
          provider: "PNOEVPPPPPPPPPPPPPPPPPPPPPPPPPPPP",
          encounterRole,
          uuid:
            i.date_created.replaceAll("/", "") +
            i.member +
            "SSSSSSSSSSSSSS",
        },
      ],
      uuid:
        i.date_created.replaceAll("/", "") +
        i.member +
        "SSSSSSSSSSSSSS",
    });
  });

  return encounters;
};

const transformSchoolFollowups = (
  old: SchoolFollowupInfo[],
  structures: TransferListItem[]
) => {
  const encounters: Encounter[] = [];
  const encounterRole = "a0b03050-c99b-11e0-9572-0800200c9a66";
  old.forEach((i) => {
    const patient = i.beneficiary_code + "MMMMMMMMMMMMMMMMMMMMMM";
    const location = getLocation(
      getIsSocialCenter(i?.followup.structure, structures),
      i.followup.social_center_code,
      i?.followup.structure
    );

    encounters.push({
      encounterDatetime: dayjs("01/09/" + i.begin_year, "DD/MM/YYYY").toDate(),
      encounterType: "SCOLAIREEEEEEEEEEEEEEEEEEEEEEEEEEEEE",
      patient,
      location,
      obs: createObs(
        schoolFollowupMapping,
        i,
        patient,
        location,
        dayjs("01/09/" + i.begin_year, "DD/MM/YYYY").toDate(),
        [],
        []
      ),
      encounterProviders: [
        {
          provider: "PNOEVPPPPPPPPPPPPPPPPPPPPPPPPPPPP",
          encounterRole,
          uuid:
            i.begin_year +
            i.end_year +
            i.beneficiary_code +
            "SCSCSCSCSCSCSC",
        },
      ],
      uuid:
        i.begin_year +
        i.end_year +
        i.beneficiary_code +
        "SCSCSCSCSCSCSC",
    });
  });

  return encounters;
};

const transformNutritionalFollowups = (
  old: NutritionalFollowupInfo[],
  structures: TransferListItem[]
) => {
  const encounters: Encounter[] = [];
  const encounterRole = "a0b03050-c99b-11e0-9572-0800200c9a66";
  old.forEach((i) => {
    const patient = i.beneficiary_code + "MMMMMMMMMMMMMMMMMMMMMM";
    const location = getLocation(
      getIsSocialCenter(i.structure, structures),
      i.social_center_code,
      i.structure
    );
    const encounterDatetime = dayjs(
      i.visit_date_day + "/" + i.visit_date_month + "/" + i.visit_date_year,
      "DD/MM/YYYY"
    ).toDate();

    encounters.push({
      encounterDatetime,
      encounterType: "NUTRITIONEEEEEEEEEEEEEEEEEEEEEEEEEEE",
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
          provider: "PNOEVPPPPPPPPPPPPPPPPPPPPPPPPPPPP",
          encounterRole,
          uuid:
            i.visit_date_day +
            i.visit_date_month +
            i.visit_date_year +
            i.beneficiary_code +
            "NNNNNNNNNNNNNN",
        },
      ],
      uuid:
        i.visit_date_day +
        i.visit_date_month +
        i.visit_date_year +
        i.beneficiary_code +
        i.beneficiary_code +
        "NNNNNNNNNNNNNN",
    });
  });

  return encounters;
};

const transformReference = (
  old: Reference[],
  structures: TransferListItem[]
) => {
  const encounters: Encounter[] = [];
  const encounterRole = "a0b03050-c99b-11e0-9572-0800200c9a66";
  old.forEach((i) => {
    const patient = i.beneficiary_code + "MMMMMMMMMMMMMMMMMMMMMM";
    const location = getLocation(
      getIsSocialCenter(i.structure, structures),
      i.cs_code,
      i.structure
    );
    const encounterDatetime = dayjs(i.date_reference, "DD/MM/YYYY").toDate()

    encounters.push({
      encounterDatetime,
      encounterType: "REFERENCEEEEEEEEEEEEEEEEEEEEEEEEEEEE",
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
          provider: "PNOEVPPPPPPPPPPPPPPPPPPPPPPPPPPPP",
          encounterRole,
          uuid:
            i.date_reference.replaceAll("/", "") +
            i.beneficiary_code +
            "RRRRRRRRRRRRRR",
        },
      ],
      uuid:
        i.date_reference.replaceAll("/", "") +
        i.beneficiary_code +
        "RRRRRRRRRRRRRR",
    });

    if (i.counter_reference) {
      const cr = i.counter_reference;
      encounters.push({
        encounterDatetime: dayjs(
          cr.date_contr_reference,
          "DD/MM/YYYY"
        ).toDate(),
        encounterType: "CONTREREFERENCEEEEEEEEEEEEEEEEEEEEEE",
        patient,
        location,
        obs: createObs(
          counterReferenceMapping,
          i,
          patient,
          location,
          dayjs(cr.date_contr_reference, "DD/MM/YYYY").toDate(),
          [],
          []
        ),
        encounterProviders: [
          {
            provider: "PNOEVPPPPPPPPPPPPPPPPPPPPPPPPPPPP",
            encounterRole,
            uuid:
              cr.date_contr_reference.replaceAll("/", "") +
              i.beneficiary_code +
              "CRCRCRCRCRCRCR",
          },
        ],
        uuid:
          cr.date_contr_reference.replaceAll("/", "") +
          i.beneficiary_code +
          "CRCRCRCRCRCRCR",
      });
    }
  });
  return encounters;
};

const createObs = (
  mapping: any,
  entity: any,
  person: string,
  location: string,
  obsDatetime: Date,
  excluded: string[],
  selected: string[]
): Obs[] => {
  const obs: Obs[] = [];
  for (const [key, value] of Object.entries(entity)) {
    if (
      mapping[key] &&
      value &&
      !excluded.includes(key) &&
      selected.length > 0 &&
      selected.includes(key)
    ) {
      if (mapping[key].type === "group") {
        obs.push({
          person,
          concept: mapping[key].concept,
          obsDatetime,
          groupMembers: (value as string).split(" ").map((v) => {
            return {
              person,
              concept: mapping[key].options[v],
              value: true,
              obsDatetime,
            };
          }),
        });
      } else if (mapping[key].type === "coded") {
        obs.push({
          person,
          concept: mapping[key].concept,
          value: mapping[key].options[value as string],
          obsDatetime,
        });
      } else if (mapping[key].type === "date") {
        obs.push({
          person,
          concept: mapping[key].concept,
          value: dayjs(value as string, "DD/MM/YYYY").toDate(),
          obsDatetime,
        });
      } else if (mapping[key].type === "boolean") {
        obs.push({
          person,
          concept: mapping[key].concept,
          value: value === "O" || value === 1,
          obsDatetime,
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

export const Fn = {
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
  transformReference
};

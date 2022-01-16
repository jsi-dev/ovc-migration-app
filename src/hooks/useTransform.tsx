import { TransferListItem } from "@mantine/core";
import React from "react";
import { useQueries } from "react-query";
import { Encounter } from "../models/new/Encounter";
import {
  Household,
  HouseholdAddress,
  HouseholdEvaluation,
  HouseholdGraduation,
  HouseholdMember,
} from "../models/new/Household";
import { Patient } from "../models/new/Patient";
import { Person } from "../models/new/Person";
import {
  OldHouseholdEvaluation,
  OldHouseholdGraduation,
} from "../models/old/Household";
import { HouseholdQuery } from "../services/old/householdQuery";
import { MemberQuery } from "../services/old/memberQuery";
import { Fn } from "../utils/Fn";

export const useTransform = (structures: TransferListItem[]) => {
  const households: Household[] = [];
  const members: HouseholdMember[] = [];
  const patients: Patient[] = [];
  const persons: Person[] = [];
  const encounters: Encounter[] = [];
  const householdEvaluations: HouseholdEvaluation[] = [];
  const householdGraduations: HouseholdGraduation[] = [];
  const householdAddresses: HouseholdAddress[] = [];

  const [structureIds, setStructureIds] = React.useState<number[]>(
    structures.map((s: TransferListItem) => {
      return parseInt(s.description);
    })
  );

  //   console.log(structureIds);
  //   const structureIds: number[] = structures.map((s: TransferListItem) => {
  //     return parseInt(s.description);
  //   });

  const householdQueryResults = useQueries(
    structureIds.map((id: number) => {
      return {
        queryKey: ["old-households", id],
        queryFn: () => HouseholdQuery.getAll(id),
      };
    })
  );
  const evaluationQueryResults = useQueries(
    structureIds.map((id: number) => {
      return {
        queryKey: ["old-household-evaluations", id],
        queryFn: () => HouseholdQuery.getAllEvaluations(id),
        select: (data: OldHouseholdEvaluation[]) => {
          return Fn.transformHouseholdEvaluations(data, structures);
        },
      };
    })
  );

  const graduationQueryResults = useQueries(
    structureIds.map((id: number) => {
      return {
        queryKey: ["old-household-graduations", id],
        queryFn: () => HouseholdQuery.getAllGraduations(id),
        select: (data: OldHouseholdGraduation[]) => {
            console.log(structures)
          return Fn.transformGraduations(data, structures);
        },
      };
    })
  );

  const memberQueryResults = useQueries(
    structureIds.map((id: number) => {
      return {
        queryKey: ["old-members", id],
        queryFn: () => MemberQuery.getAllMembers(id),
        // select: (data: Member[]) => {
        //     return Fn.transformMembers(data);
        // }
      };
    })
  );

  const memberEvaluationQueryResults = useQueries(
    structureIds.map((id: number) => {
      return {
        queryKey: ["old-member-evaluations", id],
        queryFn: () => MemberQuery.getAllEvaluations(id),
        // select: (data: Member[]) => {
        //     return Fn.transformMembers(data);
        // }
      };
    })
  );

  const activityQueryResults = useQueries(
    structureIds.map((id: number) => {
      return {
        queryKey: ["support-activities", id],
        queryFn: () => MemberQuery.getAllActivities(id),
      };
    })
  );

  const nutritionalQueryResults = useQueries(
    structureIds.map((id: number) => {
      return {
        queryKey: ["nutritional-followups", id],
        queryFn: () => MemberQuery.getAllNutritionFollowups(id),
      };
    })
  );

  const schoolQueryResults = useQueries(
    structureIds.map((id: number) => {
      return {
        queryKey: ["school-followups", id],
        queryFn: () => MemberQuery.getAllSchoolFollowups(id),
      };
    })
  );

  const referenceQueryResults = useQueries(
    structureIds.map((id: number) => {
      return {
        queryKey: ["references", id],
        queryFn: () => MemberQuery.getAllReferences(id),
      };
    })
  );

//   const counterReferenceQueryResults = useQueries(
//     structureIds.map((id: number) => {
//       return {
//         queryKey: ["counter-references", id],
//         queryFn: () => MemberQuery.getAllCounterReferences(id),
//       };
//     })
//   );

  const oldHouseholdLoading = householdQueryResults.some(
    (query) => query.isLoading
  );
  const oldEvaluationLoading = evaluationQueryResults.some(
    (query) => query.isLoading
  );
  const oldGraduationLoading = graduationQueryResults.some(
    (query) => query.isLoading
  );
  const memberLoading = memberQueryResults.some((query) => query.isLoading);

  const memberEvaluationLoading = memberEvaluationQueryResults.some((query) => query.isLoading);

  const activityLoading = activityQueryResults.some((query) => query.isLoading);

  const schoolFollowupLoading = schoolQueryResults.some(
    (query) => query.isLoading
  );
  const nutritionalFollowupLoading = nutritionalQueryResults.some(
    (query) => query.isLoading
  );
  const referenceLoading = referenceQueryResults.some((query) => query.data);

  //   const counterReferenceLoading = counterReferenceQueryResults.some(
  //     (query) => query.isLoading
  //   );

  householdQueryResults.forEach(({ data, isSuccess }) => {
    const { households: h } = Fn.transformHouseholds(
      isSuccess && data ? data : [],
      structures
    );
    Array.prototype.push.apply(households, h);
    // Array.prototype.push.apply(members, m);
    // Array.prototype.push.apply(persons, pe);
    // Array.prototype.push.apply(patients, pa);
  });

  evaluationQueryResults.forEach(({ data, isSuccess }) => {
    Array.prototype.push.apply(
      householdEvaluations,
      isSuccess && data ? data : []
    );
  });

  graduationQueryResults.forEach(({ data, isSuccess }) => {
    Array.prototype.push.apply(
      householdGraduations,
      isSuccess && data ? data : []
    );
  });

  memberQueryResults.forEach(({ data, isSuccess }) => {
    console.log('Data from la ', data)
    const {members: m, patients: p, persons: pe } = Fn.transformMembers(isSuccess && data ? data : [], structures);
    Array.prototype.push.apply(members, m);
    Array.prototype.push.apply(patients, p);
    Array.prototype.push.apply(persons, pe);
    Array.prototype.push.apply(encounters, Fn.transformIdentifiers(isSuccess && data ? data : [], structures));
  });

  memberEvaluationQueryResults.forEach(({ data, isSuccess }) => {
    Array.prototype.push.apply(encounters, Fn.transformMemberEvaluations(isSuccess && data ? data : [], structures));
  });

  activityQueryResults.forEach(({ data, isSuccess }) => {
    Array.prototype.push.apply(encounters, Fn.transformSupportActivity(isSuccess && data ? data : [], structures));
  });

  referenceQueryResults.forEach(({ data, isSuccess }) => {
    Array.prototype.push.apply(encounters, Fn.transformReference(isSuccess && data ? data : [], structures));
  });

  nutritionalQueryResults.forEach(({ data, isSuccess }) => {
    Array.prototype.push.apply(encounters, Fn.transformNutritionalFollowups(isSuccess && data ? data : [], structures));
  });

  schoolQueryResults.forEach(({ data, isSuccess }) => {
    Array.prototype.push.apply(encounters, Fn.transformSchoolFollowups(isSuccess && data ? data : [], structures));
  });

  const isLoading =
    oldHouseholdLoading ||
    oldEvaluationLoading ||
    oldGraduationLoading ||
    memberLoading ||
    activityLoading ||
    schoolFollowupLoading ||
    nutritionalFollowupLoading ||
    memberEvaluationLoading ||
    referenceLoading;

  return {
    isLoading,
    households,
    householdEvaluations,
    householdGraduations,
    patients,
    persons,
    members,
    householdAddresses,
    encounters
  };
};

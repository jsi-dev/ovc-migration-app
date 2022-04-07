import { TransferListItem } from '@mantine/core';
import { ErrorMessage } from '../models/other/utils';
import useQueryHousehold from './useQueryHousehold';
import useQueryHouseholdEvaluation from './useQueryHouseholdEvaluation';
import useQueryHouseholdGraduation from './useQueryHouseholdGraduation';
import useQueryMember from './useQueryMember';
import useQueryMemberEvaluations from './useQueryMemberEvaluation';
import useQueryMemberNutritionalFollowup from './useQueryMemberNutritionalFollowup';
import useQueryMemberReference from './useQueryMemberReference';
import useQueryMemberSchoolFollowup from './useQueryMemberSchoolFollowup';
import useQueryMemberSupportActivity from './useQueryMemberSupportActivity';

export const useTransform = (structures: TransferListItem[]) => {
  const {
    households,
    addresses,
    householdAddresses,
    isFetchingHousehold,
    errorMessages: householdErrorMessages,
  } = useQueryHousehold(structures);

  const {
    householdEvaluations,
    isFetchingHouseholdEvaluation,
    messages: householdEvaluationErrorMessage,
  } = useQueryHouseholdEvaluation(structures);

  const { householdGraduations, isFetchingHouseholdGraduation } =
    useQueryHouseholdGraduation(structures);

  const {
    members,
    patients,
    persons,
    identifications,
    isFetchingMember,
    memberErrors: memberErrorMessages,
  } = useQueryMember(structures);

  // console.log(memberErrorMessages, members);

  const {
    memberEvaluations,
    isFetchingMemberEvaluation,
    messages: memberEvaluationErrorMessages,
  } = useQueryMemberEvaluations(structures);

  const { memberSupportActivities, isFetchingSupportActivity } =
    useQueryMemberSupportActivity(structures);

  const {
    memberSchoolFollowups,
    isFetchingSchoolFollowup,
    messages: memberFollowupErrorMessages,
  } = useQueryMemberSchoolFollowup(structures);

  const { memberNutritionalFollowups, isFetchingNutritionalFollowup } =
    useQueryMemberNutritionalFollowup(structures);

  const { memberReferences, isFetchingReference } =
    useQueryMemberReference(structures);

  const errorMessages: ErrorMessage[] = [];
  errorMessages.push(
    ...householdErrorMessages,
    ...householdEvaluationErrorMessage,
    ...memberErrorMessages,
    ...memberEvaluationErrorMessages,
    ...memberFollowupErrorMessages
  );

  const isFetching =
    isFetchingHousehold ||
    isFetchingHouseholdEvaluation ||
    isFetchingHouseholdGraduation ||
    isFetchingMember ||
    isFetchingMemberEvaluation ||
    isFetchingSupportActivity ||
    isFetchingSchoolFollowup ||
    isFetchingNutritionalFollowup ||
    isFetchingReference;

  return {
    isFetching,
    households,
    addresses,
    householdEvaluations,
    householdGraduations,
    patients,
    persons,
    members,
    householdAddresses,
    identifications,
    memberEvaluations,
    memberSupportActivities,
    memberSchoolFollowups,
    memberNutritionalFollowups,
    memberReferences,
    errorMessages,
  };
};

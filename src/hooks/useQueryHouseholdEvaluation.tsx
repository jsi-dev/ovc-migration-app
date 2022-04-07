import { TransferListItem } from '@mantine/core';
import { useQueries } from 'react-query';
import { HouseholdEvaluation } from '../models/new/Household';
import { ErrorMessage } from '../models/other/utils';
import { HouseholdQuery } from '../services/old/householdQuery';
import { Fn } from '../utils/Fn';

const useQueryHouseholdEvaluation = (structures: TransferListItem[]) => {
  const queryResult = useQueries(
    Fn.getStructureIds(structures).map((id: number) => {
      return {
        queryKey: ['old-household-evaluations', id],
        queryFn: () => HouseholdQuery.getAllEvaluations(id),
      };
    })
  );

  const messages: ErrorMessage[] = [];

  const householdEvaluations: HouseholdEvaluation[] = queryResult.reduce(
    (acc: HouseholdEvaluation[], { data, isSuccess }) => {
      const { householdEvaluations, evaluationMessages } =
        Fn.transformHouseholdEvaluations(
          isSuccess && data ? data : [],
          structures
        );
      const evaluations: HouseholdEvaluation[] = householdEvaluations;
      messages.push(...evaluationMessages);

      acc = [...acc, ...evaluations];
      return acc;
    },
    []
  );
  const isFetchingHouseholdEvaluation = queryResult.some(
    (query) => query.isFetching
  );

  return {
    isFetchingHouseholdEvaluation,
    householdEvaluations,
    messages,
  };
};

export default useQueryHouseholdEvaluation;

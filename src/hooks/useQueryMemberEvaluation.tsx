import { TransferListItem } from '@mantine/core';
import { useQueries } from 'react-query';
import { Encounter } from '../models/new/Encounter';
import { ErrorMessage } from '../models/other/utils';
import { MemberQuery } from '../services/old/memberQuery';
import { Fn } from '../utils/Fn';

const useQueryMemberEvaluations = (structures: TransferListItem[]) => {
  const queryResult = useQueries(
    Fn.getStructureIds(structures).map((id: number) => {
      return {
        queryKey: ['old-member-evaluations', id],
        queryFn: () => MemberQuery.getAllEvaluations(id),
      };
    })
  );

  const messages: ErrorMessage[] = [];

  const memberEvaluations: Encounter[] = queryResult.reduce(
    (acc: Encounter[], { data, isSuccess }) => {
      const { encounters, memberErrors } = Fn.transformMemberEvaluations(
        isSuccess && data ? data : [],
        structures
      );
      acc = [...acc, ...encounters];
      messages.push(...memberErrors);
      return acc;
    },
    []
  );

  const isFetchingMemberEvaluation = queryResult.some(
    (query) => query.isFetching
  );

  return {
    isFetchingMemberEvaluation,
    memberEvaluations,
    messages,
  };
};

export default useQueryMemberEvaluations;

import { TransferListItem } from '@mantine/core';
import { useQueries } from 'react-query';
import { Encounter } from '../models/new/Encounter';
import { MemberQuery } from '../services/old/memberQuery';
import { Fn } from '../utils/Fn';

const useQueryMemberNutritionalFollowup = (structures: TransferListItem[]) => {
  const queryResult = useQueries(
    Fn.getStructureIds(structures).map((id: number) => {
      return {
        queryKey: ['old-member-nutritional-followups', id],
        queryFn: () => MemberQuery.getAllNutritionFollowups(id),
      };
    })
  );
  const memberNutritionalFollowups: Encounter[] = queryResult.reduce(
    (acc: Encounter[], { data, isSuccess }) => {
      const encounters = Fn.transformNutritionalFollowups(
        isSuccess && data ? data : [],
        structures
      );
      acc = [...acc, ...encounters];
      return acc;
    },
    []
  );
  const isFetchingNutritionalFollowup = queryResult.some(
    (query) => query.isFetching
  );

  return {
    isFetchingNutritionalFollowup,
    memberNutritionalFollowups,
  };
};

export default useQueryMemberNutritionalFollowup;

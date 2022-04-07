import { TransferListItem } from '@mantine/core';
import { useQueries } from 'react-query';
import { Encounter } from '../models/new/Encounter';
import { MemberQuery } from '../services/old/memberQuery';
import { Fn } from '../utils/Fn';

const useQueryMemberSupportActivity = (structures: TransferListItem[]) => {
  const queryResult = useQueries(
    Fn.getStructureIds(structures).map((id: number) => {
      return {
        queryKey: ['old-member-support-activities', id],
        queryFn: () => MemberQuery.getAllActivities(id),
      };
    })
  );
  const memberSupportActivities: Encounter[] = queryResult.reduce(
    (acc: Encounter[], { data, isSuccess }) => {
      const encounters = Fn.transformSupportActivity(
        isSuccess && data ? data : [],
        structures
      );
      acc = [...acc, ...encounters];
      return acc;
    },
    []
  );
  const isFetchingSupportActivity = queryResult.some(
    (query) => query.isFetching
  );

  return {
    isFetchingSupportActivity,
    memberSupportActivities,
  };
};

export default useQueryMemberSupportActivity;

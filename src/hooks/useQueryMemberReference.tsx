import { TransferListItem } from '@mantine/core';
import { useQueries } from 'react-query';
import { Encounter } from '../models/new/Encounter';
import { MemberQuery } from '../services/old/memberQuery';
import { Fn } from '../utils/Fn';

const useQueryMemberReference = (structures: TransferListItem[]) => {
  const queryResult = useQueries(
    Fn.getStructureIds(structures).map((id: number) => {
      return {
        queryKey: ['old-member-references', id],
        queryFn: () => MemberQuery.getAllReferences(id),
      };
    })
  );
  const memberReferences: Encounter[] = queryResult.reduce(
    (acc: Encounter[], { data, isSuccess }) => {
      const encounters = Fn.transformReference(
        isSuccess && data ? data : [],
        structures
      );
      acc = [...acc, ...encounters];
      return acc;
    },
    []
  );
  const isFetchingReference = queryResult.some((query) => query.isFetching);

  return {
    isFetchingReference,
    memberReferences,
  };
};

export default useQueryMemberReference;

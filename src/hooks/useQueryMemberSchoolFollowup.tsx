import { TransferListItem } from '@mantine/core';
import { useQueries } from 'react-query';
import { Encounter } from '../models/new/Encounter';
import { ErrorMessage } from '../models/other/utils';
import { MemberQuery } from '../services/old/memberQuery';
import { Fn } from '../utils/Fn';

const useQueryMemberSchoolFollowup = (structures: TransferListItem[]) => {
  const queryResult = useQueries(
    Fn.getStructureIds(structures).map((id: number) => {
      return {
        queryKey: ['old-member-school-followups', id],
        queryFn: () => MemberQuery.getAllSchoolFollowups(id),
      };
    })
  );
  const messages: ErrorMessage[] = [];
  const memberSchoolFollowups: Encounter[] = queryResult.reduce(
    (acc: Encounter[], { data, isSuccess }) => {
      const { encounters, errorMessages } = Fn.transformSchoolFollowups(
        isSuccess && data ? data : [],
        structures
      );
      acc = [...acc, ...encounters];
      messages.push(...errorMessages);
      return acc;
    },
    []
  );
  const isFetchingSchoolFollowup = queryResult.some(
    (query) => query.isFetching
  );

  return {
    isFetchingSchoolFollowup,
    memberSchoolFollowups,
    messages,
  };
};

export default useQueryMemberSchoolFollowup;

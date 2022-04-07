import { TransferListItem } from '@mantine/core';
import { useQueries } from 'react-query';
import { Encounter } from '../models/new/Encounter';
import { HouseholdMember } from '../models/new/Household';
import { Patient } from '../models/new/Patient';
import { Person } from '../models/new/Person';
import { ErrorMessage } from '../models/other/utils';
import { MemberQuery } from '../services/old/memberQuery';
import { Fn } from '../utils/Fn';

const useQueryMember = (structures: TransferListItem[]) => {
  const queryResult = useQueries(
    Fn.getStructureIds(structures).map((id: number) => {
      return {
        queryKey: ['old-household-members', id],
        queryFn: () => MemberQuery.getAllMembers(id),
      };
    })
  );

  const memberErrors: ErrorMessage[] = [];

  const members: HouseholdMember[] = [];
  const patients: Patient[] = [];
  const persons: Person[] = [];
  const identifications: Encounter[] = [];

  queryResult.forEach(({ data, isSuccess }) => {
    const {
      members: m,
      patients: p,
      persons: pe,
      memberErrors: errors,
    } = Fn.transformMembers(isSuccess && data ? data : [], structures);
    Array.prototype.push.apply(members, m);
    Array.prototype.push.apply(patients, p);
    Array.prototype.push.apply(persons, pe);
    Array.prototype.push.apply(
      identifications,
      Fn.transformIdentifiers(isSuccess && data ? data : [], structures)
    );
    memberErrors.push(...errors);
  });

  const isFetchingMember = queryResult.some((query) => query.isFetching);

  return {
    isFetchingMember,
    members,
    patients,
    persons,
    identifications,
    memberErrors,
  };
};

export default useQueryMember;

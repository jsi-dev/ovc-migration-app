import { TransferListItem } from '@mantine/core';
import { useQueries } from 'react-query';
import { HouseholdGraduation } from '../models/new/Household';
import { HouseholdQuery } from '../services/old/householdQuery';
import { Fn } from '../utils/Fn';

const useQueryHouseholdGraduation = (structures: TransferListItem[]) => {
  const queryResult = useQueries(
    Fn.getStructureIds(structures).map((id: number) => {
      return {
        queryKey: ['old-household-graduations', id],
        queryFn: () => HouseholdQuery.getAllGraduations(id),
      };
    })
  );

  const householdGraduations: HouseholdGraduation[] = queryResult.reduce(
    (acc: HouseholdGraduation[], { data, isSuccess }) => {
      const graduations: HouseholdGraduation[] = Fn.transformGraduations(
        isSuccess && data ? data : [],
        structures
      );

      acc = [...acc, ...graduations];
      // console.log('Accumulateur de graduation', acc);

      return acc;
    },
    []
  );
  const isFetchingHouseholdGraduation = queryResult.some(
    (query) => query.isFetching
  );
  // console.log('Graduations', householdGraduations);

  return {
    isFetchingHouseholdGraduation,
    householdGraduations,
  };
};

export default useQueryHouseholdGraduation;

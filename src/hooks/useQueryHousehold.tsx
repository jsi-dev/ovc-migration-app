import { TransferListItem } from '@mantine/core';
import { useQueries } from 'react-query';
import { Household, HouseholdAddress } from '../models/new/Household';
import { PersonAddress } from '../models/new/Person';
import { ErrorMessage } from '../models/other/utils';
import { HouseholdQuery } from '../services/old/householdQuery';
import { Fn } from '../utils/Fn';

const useQueryHousehold = (structures: TransferListItem[]) => {
  const queryResult = useQueries(
    Fn.getStructureIds(structures).map((id: number) => {
      return {
        queryKey: ['old-households', id],
        queryFn: () => HouseholdQuery.getAll(id),
      };
    })
  );

  const errorMessages: ErrorMessage[] = [];
  const householdAddresses: HouseholdAddress[] = [];

  const addresses: PersonAddress[] = [];

  const households: Household[] = queryResult.reduce(
    (acc: Household[], { data, isSuccess }) => {
      const { households: h, householdMessages } = Fn.transformHouseholds(
        isSuccess && data ? data : [],
        structures
      );

      // const { addresses: a, householdAddresses: ha } = Fn.transformAddresses(
      //   isSuccess && data ? data : [],
      //   structures
      // );
      // Array.prototype.push.apply(addresses, a);
      // Array.prototype.push.apply(householdAddresses, ha);
      Array.prototype.push.apply(errorMessages, householdMessages);
      // errorMessages.push(() => householdMessages.map(e => e));

      acc = [...acc, ...h];
      return acc;
    },
    []
  );

  const isFetchingHousehold = queryResult.some((query) => query.isFetching);

  return {
    isFetchingHousehold,
    households,
    addresses,
    householdAddresses,
    errorMessages,
  };
};

export default useQueryHousehold;

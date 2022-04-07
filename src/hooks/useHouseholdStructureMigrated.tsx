import { useState } from 'react';
import { useQuery } from 'react-query';
import { LocationQuery } from '../services/new/locationQuery';

export const useHouseholdStructureMigrated = (executeQuery: boolean) => {
  const [enabled, setEnabled] = useState(executeQuery);

  const { data, isSuccess, isError, error, refetch } = useQuery(
    ['all-migrated-structures'],
    async () => {
      return await LocationQuery.getMigratedStructures();
    },
    { enabled }
  );

  // console.log(data);

  const migratedStructures = data || [];

  // const extractLocations = (households: Household[]): Location[] => {
  //   return households.reduce((locations: Location[], household: Household) => {
  //     if (household.location) {
  //       if (
  //         locations.length === 0 ||
  //         locations.findIndex(
  //           (l) => l.uuid && l.uuid === household.location.uuid
  //         ) !== -1
  //       )
  //         locations.push(household.location);
  //     }
  //     return locations;
  //   }, []);
  // };

  // const migrationStructures: Location[] = data ? extractLocations(data) : [];

  if (isError) {
    throw Error('An error occurred ' + error);
  }

  return {
    isSuccess,
    migratedStructures,
    enabled,
    setEnabled,
    refetch,
  };
};

import { TransferListData, TransferListItem } from '@mantine/core';
import { useQuery } from 'react-query';
import { StructureQuery } from '../services/old/structureQuery';
import { Fn } from '../utils/Fn';
import { Location } from '../models/new/Location';

export const useStructure = (migratedLocations: Location[]) => {
  let enabled = true;
  const { data, isSuccess, isError, error } = useQuery(
    ['products'],
    async () => {
      return await StructureQuery.findAll();
    },
    {
      enabled,
      select: (data) => {
        const sortedData = data.sort((a, b) =>
          a.structureShortName > b.structureShortName ? 1 : -1
        );
        return Fn.createTransferListData(
          sortedData,
          'structureShortName',
          'structureName',
          '',
          'platform',
          'id'
        );
      },
    }
  );

  const extractMigrated = (listData: TransferListData): TransferListData => {
    let listItems: TransferListItem[] = listData[0];

    for (let i = 0; i < listItems.length; i++) {
      if (
        migratedLocations.findIndex(
          (s: Location) => s.name === listItems[i].value
        ) !== -1
      ) {
        listItems.splice(i, 1);
      }
    }

    listData[0] = listItems;
    return listData;
  };

  const structures = data
    ? extractMigrated(data)
    : ([[], []] as TransferListData);

  const setEnabled = (b: boolean) => {
    enabled = b;
  };

  if (isError) {
    throw Error('An error occurred ' + error);
  }

  // let data: TransferListData = [[], []];

  if (isSuccess && structures) {
    // console.log(structures.length);
  }

  return {
    data: structures,
    enabled,
    setEnabled,
    isSuccess,
  };
};

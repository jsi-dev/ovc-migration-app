import { useQuery } from 'react-query';
import { ProgramQuery } from '../services/old/dreams/programQuery';

export const useDreamsStructure = () => {
  let enabled = true;
  const {
    data: programs,
    isSuccess,
    isError,
    error,
  } = useQuery(
    ['programs-dreams'],
    async () => {
      return await ProgramQuery.getAll();
    },
    {
      enabled,
    }
  );

  const setEnabled = (b: boolean) => {
    enabled = b;
  };

  if (isError) {
    throw Error('An error occurred ' + error);
  }

  // let data: TransferListData = [[], []];

  return {
    programs,
    enabled,
    setEnabled,
    isSuccess,
  };
};

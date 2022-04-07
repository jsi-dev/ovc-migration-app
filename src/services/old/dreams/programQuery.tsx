import { apiDreams } from '../../../utils/http-common';

const getAll = async () => {
  const response = await apiDreams.get(`/programme`);
  return response.data;
};

export const ProgramQuery = {
  getAll,
};

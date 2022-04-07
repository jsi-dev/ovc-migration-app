import { OldStructure } from '../../models/old/Structure';
import { apiClient } from '../../utils/http-common';

const findOne = async (id: number) => {
  const response = await apiClient.get<any>(`/structure/${id}`);
  return response.data;
};

const findAll = async () => {
  const response = await apiClient.get<OldStructure[]>('/structure?limit=500');
  return response.data;
};

export const StructureQuery = {
  findOne,
  findAll,
};

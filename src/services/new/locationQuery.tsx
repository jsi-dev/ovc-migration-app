import { api } from '../../utils/http-common';
import { Location } from '../../models/new/Location';

const getMigratedStructures = async (): Promise<Location[]> => {
  const response = await api.get<any>(`/location?withHousehold=true&v=default`);
  return response.data.results;
};

export const LocationQuery = {
  getMigratedStructures,
};

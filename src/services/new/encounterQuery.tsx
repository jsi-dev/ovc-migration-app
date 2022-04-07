import { Encounter } from '../../models/new/Encounter';
import { api } from '../../utils/http-common';

/************* ENCOUNTER SERVICE****************/

const getOneEncounter = async (uuid: string) => {
  const response = await api.get<Encounter>(`/encounter/${uuid}`);
  return response.data;
};
const saveEncounter = async (encounter: Encounter) => {
  const response = await api.post<Encounter>(`/encounter`, encounter);
  return response.data;
};
const updateOneEncounter = async (uuid: string, encounter: any) => {
  const response = await api.post<Encounter>(`/encounter/${uuid}`, encounter);
  return response.data;
};

export const EncounterQuery = {
  getOneEncounter,
  saveEncounter,
  updateOneEncounter,
};

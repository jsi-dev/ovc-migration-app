import { Encounter } from "../../models/new/Encounter";
import { apiClientNew } from "../../utils/http-common";


/************* ENCOUNTER SERVICE****************/

const getOneEncounter = async (uuid: string) => {
    const response = await apiClientNew.get<Encounter>(`/encounter/${uuid}`);
    return response.data;
}
const saveOneEncounter = async (encounter: Encounter) => {
    const response = await apiClientNew.post<Encounter>(`/encounter`, encounter);
    return response.data;
}
const updateOneEncounter = async (uuid: string, encounter: any) => {
    const response = await apiClientNew.post<Encounter>(`/encounter/${uuid}`, encounter);
    return response.data;
}

export const EncounterQuery = {
    getOneEncounter,
    saveOneEncounter,
    updateOneEncounter
}
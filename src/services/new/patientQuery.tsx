import { Person, PersonAddress } from "../../models/new/Person";
import { Patient } from "../../models/new/Patient";
import { apiClientNew } from "../../utils/http-common";


/************* PATIENT SERVICE****************/

const getOnePatient = async (uuid: string) => {
    const response = await apiClientNew.get<Patient>(`/patient/${uuid}`);
    return response.data;
}
const saveOnePatient = async (patient: Patient) => {
    const response = await apiClientNew.post<Patient>(`/patient`, patient);
    return response.data;
}
const updateOnePatient = async (uuid: string, patient: any) => {
    const response = await apiClientNew.post<Patient>(`/patient/${uuid}`, patient);
    return response.data;
}

/************* PERSON SERVICE****************/

const getOnePerson = async (uuid: string) => {
    const response = await apiClientNew.get<Person>(`/person/${uuid}`);
    return response.data;
}
const savePerson = async (data: Person) => {
    const response = await apiClientNew.post<Person>(`/person`, data);
    return response.data;
}
const updatePerson = async (uuid: string, data: any) => {
    const response = await apiClientNew.post<Person>(`/person/${uuid}`, data);
    return response.data;
}

/************* PERSON ADDRESS SERVICE****************/

const savePersonAddress = async (personAddress: PersonAddress) => {
    const response = await apiClientNew.post<PersonAddress>(`/personAddress`, personAddress);
    return response.data;
}
const updatePersonAddress = async (uuid: string, personAddress: any) => {
    const response = await apiClientNew.post<PersonAddress>(`/personAddress/${uuid}`, personAddress);
    return response.data;
}


export const PatientQuery = {
    getOnePerson,
    savePerson,
    updatePerson,
    getOnePatient,
    saveOnePatient,
    updateOnePatient,
    savePersonAddress,
    updatePersonAddress

}
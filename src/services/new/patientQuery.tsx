import { Person, PersonAddress } from '../../models/new/Person';
import { Patient } from '../../models/new/Patient';
import { api } from '../../utils/http-common';

/************* PATIENT SERVICE****************/

const getOnePatient = async (uuid: string) => {
  const response = await api.get<Patient>(`/patient/${uuid}`);
  return response.data;
};
const savePatient = async (patient: Patient): Promise<Patient> => {
  const response = await api.post<Patient>(`/patient`, patient);
  return response.data;
};
const updateOnePatient = async (uuid: string, patient: any) => {
  const response = await api.post<Patient>(`/patient/${uuid}`, patient);
  return response.data;
};

/************* PERSON SERVICE****************/

const getOnePerson = async (uuid: string) => {
  const response = await api.get<Person>(`/person/${uuid}`);
  return response.data;
};
const savePerson = async (data: Person) => {
  const response = await api.post<Person>(`/person`, data);
  return response.data;
};
const updatePerson = async (uuid: string, data: any) => {
  const response = await api.post<Person>(`/person/${uuid}`, data);
  return response.data;
};

/************* PERSON ADDRESS SERVICE****************/

const savePersonAddress = async (personAddress: PersonAddress) => {
  const response = await api.post<PersonAddress>(
    `/personAddress`,
    personAddress
  );
  return response.data;
};
const updatePersonAddress = async (uuid: string, personAddress: any) => {
  const response = await api.post<PersonAddress>(
    `/personAddress/${uuid}`,
    personAddress
  );
  return response.data;
};

export const PatientQuery = {
  getOnePerson,
  savePerson,
  updatePerson,
  getOnePatient,
  savePatient,
  updateOnePatient,
  savePersonAddress,
  updatePersonAddress,
};

import {
  Household,
  HouseholdGraduation,
  HouseholdMember,
  HouseholdEvaluation,
  HouseholdAddress,
} from '../../models/new/Household';
import { api } from '../../utils/http-common';

//************* HOUSEHOLD SERVICE****************

const getOneHousehold = async (uuid: string) => {
  const response = await api.get<Household>(`/household/${uuid}`);
  return response.data;
};
const saveHousehold = async (household: Household) => {
  const response = await api.post<Household>(`/household`, household);
  return response.data;
};
const updateHousehold = async (uuid: string, household: Household) => {
  const response = await api.post<Household>(`/household/${uuid}`, household);
  return response.data;
};

const getAllHouseholds = async (): Promise<Household[]> => {
  const response = await api.get<any>(`/household`);
  return response.data.results;
};

//************* MEMBERS SERVICE****************

const getOneHouseholdMember = async (
  householdUuid: string,
  memberUuid: string
) => {
  const response = await api.get<HouseholdMember>(
    `/household/${householdUuid}/member/${memberUuid}`
  );
  return response.data;
};
const saveHouseholdMember = async (
  member: HouseholdMember,
  householdUuid?: string
) => {
  const response = await api.post<HouseholdMember>(
    `/household/${householdUuid}/member/`,
    member
  );
  return response.data;
};
const updateHouseholdMember = async (
  member: HouseholdMember,
  householdUuid: string,
  uuid: string
) => {
  const response = await api.post<HouseholdMember>(
    `/household/${householdUuid}/member/${uuid}`,
    member
  );
  return response.data;
};

//************* GRADUATION SERVICE****************

const getOneHouseholdGraduation = async (
  householdUuid: string,
  graduationUuid: string
) => {
  const response = await api.get<HouseholdGraduation>(
    `/household/${householdUuid}/graduation/${graduationUuid}`
  );
  return response.data;
};
const saveHouseholdGraduation = async (
  graduation: HouseholdGraduation,
  householdUuid?: string
) => {
  const response = await api.post<HouseholdGraduation>(
    `/household/${householdUuid}/graduation/`,
    graduation
  );
  return response.data;
};
const updateHouseholdGraduation = async (
  graduation: HouseholdGraduation,
  householdUuid: string,
  uuid: string
) => {
  const response = await api.post<HouseholdGraduation>(
    `/household/${householdUuid}/graduation/${uuid}`,
    graduation
  );
  return response.data;
};

//************* EVALUATION SERVICE****************

const getOneHouseholdEvaluation = async (
  householdUuid: string,
  evaluationUuid: string
) => {
  const response = await api.get<HouseholdEvaluation>(
    `/household/${householdUuid}/evaluation/${evaluationUuid}`
  );
  return response.data;
};
const saveHouseholdEvaluation = async (
  evaluation: HouseholdEvaluation,
  householdUuid?: string
) => {
  const response = await api.post<HouseholdEvaluation>(
    `/household/${householdUuid}/evaluation/`,
    evaluation
  );
  return response.data;
};
const updateHouseholdEvaluation = async (
  evaluation: HouseholdEvaluation,
  householdUuid: string,
  uuid: string
) => {
  const response = await api.post<HouseholdEvaluation>(
    `/household/${householdUuid}/evaluation/${uuid}`,
    evaluation
  );
  return response.data;
};

const saveHouseholdAddress = async (
  address: HouseholdAddress,
  householdUuid?: string
) => {
  const response = await api.post<HouseholdAddress>(
    `/household/${householdUuid}/address`,
    address
  );
  return response.data;
};

export const HouseholdQuery = {
  getOneHousehold,
  getAllHouseholds,
  saveHousehold,
  updateHousehold,
  getOneHouseholdMember,
  saveHouseholdMember,
  updateHouseholdMember,
  getOneHouseholdGraduation,
  saveHouseholdGraduation,
  updateHouseholdGraduation,
  getOneHouseholdEvaluation,
  saveHouseholdEvaluation,
  updateHouseholdEvaluation,
  saveHouseholdAddress,
};

import { Household, HouseholdGraduation, HouseholdMember, HouseholdEvaluation } from "../../models/new/Household";
import { apiClientNew } from "../../utils/http-common";


//************* HOUSEHOLD SERVICE****************

const getOneHousehold = async (uuid: string) => {
    const response = await apiClientNew.get<Household>(`/household/${uuid}`);
    return response.data;
}
const saveHousehold = async (household: Household) => {
    const response = await apiClientNew.post<Household>(`/household`, household);
    return response.data;
}
const updateHousehold = async (uuid: string, household: Household) => {
    const response = await apiClientNew.post<Household>(`/household/${uuid}`, household);
    return response.data;
}

//************* MEMBERS SERVICE****************

const getOneHouseholdMember = async (householdUuid: string, memberUuid: string) => {
    const response = await apiClientNew.get<HouseholdMember>(`/household/${householdUuid}/member/${memberUuid}`);
    return response.data;
}
const saveHouseholdMember = async (member: HouseholdMember, householdUuid: string) => {
    const response = await apiClientNew.post<HouseholdMember>(`/household/${householdUuid}/member/`, member);
    return response.data;
}
const updateHouseholdMember = async (member: HouseholdMember, householdUuid: string, uuid: string) => {
    const response = await apiClientNew.post<HouseholdMember>(`/household/${householdUuid}/member/${uuid}`, member);
    return response.data;
}

//************* GRADUATION SERVICE****************

const getOneHouseholdGraduation = async (householdUuid: string, graduationUuid: string) => {
    const response = await apiClientNew.get<HouseholdGraduation>(`/household/${householdUuid}/graduation/${graduationUuid}`);
    return response.data;
}
const saveHouseholdGraduation = async (graduation: HouseholdGraduation, householdUuid: string) => {
    const response = await apiClientNew.post<HouseholdGraduation>(`/household/${householdUuid}/graduation/`, graduation);
    return response.data;
}
const updateHouseholdGraduation = async (graduation: HouseholdGraduation, householdUuid: string, uuid: string) => {
    const response = await apiClientNew.post<HouseholdGraduation>(`/household/${householdUuid}/graduation/${uuid}`, graduation);
    return response.data;
}

//************* EVALUATION SERVICE****************

const getOneHouseholdEvaluation = async (householdUuid: string, evaluationUuid: string) => {
    const response = await apiClientNew.get<HouseholdEvaluation>(`/household/${householdUuid}/evaluation/${evaluationUuid}`);
    return response.data;
}
const saveHouseHouseholdEvaluation = async (evaluation: HouseholdEvaluation, householdUuid: string) => {
    const response = await apiClientNew.post<HouseholdEvaluation>(`/household/${householdUuid}/evaluation/`, evaluation);
    return response.data;
}
const updateHouseHouseholdEvaluation = async (evaluation: HouseholdEvaluation, householdUuid: string, uuid: string) => {
    const response = await apiClientNew.post<HouseholdEvaluation>(`/household/${householdUuid}/evaluation/${uuid}`, evaluation);
    return response.data;
}


export const HouseholdQuery = {
 getOneHousehold,
 saveHousehold,
 updateHousehold,
 getOneHouseholdMember,
 saveHouseholdMember,
 updateHouseholdMember,
 getOneHouseholdGraduation,
 saveHouseholdGraduation,
 updateHouseholdGraduation,
 getOneHouseholdEvaluation,
 saveHouseHouseholdEvaluation,
 updateHouseHouseholdEvaluation
}
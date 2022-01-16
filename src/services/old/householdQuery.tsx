import { OldHousehold, OldHouseholdEvaluation, OldHouseholdGraduation } from "../../models/old/Household";
import { apiClient } from "../../utils/http-common";



const getAll = async (structure: number): Promise<OldHousehold[]> => {
  const response = await apiClient.get<OldHousehold[]>(
    `/household/${structure}/structure`
  );
  return response.data;
};

const getAllEvaluations = async (structure: number): Promise<OldHouseholdEvaluation[]> => {
  const response = await apiClient.get<OldHouseholdEvaluation[]>(
    `/household-evaluation/${structure}/structure`
  );
  return response.data;
};

const getAllGraduations = async (structure: number): Promise<OldHouseholdGraduation[]> => {
  const response = await apiClient.get<OldHouseholdGraduation[]>(
    `/household-graduation/${structure}/structure`
  );
  return response.data;
};

export const HouseholdQuery = {
  getAll,
  getAllEvaluations,
  getAllGraduations
};

import { Member } from "../../models/old/Member";
import { MemberEvaluation } from "../../models/old/MemberEvaluation";
import { MemberSupportActivity } from "../../models/old/MemberSupportActivity";
import { NutritionalFollowupInfo } from "../../models/old/NutritionalFollowup";
import { CounterReference, Reference } from "../../models/old/Reference";
import { SchoolFollowupInfo } from "../../models/old/SchoolFollowup";
import { apiClient } from "../../utils/http-common";

const getAllMembers = async (id: number): Promise<Member[]> => {
  const response = await apiClient.get(`/member/${id}/structure`);
  return response.data;
};

const getAllEvaluations = async (
  structure: number
): Promise<MemberEvaluation[]> => {
  const response = await apiClient.get(
    `/member-evaluation/${structure}/structure`
  );
  return response.data;
};

const getAllActivities = async (
  structure: number
): Promise<MemberSupportActivity[]> => {
  const response = await apiClient.get(
    `/support-activity/${structure}/structure`
  );
  return response.data;
};

const getAllNutritionFollowups = async (
  structure: number
): Promise<NutritionalFollowupInfo[]> => {
  const response = await apiClient.get(
    `/nutritional-followup/${structure}/structure`
  );
  return response.data;
};

const getAllSchoolFollowups = async (
  structure: number
): Promise<SchoolFollowupInfo[]> => {
  const response = await apiClient.get(
    `/school-followup/${structure}/structure`
  );
  return response.data;
};

const getAllReferences = async (structure: number): Promise<Reference[]> => {
  const response = await apiClient.get(`/reference/${structure}/structure`);
  return response.data;
};

const getAllCounterReferences = async (
  structure: number
): Promise<CounterReference[]> => {
  const response = await apiClient.get(
    `/counter-reference/${structure}/structure`
  );
  return response.data;
};

export const MemberQuery = {
  getAllMembers,
  getAllEvaluations,
  getAllActivities,
  getAllNutritionFollowups,
  getAllSchoolFollowups,
  getAllReferences,
  getAllCounterReferences,
};

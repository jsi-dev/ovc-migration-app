import { SocialCenter } from "../../models/old/SocialCenter";
import { apiClient } from "../../utils/http-common";

const findOne = async (id: string) => {
  const response = await apiClient.get<SocialCenter>(`/social-center/${id}`);
  return response.data;
};

const findAll = async () => {
  const response = await apiClient.get<SocialCenter[]>(
    "/social-center?limit=1000"
  );
  return response.data;
};

export const SocialCenterQuery = {
  findOne,
  findAll,
};

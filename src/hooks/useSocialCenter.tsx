import { useState } from "react";
import { useQuery } from "react-query";
import { SocialCenterQuery } from "../services/old/socialCenterQuery";

export const useSocialCenter = () => {
  const [enabled, setEnabled] = useState(true);

  const {
    data: socialCenters,
    isSuccess,
    isError,
    error,
  } = useQuery(
    ["socialCenters"],
    async () => {
      return await SocialCenterQuery.findAll();
    },
    { enabled }
  );

  if (isError) {
    throw Error("An error occurred " + error);
  }

  return {
    isSuccess,
    socialCenters,
    enabled,
    setEnabled,
  };
};

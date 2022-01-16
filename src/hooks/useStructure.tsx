import { useQuery } from "react-query";
import { StructureQuery } from "../services/old/structureQuery";
import { Fn } from "../utils/Fn";

export const useStructure = () => {
  let enabled = true;
  const {
    data: structures,
    isSuccess,
    isError,
    error,
  } = useQuery(
    ["products"],
    async () => {
      return await StructureQuery.findAll();
    },
    {
      enabled,
      select: (data) => {
        return Fn.createTransferListData(data, 'structureShortName', 'structureName', '', 'platform', 'id')
      },
    }
  );

  const setEnabled = (b: boolean) => {
    enabled = b;
  };

  if (isError) {
    throw Error("An error occurred " + error);
  }

  // let data: TransferListData = [[], []];

  if (isSuccess && structures) {
    // console.log(structures.length);
  }

  return {
    data: structures,
    enabled,
    setEnabled,
    isSuccess,
  };
};

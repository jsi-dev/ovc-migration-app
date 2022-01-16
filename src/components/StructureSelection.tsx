import { useState } from "react";
import {
  Badge,
  Checkbox,
  Group,
  Text,
  TransferList,
  TransferListData,
  TransferListItemComponent,
  TransferListItemComponentProps,
} from "@mantine/core";
// import { useSocialCenter } from "../hooks/useSocialCenter";
// import { Fn } from "../utils/Fn";
import { useStructure } from "../hooks/useStructure";

const ItemComponent: TransferListItemComponent = ({
  data,
  selected,
}: TransferListItemComponentProps) => (
  <Group noWrap>
    <Badge variant="filled">{data.image}</Badge>
    <div style={{ flex: 1 }}>
      <Text size="sm" weight={500}>
        {data.value}
      </Text>
      <Text size="xs" color="dimmed" weight={400}>
        {data.label}
      </Text>
    </div>
    <Checkbox
      checked={selected}
      onChange={() => {}}
      tabIndex={-1}
      sx={{ pointerEvents: "none" }}
    />
  </Group>
);

type StructureSelectionProps = {
  handleSelected: (data: any) => void;
};

let list: TransferListData | undefined = [[], []];

const StructureSelection = (props: StructureSelectionProps) => {
  // const { socialCenters, isSuccess } = useSocialCenter();
  const { data: listData, isSuccess, setEnabled } = useStructure();
  const [data, setData] = useState<TransferListData>();

  // list = isSuccess && !data
  //   ? Fn.createTransferListData(
  //       socialCenters,
  //       "name",
  //       "platform",
  //       "Code Plateforme : ",
  //       "cs_code",
  //       "platform"
  //     )
  //   : [[], []];

  list = isSuccess && listData ? listData : [[], []];

  const handleSelected = (d: TransferListData) => {
    setData(d);
    list = undefined;
    if (d.length === 2) {
      setEnabled(false)
      props.handleSelected(d[1]);
    } else {
      setEnabled(true);
      props.handleSelected([]);
    }
  };

  return (
    <>
      <TransferList
        value={data ? data : list}
        showTransferAll={true}
        onChange={(d) => handleSelected(d)}
        searchPlaceholder="Search employees..."
        nothingFound="Aucune structure sélectionnée"
        titles={["Structures disponibles", "Structures à migrer"]}
        listHeight={350}
        breakpoint="sm"
        itemComponent={ItemComponent}
        filter={(query, item) =>
          item.label.toLowerCase().includes(query.toLowerCase().trim()) ||
          item.description.toLowerCase().includes(query.toLowerCase().trim())
        }
      />
    </>
  );
};

export default StructureSelection;

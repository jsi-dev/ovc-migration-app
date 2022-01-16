import React, { useState } from "react";
import {
  Grid,
  Group,
  Col,
  Card,
  Text,
  useMantineTheme,
  Divider,
  Button,
  TransferListItem,
  Badge,
} from "@mantine/core";
import StructureSelection from "../components/StructureSelection";
import DataTable from "react-data-table-component";
import { PaperPlaneIcon } from "@modulz/radix-icons";
import MigrationState from "../components/MigrationState";

const Migration = () => {
  const theme = useMantineTheme();
  const [selectedStructures, setSelectedStructures] = useState<
    TransferListItem[]
  >([]);
  const [startedMigration, setStartedMigration] = useState(false);
  const [count, setCount] = useState(0);
  const [migrationReady, setMigrationReady] = useState(false)

  const toggleStartMigration = () => {
    setStartedMigration(!startedMigration);
  };

  // const migrate = () => {
  //   selectedStructures.forEach((structure) => {
  //     setCurrentStructure(structure);
  //     setCount(count + 1);
  //   });
  // };

  const handleSelectedStructure = (data: any) => {
    // console.log('Data in migration', data);
    setSelectedStructures(data);
    const ids: number[] = data.map((d: any) => {
      return parseInt(d.description);
    });
    console.log("ids", ids);
    setStartedMigration(false);
    // console.log('Data in migration selectedStructures', selectedStructures);
  };

  return (
    <Grid columns={9}>
      <Col span={5}>
        <Card shadow="xs" padding="md">
          <Group position="apart" style={{ marginBottom: 10 }}>
            <Text
              transform="uppercase"
              color={theme.colors.blue[8]}
              weight={500}
            >
              Selection des structures
            </Text>
          </Group>
          <Divider style={{ marginBottom: 5 }} />
          <StructureSelection
            handleSelected={(data) => handleSelectedStructure(data)}
          />
          <Divider my={"sm"} />
          {/* {JSON.stringify(selectedStructures)} <br /> */}

          <Group position="apart">
            <Button
              style={{ marginTop: 10, marginBottom: 10 }}
              onClick={toggleStartMigration}
              leftIcon={<PaperPlaneIcon />}
            >
              Terminer la sélection
            </Button>
            {selectedStructures.length > 0 && (
              <Badge size="xl" color={"green"}>
                {count} / {selectedStructures.length}
              </Badge>
            )}
          </Group>

          {startedMigration ? (
            <>
              <Divider style={{ marginBottom: 5 }} />
              <MigrationState structures={selectedStructures} migrationReady={migrationReady} />
            </>
          ) : null}
        </Card>
      </Col>
      <Col span={4}>
        <Card shadow="xs" padding="md">
          <Group style={{ marginBottom: 10 }}>
            <Text
              transform="uppercase"
              color={theme.colors.blue[8]}
              weight={500}>
              Liste des structures aux données migrées
            </Text>
          </Group>
          <Divider />
          <DataTable
            columns={[
              {
                name: "Structure",
              },
              {
                name: "Date de migration",
              },
              {
                name: "Nombre de menages",
              },
              {
                name: "Statut",
              },
              {
                name: "Temps mis pour migrer",
              },
            ]}
            data={[]}
          />
        </Card>
      </Col>
    </Grid>
  );
};

export default Migration;

import { useEffect, useState } from 'react';
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
  Drawer,
} from '@mantine/core';
import StructureSelection from '../components/StructureSelection';
import DataTable from 'react-data-table-component';
import { PaperPlaneIcon } from '@modulz/radix-icons';
import MigrationState from '../components/MigrationState';
import ConnexionForm from '../components/ConnexionForm';
import { useHouseholdStructureMigrated } from '../hooks/useHouseholdStructureMigrated';
import 'react-data-table-component-extensions/dist/index.css';

const Migration = () => {
  const userInfo = localStorage.getItem('userInfo');
  const [connected, setConnected] = useState<boolean>(
    userInfo !== null ? JSON.parse(userInfo).authenticated : false
  );
  const theme = useMantineTheme();
  const [selectedStructures, setSelectedStructures] = useState<
    TransferListItem[]
  >([]);
  const [opened, setOpened] = useState<boolean>(false);
  const [startedMigration, setStartedMigration] = useState(false);
  const [migrationReady, setMigrationReady] = useState(false);
  const [structureSelected, setStructureSelected] = useState(false);

  const toggleStartMigration = () => {
    setStartedMigration(!startedMigration);
  };

  const { migratedStructures, refetch } =
    useHouseholdStructureMigrated(connected);

  useEffect(() => {
    if (connected) {
      refetch();
    }
  }, [connected, refetch]);

  const handleSelectedStructure = (data: any) => {
    setSelectedStructures(data);
    setStructureSelected(data.length !== 0);
    setStartedMigration(false);
  };

  const handleCancelMigration = () => {
    setSelectedStructures([]);
    setStructureSelected(false);
    setMigrationReady(false);
    setStartedMigration(false);
    refetch();
  };

  return (
    <>
      <Drawer
        opened={opened}
        onClose={() => setOpened(false)}
        title='Connection Nouvelle instance'
        padding='xl'
        size='md'>
        <ConnexionForm setConnected={setConnected} />
      </Drawer>
      <Grid columns={9}>
        <Col span={5}>
          <Card shadow='xs' padding='md'>
            <Group position='apart' style={{ marginBottom: 10 }}>
              <Text
                transform='uppercase'
                color={theme.colors.blue[8]}
                weight={500}>
                {!migrationReady
                  ? 'Sélection des structures'
                  : 'Migration des données'}
              </Text>
              {!connected ? (
                <Button size='xs' onClick={() => setOpened(true)}>
                  Connexion
                </Button>
              ) : (
                <Badge size={'xl'} color={'green'}>
                  Connecté
                </Badge>
              )}
            </Group>
            <Divider my={'md'} />
            {!migrationReady && (
              <>
                <StructureSelection
                  handleSelected={(data) => handleSelectedStructure(data)}
                  migratedStructures={migratedStructures}
                />
                <Button
                  mt={'md'}
                  loading={startedMigration}
                  loaderPosition='right'
                  disabled={!structureSelected}
                  onClick={toggleStartMigration}
                  leftIcon={<PaperPlaneIcon />}>
                  Terminer la sélection
                </Button>
              </>
            )}

            {startedMigration && (
              <MigrationState
                structures={selectedStructures}
                handleCancelMigration={handleCancelMigration}
                handleMigrationReady={setMigrationReady}
                handleStartedMigration={setStartedMigration}
              />
            )}
          </Card>
        </Col>
        <Col span={4}>
          <Card shadow='xs' padding='md'>
            <Group style={{ marginBottom: 10 }}>
              <Text
                transform='uppercase'
                color={theme.colors.blue[8]}
                weight={500}>
                Liste des structures aux données migrées
              </Text>
            </Group>
            <Divider />
            <DataTable
              columns={[
                {
                  name: 'Nom',
                  selector: (d) => (d.name ? d.name : ''),
                },
                {
                  name: 'Nom complet',
                  selector: (d) => (d.description ? d.description : ''),
                },
                {
                  name: 'Code',
                  selector: (d) => (d.postalCode ? d.postalCode : ''),
                },
                {
                  name: 'Plateforme',
                  selector: (d) =>
                    d.parentLocation ? d.parentLocation.display : '',
                },
              ]}
              data={migratedStructures}
            />
          </Card>
        </Col>
      </Grid>
    </>
  );
};

export default Migration;

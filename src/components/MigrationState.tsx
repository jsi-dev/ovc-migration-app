import {
  Card,
  Grid,
  Col,
  Badge,
  TransferListItem,
  Divider,
  Button,
  Group,
  Alert,
  Text,
} from '@mantine/core';
import { useEffect, useState } from 'react';
import DataTable from 'react-data-table-component';

import { TableColumn } from 'react-data-table-component/dist/src/DataTable/types';
import { useMutation } from 'react-query';
import { useTransform } from '../hooks/useTransform';
import {
  HouseholdEvaluation,
  HouseholdGraduation,
  HouseholdMember,
} from '../models/new/Household';
import { ErrorMessage } from '../models/other/utils';
import { EncounterQuery } from '../services/new/encounterQuery';
import { HouseholdQuery } from '../services/new/householdQuery';
import { PatientQuery } from '../services/new/patientQuery';
import MigrationStatus from './MigrationStatus';

export const columns: TableColumn<ErrorMessage>[] = [
  {
    name: 'Structure',
    selector: (d) => (d.structure ? d.structure : ''),
    sortable: true,
    wrap: true,
    cell: (d) => (
      <Text weight={'bold'} size={'xs'}>
        {d.structure}
      </Text>
    ),
  },
  {
    name: 'Ménage / Membre',
    selector: (d) =>
      d.member ? `${d.member}` : d.household ? d.household : '',
    sortable: true,
    cell: (d) => (
      <Text weight={'bold'} color={'blue'} size={'xs'}>
        {d.member ? d.member : d.household ? d.household : ''}
      </Text>
    ),
  },
  {
    name: 'Outil de collecte',
    selector: (d) => (d.tool ? d.tool : ''),
    sortable: true,
    wrap: true,
  },
  {
    name: 'Information collectée',
    selector: (d) => (d.message ? d.message : ''),
    sortable: true,
    wrap: true,
  },
  {
    name: 'Erreur',
    selector: (d) => (d.data ? d.data : ''),
    cell: (d) => (
      <Text weight={'bold'} color={'red'} size={'xs'}>
        {d.data}
      </Text>
    ),
    width: '100px',
  },
];

type MigrationStateProps = {
  structures: TransferListItem[];
  handleMigrationReady: (migrationReady: boolean) => void;
  handleStartedMigration: (startedMigration: boolean) => void;
  handleCancelMigration: () => void;
};

const MigrationState = (props: MigrationStateProps) => {
  const [countHousehold, setCountHousehold] = useState<number>(0);
  // const [countHouseholdMember, setCountHouseholdMember] = useState<number>(0);

  const [finishedAll, setFinishedAll] = useState<boolean>(false);
  const [loadingAll, setLoadingAll] = useState<boolean>(false);
  const [savingHousehold, setSavingHousehold] = useState<boolean>(false);
  const [savedHousehold, setSavedHousehold] = useState<boolean>(false);

  const [savingHouseholdEvaluation, setSavingHouseholdEvaluation] =
    useState<boolean>(false);
  const [savedHouseholdEvaluation, setSavedHouseholdEvaluation] =
    useState<boolean>(false);

  const [savingHouseholdGraduation, setSavingHouseholdGraduation] =
    useState<boolean>(false);
  const [savedHouseholdGraduation, setSavedHouseholdGraduation] =
    useState<boolean>(false);

  const [savingMember, setSavingMember] = useState<boolean>(false);
  const [savedMember, setSavedMember] = useState<boolean>(false);

  const [savingMemberEvaluation, setSavingMemberEvaluation] =
    useState<boolean>(false);
  const [savedMemberEvaluation, setSavedMemberEvaluation] =
    useState<boolean>(false);

  const [savingMemberActivities, setSavingMemberActivities] =
    useState<boolean>(false);
  const [savedMemberActivities, setSavedMemberActivities] =
    useState<boolean>(false);

  const [savingMemberSchoolFollowup, setSavingMemberSchoolFollowup] =
    useState<boolean>(false);
  const [savedMemberSchoolFollowup, setSavedMemberSchoolFollowup] =
    useState<boolean>(false);

  const [savingMemberNutritionalFollowup, setSavingMemberNutritionalFollowup] =
    useState<boolean>(false);
  const [savedMemberNutritionalFollowup, setSavedMemberNutritionalFollowup] =
    useState<boolean>(false);

  const [savingMemberReference, setSavingMemberReference] =
    useState<boolean>(false);
  const [savedMemberReference, setSavedMemberReference] =
    useState<boolean>(false);

  const { structures } = props;

  const {
    isFetching,
    households,
    householdEvaluations,
    householdGraduations,
    members,
    patients,
    persons,
    memberEvaluations,
    identifications,
    memberSupportActivities,
    memberNutritionalFollowups,
    memberSchoolFollowups,
    memberReferences,
    errorMessages,
  } = useTransform(structures);

  // const tableData = {
  //   columns,
  //   data: errorMessages,
  // };

  const { mutate: addOneHousehold, isIdle: waitingHouseholdUp } = useMutation(
    HouseholdQuery.saveHousehold
  );

  const { mutate: addOneEvaluation, isIdle: waitingEvaluationUp } = useMutation(
    async (d: HouseholdEvaluation) => {
      const householdUuid =
        d.uuid?.substring(0, 14) + 'HHHHHHHHHHHHHHHHHHHHHHHH';
      return await HouseholdQuery.saveHouseholdEvaluation(d, householdUuid);
    }
  );

  const { mutate: addOneGraduation, isIdle: waitingGraduationUp } = useMutation(
    async (d: HouseholdGraduation) => {
      const householdUuid =
        d.uuid?.substring(0, 14) + 'HHHHHHHHHHHHHHHHHHHHHHHH';
      return await HouseholdQuery.saveHouseholdGraduation(d, householdUuid);
    }
  );

  const { mutate: addOnePerson } = useMutation(PatientQuery.savePerson);

  const { mutate: addOnePatient } = useMutation(PatientQuery.savePatient);

  const { mutate: addOneIdentification } = useMutation(
    EncounterQuery.saveEncounter
  );

  const { mutate: addOneMember, isIdle: waitingMemberUp } = useMutation(
    async (d: HouseholdMember) => {
      const householdUuid =
        d.uuid?.substring(0, 14) + 'HHHHHHHHHHHHHHHHHHHHHHHH';
      return await HouseholdQuery.saveHouseholdMember(d, householdUuid);
    }
  );

  const { mutate: addOneMemberEvaluation, isIdle: waitingMemberEvaluationUp } =
    useMutation(EncounterQuery.saveEncounter);

  const {
    mutate: addOneMemberSchoolFollowup,
    isIdle: waitingSchoolFollowupUp,
  } = useMutation(EncounterQuery.saveEncounter);

  const {
    mutate: addOneMemberNutritionalFollowup,
    isIdle: waitingNutritionalFollowupUp,
  } = useMutation(EncounterQuery.saveEncounter);

  const { mutate: addOneMemberReference, isIdle: waitingReferenceUp } =
    useMutation(EncounterQuery.saveEncounter);

  const { mutate: addOneMemberActivity, isIdle: waitingActivityUp } =
    useMutation(EncounterQuery.saveEncounter);

  const handleMigrate = async () => {
    setSavingHousehold(true);
    households.forEach((household) => {
      // setCountHousehold(() => Math.floor((count * 100) / households.length));
      setCountHousehold((c) => c + 1);
      addOneHousehold(household, {
        onSuccess: () => {
          setSavingHousehold(false);
          setSavedHousehold(true);

          if (householdEvaluations.length > 0) {
            setSavingHouseholdEvaluation(true);
            householdEvaluations.forEach((evaluation) => {
              addOneEvaluation(evaluation, {
                onSuccess: () => {
                  setSavingHouseholdEvaluation(false);
                  setSavedHouseholdEvaluation(true);
                },
              });
            });
          }
          if (householdGraduations.length > 0) {
            setSavingHouseholdGraduation(true);
            householdGraduations.forEach((graduation) => {
              addOneGraduation(graduation, {
                onSuccess: () => {
                  setSavingHouseholdGraduation(false);
                  setSavedHouseholdGraduation(true);
                },
              });
            });
          }

          setSavingMember(true);
          persons.forEach((person) => {
            addOnePerson(person, {
              onSuccess: () => {
                patients.forEach((patient) => {
                  addOnePatient(patient, {
                    onSuccess: () => {
                      members.forEach((member) => {
                        addOneMember(member, {
                          onSuccess: () => {
                            // setSavedMember(true);
                            identifications.forEach((identification) => {
                              // setSavingMemberIdentification(true);
                              addOneIdentification(identification, {
                                onSuccess: () => {
                                  setSavingMember(false);
                                  setSavedMember(true);
                                  // setSavingMemberIdentification(false);
                                  // setSavedMemberIdentification(true);

                                  if (memberEvaluations.length > 0) {
                                    setSavingMemberEvaluation(true);
                                    memberEvaluations.forEach(
                                      (memberEvaluation) => {
                                        addOneMemberEvaluation(
                                          memberEvaluation,
                                          {
                                            onSuccess: () => {
                                              setSavingMemberEvaluation(false);
                                              setSavedMemberEvaluation(true);
                                            },
                                          }
                                        );
                                      }
                                    );
                                  }
                                  if (memberSupportActivities.length > 0) {
                                    setSavingMemberActivities(true);
                                    memberSupportActivities.forEach(
                                      (activity) => {
                                        addOneMemberActivity(activity, {
                                          onSuccess: () => {
                                            setSavingMemberActivities(false);
                                            setSavedMemberActivities(true);
                                          },
                                        });
                                      }
                                    );
                                  }
                                  if (memberNutritionalFollowups.length > 0) {
                                    setSavingMemberNutritionalFollowup(true);
                                    memberNutritionalFollowups.forEach(
                                      (followup) => {
                                        addOneMemberNutritionalFollowup(
                                          followup,
                                          {
                                            onSuccess: () => {
                                              setSavingMemberNutritionalFollowup(
                                                false
                                              );
                                              setSavedMemberNutritionalFollowup(
                                                true
                                              );
                                            },
                                          }
                                        );
                                      }
                                    );
                                  }

                                  if (memberSchoolFollowups.length > 0) {
                                    setSavingMemberSchoolFollowup(true);
                                    memberSchoolFollowups.forEach(
                                      (followup) => {
                                        addOneMemberSchoolFollowup(followup, {
                                          onSuccess: () => {
                                            setSavingMemberSchoolFollowup(
                                              false
                                            );
                                            setSavedMemberSchoolFollowup(true);
                                          },
                                        });
                                      }
                                    );
                                  }

                                  if (memberReferences.length > 0) {
                                    setSavingMemberReference(true);
                                    memberReferences.forEach((reference) => {
                                      addOneMemberReference(reference, {
                                        onSuccess: () => {
                                          setSavingMemberReference(false);
                                          setSavedMemberReference(true);
                                        },
                                      });
                                    });
                                  }
                                },
                              });
                            });
                          },
                        });
                      });
                    },
                  });
                });
              },
            });
          });
        },
      });
    });
  };

  useEffect(() => {
    props.handleMigrationReady(true);
    setLoadingAll(
      () =>
        savingMemberEvaluation ||
        savingMemberActivities ||
        savingHouseholdEvaluation ||
        savingMember ||
        savingMemberEvaluation ||
        savingHouseholdGraduation ||
        savingMemberSchoolFollowup ||
        savingMemberNutritionalFollowup ||
        savingMemberReference
    );
    setFinishedAll((c) => {
      return (
        c ||
        (savedHousehold &&
          (householdEvaluations.length === 0 || savedHouseholdEvaluation) &&
          (householdGraduations.length === 0 || savedHouseholdGraduation) &&
          savedMember &&
          (memberEvaluations.length === 0 || savedMemberEvaluation) &&
          (memberSupportActivities.length === 0 || savedMemberActivities) &&
          (memberSchoolFollowups.length === 0 || savedMemberSchoolFollowup) &&
          (memberReferences.length === 0 || savedMemberReference) &&
          (memberNutritionalFollowups.length === 0 ||
            savedMemberNutritionalFollowup))
      );
    });
  }, [
    householdEvaluations.length,
    householdGraduations.length,
    isFetching,
    memberEvaluations.length,
    memberNutritionalFollowups.length,
    memberReferences.length,
    memberSchoolFollowups.length,
    memberSupportActivities.length,
    props,
    savedHousehold,
    savedHouseholdEvaluation,
    savedHouseholdGraduation,
    savedMember,
    savedMemberActivities,
    savedMemberEvaluation,
    savedMemberNutritionalFollowup,
    savedMemberReference,
    savedMemberSchoolFollowup,
    savingHouseholdEvaluation,
    savingHouseholdGraduation,
    savingMember,
    savingMemberActivities,
    savingMemberEvaluation,
    savingMemberNutritionalFollowup,
    savingMemberReference,
    savingMemberSchoolFollowup,
  ]);

  if (isFetching) {
    return <Alert>Préparation des données...</Alert>;
  }
  return (
    <Card shadow='xs' padding='md' color={'gray'}>
      <Group>
        {structures.map((s) => (
          <Badge key={s.description}>{s.label}</Badge>
        ))}
      </Group>

      {errorMessages.length > 0 && (
        <>
          <Divider my={'md'} />
          <DataTable
            columns={columns}
            data={errorMessages}
            pagination
            noHeader
          />
          {/* <DataTableExtensions {...tableData}>
          </DataTableExtensions> */}
        </>
      )}
      {errorMessages.length === 0 && (
        <>
          <Divider my={'xs'} />
          <Grid columns={1}>
            <Col span={1}>
              <MigrationStatus
                title={'Ménages'}
                total={households.length}
                finished={savedHousehold}
                loading={savingHousehold}
                waiting={waitingHouseholdUp}
                current={countHousehold}
              />
            </Col>
            <Col span={1}>
              <MigrationStatus
                title={'Evaluation des ménages'}
                total={householdEvaluations.length}
                finished={savedHouseholdEvaluation}
                loading={savingHouseholdEvaluation}
                waiting={waitingEvaluationUp}
              />
            </Col>
            <Col span={1}>
              <MigrationStatus
                title={'Graduations des ménages'}
                total={householdGraduations.length}
                finished={savedHouseholdGraduation}
                loading={savingHouseholdGraduation}
                waiting={waitingGraduationUp}
              />
            </Col>
            <Col span={1}>
              <MigrationStatus
                title={'Membres des ménages'}
                total={members.length}
                finished={savedMember}
                loading={savingMember}
                waiting={waitingMemberUp}
              />
            </Col>
            <Col span={1}>
              <MigrationStatus
                title={'Evaluations des membres des ménages'}
                total={memberEvaluations.length}
                finished={savedMemberEvaluation}
                loading={savingMemberEvaluation}
                waiting={waitingMemberEvaluationUp}
              />
            </Col>
            <Col span={1}>
              <MigrationStatus
                title={'Activités de soutien des membres des ménages'}
                total={memberSupportActivities.length}
                finished={savedMemberActivities}
                loading={savingMemberActivities}
                waiting={waitingActivityUp}
              />
            </Col>
            <Col span={1}>
              <MigrationStatus
                title={'Suivis scolaires des membres des ménages'}
                total={memberSchoolFollowups.length}
                finished={savedMemberSchoolFollowup}
                loading={savingMemberSchoolFollowup}
                waiting={waitingSchoolFollowupUp}
              />
            </Col>
            <Col span={1}>
              <MigrationStatus
                title={'Suivis nutritionnels des membres des ménages'}
                total={memberNutritionalFollowups.length}
                finished={savedMemberNutritionalFollowup}
                loading={savingMemberNutritionalFollowup}
                waiting={waitingNutritionalFollowupUp}
              />
            </Col>
            <Col span={1}>
              <MigrationStatus
                title={'Références des membres des ménages'}
                total={memberReferences.length}
                finished={savedMemberReference}
                loading={savingMemberReference}
                waiting={waitingReferenceUp}
              />
            </Col>
          </Grid>{' '}
        </>
      )}

      <>
        <Divider my={'md'} />
        <Group>
          {finishedAll && (
            <Button onClick={props.handleCancelMigration}>Retour</Button>
          )}
          {!finishedAll && (
            <>
              {errorMessages.length === 0 && (
                <Button onClick={handleMigrate} loading={loadingAll}>
                  Migrer les données
                </Button>
              )}
              <Button
                onClick={props.handleCancelMigration}
                disabled={loadingAll}>
                Annuler
              </Button>
            </>
          )}
        </Group>
      </>
    </Card>
  );
};

export default MigrationState;

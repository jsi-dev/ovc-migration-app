import React from "react";
import {
  Card,
  Grid,
  Col,
  Text,
  Progress,
  Badge,
  TransferListItem,
  Loader,
} from "@mantine/core";
import { useTransform } from "../hooks/useTransform";
// import { useTransformHousehold } from "../hooks/transform";

// POST http://localhost:8000/structure

type MigrationStateProps = {
  structures: TransferListItem[];
  migrationReady: boolean;
};

const MigrationState = (props: MigrationStateProps) => {
  // const { household, patients, members } = useTransformHousehold({});
  const { structures } = props;
  const {
    households,
    householdEvaluations,
    encounters,
    members,
    patients,
    persons,
    householdGraduations
  } = useTransform(structures);

  // console.log("households transformed", households);
  // console.log("householdEvaluations transformed", householdEvaluations);
  // console.log("members transformed", members);
  // console.log("patients transformed", patients);
  // console.log("persons transformed", persons);
  // console.log("encounters transformed", encounters);
  // console.log("encounters transformed", encounters);

  // const {} = useTransform(structures.reduce((ids: number[], structure) => {
  //   ids.push(structure.label);
  //   return ids;
  // }))
  return (
    <Card shadow="xs" padding="md" color={"gray"}>
      <Grid columns={10}>
        {/* <Col span={4}>Migration en cours des données de : </Col>
        <Col span={5}>
          <Text weight={700} color={"cyan"} transform={"uppercase"}>
            Centre social abobo
          </Text>
        </Col>
        <Col span={1}>
          <Badge>1/{props.structures.length}</Badge>
        </Col> */}
        <Col span={4}>
          <Text size="sm">Ménages</Text>
        </Col>
        <Col span={5}>
          <Progress color="cyan" size={20} value={0} />
        </Col>
        <Col span={1}>
          <Badge>{households.length}</Badge>
        </Col>
        <Col span={4}>
          <Text size="sm">Evaluations des ménages</Text>
        </Col>
        <Col span={5}>
          <Progress color="cyan" size={20} value={0} />
        </Col>
        <Col span={1}>
          <Badge>{householdEvaluations.length}</Badge>
        </Col>
        <Col span={4}>
          <Text size="sm">Graduations des ménages</Text>
        </Col>
        <Col span={5}>
          <Progress color="cyan" size={20} value={0} />
        </Col>
        <Col span={1}>
          <Badge>{householdEvaluations.length}</Badge>
        </Col>
        <Col span={4}>
          <Text size="sm">Membres des ménages</Text>
        </Col>
        <Col span={5}>
          <Progress
            size={20}
            sections={[
              { value: 0, color: "pink", label: "0%" },
              { value: 0, color: "grape", label: "0%" },
              { value: 0, color: "violet", label: "0%" },
            ]}
          />
        </Col>
        <Col span={1}>
          <Badge>{members.length}</Badge>
        </Col>
        <Col span={4}>
          <Text size="sm">Activités des membres</Text>
        </Col>
        <Col span={5}>
          <Progress color="lime" size={20} value={0} />
        </Col>
        <Col span={1}>
          <Badge>{encounters.length}</Badge>
        </Col>
      </Grid>
      {/* <Text>{JSON.stringify(household)}</Text> */}
    </Card>
  );
};

export default MigrationState;

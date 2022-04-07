import { Badge, Col, Grid, Loader, Progress, Text } from '@mantine/core';
import { useEffect, useState } from 'react';

type MigrationStatusProps = {
  title: string;
  total: number;
  finished?: boolean;
  loading?: boolean;
  waiting?: boolean;
  current?: number;
  children?: JSX.Element | JSX.Element[];
};

const MigrationStatus = (props: MigrationStatusProps) => {
  const { title, total, children, loading, finished, waiting, current } = props;
  const [count, setCount] = useState<number>();

  useEffect(() => {
    // console.log(
    //   title,
    //   'loading',
    //   loading,
    //   'finished',
    //   finished,
    //   'waiting',
    //   waiting
    // );
    if (current) {
      setCount(Math.floor((current * 100) / total));
    }
    setCount(count);
  }, [loading, finished, waiting, title, count, current, total]);

  return (
    <Grid columns={10} my={0} style={{ paddingBottom: 0, margin: 0 }}>
      <Col span={5} style={{ paddingBottom: 0 }}>
        <Text size='sm'>{title}</Text>
      </Col>
      <Col span={4} style={{ paddingBottom: 0 }}>
        {!children ? (
          total === 0 ? (
            <Badge color='red'>Aucun enregistrement</Badge>
          ) : waiting ? (
            <>
              <Badge color={'yellow'}>Pas encore transféré</Badge>
              {current ? (
                <Progress
                  color='lime'
                  size={20}
                  value={count}
                  label={count + '%'}
                />
              ) : null}
            </>
          ) : loading ? (
            <Loader variant='dots' size='sm' color='orange' />
          ) : finished ? (
            <Badge color={'green'}>Terminé</Badge>
          ) : null
        ) : null}
        {/*  */}
        {children}
      </Col>
      <Col span={1} style={{ paddingBottom: 0 }}>
        <Badge>{total}</Badge>
      </Col>
    </Grid>
  );
};

export default MigrationStatus;

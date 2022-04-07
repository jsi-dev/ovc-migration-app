import { Button, Divider, PasswordInput, TextInput } from '@mantine/core';
import { useForm } from '@mantine/hooks';
import { useEffect, useState } from 'react';
import { useQuery } from 'react-query';
import { SessionQuery } from '../services/new/sessionQuery';

type ConnexionFormProps = {
  setConnected: (value: boolean) => void;
};

const ConnexionForm = (props: ConnexionFormProps) => {
  const { setConnected } = props;
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const { data, refetch, isFetching } = useQuery(
    ['session'],
    async () => await SessionQuery.login(username, password),
    { enabled: false }
  );

  useEffect(() => {
    if (data) {
      if (data && data.authenticated) {
        console.log('connecté');
        setConnected(true);
        localStorage.setItem('auth', window.btoa(username + ':' + password));
        localStorage.setItem('userInfo', JSON.stringify(data));
      } else {
        setConnected(false);
      }
    }
  }, [data, password, setConnected, username]);

  // const session: any = data ? data : undefined;
  const form = useForm({
    initialValues: {
      // url: '',
      username: '',
      password: '',
    },

    validationRules: {
      username: (value) => value.length !== null,
      password: (value) => value.length !== null,
    },
  });

  const handleConnect = (values: any) => {
    console.log(values);
    setUsername(values.username);
    setPassword(values.password);
    refetch();
    if (!isFetching) {
      if (data && data.authenticated) {
        console.log('connecté');

        localStorage.setItem('auth', window.btoa(username + ':' + password));
        localStorage.setItem('userInfo', data);
      }
    }
  };
  return (
    <form onSubmit={form.onSubmit((values) => handleConnect(values))}>
      {/* <TextInput
        required
        label='Url'
        placeholder='url nouvelle instance'
        {...form.getInputProps('url')}
      /> */}
      <TextInput
        required
        label="Nom d'utilisateur"
        placeholder='utilisateur nouvelle instance'
        {...form.getInputProps('username')}
      />
      <PasswordInput
        required
        label='Mot de passe'
        placeholder='mot de passe'
        {...form.getInputProps('password')}
      />

      <Divider my={'xs'} />

      <Button
        type='submit'
        loading={isFetching}
        loaderPosition='right'
        disabled={isFetching}>
        Soumettre
      </Button>
    </form>
  );
};

export default ConnexionForm;

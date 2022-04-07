import axios from 'axios';

const login = async (username: string, password: string) => {
  const api = axios.create({
    baseURL: `/openmrs/ws/rest/v1`,
    headers: {
      'Content-type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      Authorization: 'Basic ' + window.btoa(username + ':' + password),
    },
  });

  const response = await api.get<any>(`/session`);
  return response.data;
};

export const SessionQuery = {
  login: login,
};

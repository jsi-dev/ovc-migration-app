import axios from 'axios';

const {
  REACT_APP_API_HOSTNAME,
  REACT_APP_OPENMRS_HOSTNAME,
  // REACT_APP_OPENMRS_USERNAME,
  // REACT_APP_OPENMRS_PASSWORD,
} = process.env;

// console.log(process.env);
// console.log(window['env']);

export const apiClient = axios.create({
  baseURL: REACT_APP_API_HOSTNAME,
  headers: {
    'Content-type': 'application/json',
    'Access-Control-Allow-Origin': '*',
  },
});

// const auth = btoa(
//   `${REACT_APP_OPENMRS_USERNAME}:${REACT_APP_OPENMRS_PASSWORD}`
// );

// console.log(auth);

export const api = axios.create({
  baseURL: REACT_APP_OPENMRS_HOSTNAME,
  headers: {
    'Content-type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    Authorization: 'Basic ' + localStorage.getItem('auth'),
  },
});

export const apiDreams = axios.create({
  baseURL: '/api',
  // baseURL: 'http://176.58.123.164:8081/dreams',
  headers: {
    'Content-type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    // Authorization: 'Basic YWRtaW46YWRtaW4xMjM=',
  },
  // auth: {
  //   username: 'admin',
  //   password: 'admin123',
  // },
  proxy: {
    protocol: 'http',
    host: '176.58.123.164',
    port: 8081,
    auth: {
      username: 'admin',
      password: 'admin123',
    },
  },
});

// Authorization: 'Basic ' + sessionStorage.getItem('auth'),

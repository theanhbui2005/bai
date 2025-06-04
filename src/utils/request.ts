import axios from 'axios';

const request = axios.create({
  baseURL: 'https://api.example.com',
  timeout: 1000,
});

export default request;

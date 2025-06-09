export const API_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:3000'
  : 'http://172.16.0.2:8000/api';
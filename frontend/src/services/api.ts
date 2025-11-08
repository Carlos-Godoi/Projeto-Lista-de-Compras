import axios from 'axios';

// A URL base da nossa API de backend (Node.js), que está rodando nativamente
// Lembre-se que ela está na porta 3000, conforme o seu .env
const api = axios.create({
  baseURL: 'http://localhost:3000/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
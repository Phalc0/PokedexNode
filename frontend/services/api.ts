import axios from "axios";
import { Pkmn } from "../types/pkmn";
import { User } from "../types/user";
import { Trainer } from "../types/trainer";


// all API call here 



// Axios instance
const api = axios.create({
  baseURL: "http://localhost:3000/api", // Backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Token protected request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Pokemon
export const getAllPkmn = async (): Promise<Pkmn[]> => {
  const response = await api.get('/pkmn');
  return response.data;
};

export const getPkmnById = async (id: string): Promise<Pkmn> => {
  const response = await api.get(`/pkmn/${id}`);
  return response.data;
};

export const createPkmn = async (pkmnData: Omit<Pkmn, '_id'>): Promise<Pkmn> => {
  const response = await api.post('/pkmn', pkmnData);
  return response.data;
};

export const updatePkmn = async (id: string, pkmnData: Partial<Pkmn>): Promise<Pkmn> => {
  const response = await api.put(`/pkmn/${id}`, pkmnData);
  return response.data;
};

export const deletePkmn = async (id: string): Promise<void> => {
  await api.delete(`/pkmn/${id}`);
};

export const addRegion = async (pkmnId: string, regionName: string, regionPokedexNumber: string): Promise<Pkmn> => {
  const response = await api.post('/pkmn/region', { pkmnId, regionName, regionPokedexNumber });
  return response.data;
};

export const deleteRegion = async (pkmnId: string, regionName: string): Promise<void> => {
  await api.delete(`/pkmn/region?pkmnID=${pkmnId}&regionName=${regionName}`);
};

export const searchPkmn = async (query: any): Promise<Pkmn[]> => {
  const response = await api.get('/pkmn/search', { params: query });
  return response.data;
};


// trainer 

export const createTrainer = async (trainerData: Omit<Trainer, '_id'>): Promise<Trainer> => {
  const response = await api.post('/trainers', trainerData);
  return response.data;
};

export const getTrainerById = async (): Promise<Trainer> => {
  const response = await api.get('/trainers');
  return response.data;
};

export const updateTrainer = async (trainerData: Partial<Trainer>): Promise<Trainer> => {
  const response = await api.put('/trainers', trainerData);
  return response.data;
};

export const deleteTrainer = async (): Promise<void> => {
  await api.delete('/trainers');
};

export const markPkmn = async (pkmnId: string, isCaught: boolean): Promise<Trainer> => {
  const response = await api.post('/trainers/markPkmn', { pkmnId, isCaught });
  return response.data;
};

// user

export const register = async (userData: { username: string; email: string; password: string }): Promise<{ message: string; userId: string }> => {
  const response = await api.post('/users/register', userData);
  return response.data;
};

export const login = async (credentials: { email: string; password: string }): Promise<{ token: string }> => {
  const response = await api.post('/users/login', credentials);
  return response.data;
};

export const checkToken = async (): Promise<void> => {
  await api.get('/users/checkUser');
};

// pkmn types

export const getAllTypes = async () => {
  const response = await api.get('/pkmn/types');
  return response.data.data;
};


export default api;



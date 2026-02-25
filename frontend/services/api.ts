import axios from "axios";
import { Pkmn } from "../types/pkmn";
import { User } from "../types/user";


// Axios instance
const api = axios.create({
  baseURL: "http://localhost:3000/api", // Backend URL
  headers: {
    "Content-Type": "application/json",
  },
});

// Pokemon

// users


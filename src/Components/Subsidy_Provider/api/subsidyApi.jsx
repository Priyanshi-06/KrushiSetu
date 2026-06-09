import axios from "axios";
import { BACKEND_BASE_URL } from "../../../config/apiBase";

const api = axios.create({
  baseURL: `${BACKEND_BASE_URL}/subsidies`,
  withCredentials: true, 
});


// Fetch Subsidy Provider's subsidies
export const getMySubsidies = async () => {
  const res = await api.get("/my_subsidies/");
  return res.data;
};

// Create a new subsidy 
export const createSubsidy = async (data) => {
  const res = await api.post("/", data);
  return res.data;
};

//  Update a subsidy
export const updateSubsidy = async (id, data) => {
  const res = await api.put(`/${id}/`, data);
  return res.data;
};

//  Delete a subsidy
export const deleteSubsidy = async (id) => {
  await api.delete(`/${id}/`);
};

// Get all subsidies (public/admin endpoint)
export const getAllSubsidies = async () => {
  const res = await api.get("/");
  return res.data;
};

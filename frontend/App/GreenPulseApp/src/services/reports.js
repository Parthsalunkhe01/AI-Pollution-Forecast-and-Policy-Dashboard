import axios from "axios";
import { API_BASE } from "./api";

function authHeaders(token) {
  return {
    Authorization: `Bearer ${token}`,
    "Content-Type": "application/json",
  };
}

export async function apiFetchReports(token) {
  const res = await axios.get(`${API_BASE}/reports`, {
    headers: authHeaders(token),
  });
  return res.data;
}

export async function apiCreateReport(data, token) {
  const res = await axios.post(`${API_BASE}/reports`, data, {
    headers: authHeaders(token),
  });
  return res.data;
}

export async function apiDeleteReport(id, token) {
  const res = await axios.delete(`${API_BASE}/reports/${id}`, {
    headers: authHeaders(token),
  });
  return res.data;
}

export async function apiFetchReportById(id, token) {
  const res = await axios.get(`${API_BASE}/reports/${id}`, {
    headers: authHeaders(token),
  });
  return res.data;
}

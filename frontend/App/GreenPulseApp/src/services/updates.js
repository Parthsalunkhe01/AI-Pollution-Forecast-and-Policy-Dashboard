import axios from "axios";
import { API_BASE } from "./api";

export async function fetchLocalUpdates() {
  try {
    const res = await axios.get(`${API_BASE}/updates`);
    return res.data.updates ?? [];
  } catch (err) {
    console.log("Local update fetch error:", err.message);
    return [];
  }
}

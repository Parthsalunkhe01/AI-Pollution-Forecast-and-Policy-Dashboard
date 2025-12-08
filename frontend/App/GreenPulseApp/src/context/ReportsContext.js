import React, { createContext, useCallback, useContext, useState } from "react";
import { apiFetchReports, apiCreateReport, apiDeleteReport } from "../services/reports";
import { AuthContext } from "./AuthContext";

export const ReportsContext = createContext();

export function ReportsProvider({ children }) {
  const { token } = useContext(AuthContext);

  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function normalize(report) {
    return {
      id: report.id,
      title: report.title,
      description: report.description,
      createdAt: report.createdAt,
      status: report.status || "pending",
      location: report.city || "",
      imageUri: report.imageUrl || null,  // backend field
      comments: report.comments || [],
      likes: report.likes || [],
      userName: report.user?.displayName ?? "User",
    };
  }

  const loadReports = useCallback(async () => {
    if (!token) return;

    setLoading(true);
    try {
      const data = await apiFetchReports(token);
      setReports(data.map(normalize));
    } catch (err) {
      console.log("LOAD REPORT ERR:", err.message);
      setError("Failed to load reports");
    } finally {
      setLoading(false);
    }
  }, [token]);

  const addReport = useCallback(
    async ({ title, description, location, image }) => {
      const created = await apiCreateReport(
        {
          title,
          description,
          city: location || null,
          imageBase64: null // no upload yet
        },
        token
      );

      setReports((prev) => [normalize(created), ...prev]);
    },
    [token]
  );

  const deleteReportFn = useCallback(
    async (id) => {
      await apiDeleteReport(id, token);
      setReports((prev) => prev.filter((r) => r.id !== id));
    },
    [token]
  );

  const getReportById = (id) => reports.find((r) => r.id === id);

  return (
    <ReportsContext.Provider
      value={{
        reports,
        loading,
        error,
        loadReports,
        addReport,
        deleteReport: deleteReportFn,
        getReportById,
      }}
    >
      {children}
    </ReportsContext.Provider>
  );
}
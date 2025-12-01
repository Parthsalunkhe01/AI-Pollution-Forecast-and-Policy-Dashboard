// src/context/ReportsContext.js
import { createContext, useState } from 'react';

export const ReportsContext = createContext();

export function ReportsProvider({ children }) {
  const [reports, setReports] = useState([]); // in-memory array of report objects

  function addReport(report) {
    // report: { title, description, location, imageUri, userId }
    const newReport = {
      ...report,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
      status: 'pending'
    };
    setReports(prev => [newReport, ...prev]);
    return newReport.id;
  }

  function verifyReport(id) {
    setReports(prev => prev.map(r => (r.id === id ? { ...r, status: 'verified' } : r)));
  }

  function deleteReport(id) {
    setReports(prev => prev.filter(r => r.id !== id));
  }

  function getReportById(id) {
    return reports.find(r => r.id === id);
  }

  return (
    <ReportsContext.Provider value={{ reports, addReport, verifyReport, deleteReport, getReportById }}>
      {children}
    </ReportsContext.Provider>
  );
}

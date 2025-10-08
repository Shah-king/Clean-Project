import { BACKEND_URL } from "../constants";

export const acceptReport = async (reportId, userData, fetchReports) => {
  try {
    await fetch(`${BACKEND_URL}/update/report/${reportId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        handler_id: userData.uid,
        handler_name: userData.name,
        status: "in progress",
      }),
    });
    await fetchReports(new AbortController());
  } catch (err) {
    console.error("Failed to accept report:", err);
  }
};

export const completeReport = async (reportId, fetchReports) => {
  try {
    await fetch(`${BACKEND_URL}/update/report/${reportId}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "completed" }),
    });
    await fetchReports(new AbortController());
  } catch (err) {
    console.error("Failed to complete report:", err);
  }
};

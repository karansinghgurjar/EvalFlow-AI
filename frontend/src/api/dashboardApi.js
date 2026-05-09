import api from "./client";

export async function getAdminDashboard() {
  const response = await api.get("/dashboard/admin");
  return response.data;
}

export async function getAnnotatorDashboard() {
  const response = await api.get("/dashboard/annotator");
  return response.data;
}

export async function getReviewerDashboard() {
  const response = await api.get("/dashboard/reviewer");
  return response.data;
}

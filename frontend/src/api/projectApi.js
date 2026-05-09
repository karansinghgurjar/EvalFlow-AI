import api from "./client";

export async function getProjects(params = {}) {
  const response = await api.get("/projects", { params });
  return response.data;
}

export async function getProjectById(projectId) {
  const response = await api.get(`/projects/${projectId}`);
  return response.data;
}

export async function createProject(payload) {
  const response = await api.post("/projects", payload);
  return response.data;
}

export async function updateProject(projectId, payload) {
  const response = await api.patch(`/projects/${projectId}`, payload);
  return response.data;
}

export async function archiveProject(projectId) {
  const response = await api.delete(`/projects/${projectId}`);
  return response.data;
}

import api from "./client";

export async function getUsers(params = {}) {
  const response = await api.get("/users", { params });
  return response.data;
}

export async function getUserById(userId) {
  const response = await api.get(`/users/${userId}`);
  return response.data;
}

export async function updateUserRole(userId, payload) {
  const response = await api.patch(`/users/${userId}/role`, payload);
  return response.data;
}

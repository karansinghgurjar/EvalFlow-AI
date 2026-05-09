import api from "./client";

export async function getEvaluations(params = {}) {
  const response = await api.get("/evaluations", { params });
  return response.data;
}

export async function getEvaluationById(evaluationId) {
  const response = await api.get(`/evaluations/${evaluationId}`);
  return response.data;
}

export async function createEvaluation(payload) {
  const response = await api.post("/evaluations", payload);
  return response.data;
}

export async function updateEvaluation(evaluationId, payload) {
  const response = await api.patch(`/evaluations/${evaluationId}`, payload);
  return response.data;
}

export async function reviewEvaluation(evaluationId, payload) {
  const response = await api.patch(
    `/evaluations/${evaluationId}/review`,
    payload
  );
  return response.data;
}

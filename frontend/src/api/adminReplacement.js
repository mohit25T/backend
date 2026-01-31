import api from "./axios";

export const replaceAdmin = (oldAdminId, payload) => {
  return api.post(`/admin/replace/${oldAdminId}`, payload);
};

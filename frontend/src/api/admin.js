import api from "./axios";

export const updateAdminDetails = (adminId, payload) => {
  return api.put(`/admin/${adminId}`, payload);
};

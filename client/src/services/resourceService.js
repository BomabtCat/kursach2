import api from "./api";

export const resourceService = (resource) => ({
  list: (params) => api.get(`/${resource}`, { params }).then((res) => res.data.data),
  get: (id) => api.get(`/${resource}/${id}`).then((res) => res.data.data),
  create: (data) => api.post(`/${resource}`, data).then((res) => res.data.data),
  update: (id, data) => api.put(`/${resource}/${id}`, data).then((res) => res.data.data),
  remove: (id) => api.delete(`/${resource}/${id}`).then((res) => res.data.data)
});

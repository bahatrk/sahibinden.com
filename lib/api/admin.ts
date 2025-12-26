import { api } from "./gateway";


export const fetchAllUsers = async () => {
  const res = await api.get("/admin/users");
  return res.data;
};

export const deleteUserAsAdmin = async (userId: number) => {
  const res = await api.delete(`/admin/users/${userId}`);
  return res.data;
};

export const fetchAllListingsAdmin = async () => {
  const res = await api.get("/admin/listings");
  return res.data;
};
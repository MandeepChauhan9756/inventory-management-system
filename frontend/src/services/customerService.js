import API from "../api/api";

export const getCustomers = async () => {
    const res = await API.get("/customers");
    return res.data;
};

export const createCustomer = async (data) => {
    const res = await API.post("/customers", data);
    return res.data;
};

export const deleteCustomer = async (id) => {
    const res = await API.delete(`/customers/${id}`);
    return res.data;
};

export const updateCustomer = async (id, data) => {
    const res = await API.put(`/customers/${id}`, data);
    return res.data;
};
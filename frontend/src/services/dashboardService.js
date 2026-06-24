import API from "../api/api";

export const getProducts = async () => {
    const response = await API.get("/products");
    return response.data;
};

export const getCustomers = async () => {
    const response = await API.get("/customers");
    return response.data
};


export const getOrders = async () => {
    const response = await API.get("/orders");
    return response.data
};

export const getDashboardStats = async () => {
    const res = await API.get("/dashboard/stats");
    return res.data;
};
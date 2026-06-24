import API from "../api/api";

// GET all products for selection
export const getProducts = async () => {
    const res = await API.get("/products");
    return res.data;
};

// GET all customers
export const getCustomers = async () => {
    const res = await API.get("/customers");
    return res.data;
};

// Create order
export const createOrder = async () => {
    const res = await API.post("/orders", data);
    return res.data;
};

// GET orders
export const getOrders = async () => {
    const res = await API.get("/orders");
    return res.data;
}

// DELETE orders
export const deleteOrder = async (id) => {
    const res = await API.delete(`/orders/${id}`);
    return res.data
}

export const getOrder = async (id) => {
    const res = await API.get(`/orders/${id}`);
    return res.data;
};
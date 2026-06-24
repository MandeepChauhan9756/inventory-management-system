import { data } from "react-router-dom";
import API from "../api/api";

export const getProducts = async () => {
    const response = await API.get("/products");
    return response.data;
};

export const createProduct = async (data) => {
    console.log(data);
    const response = await API.post("/products", data)
    return response.data;
};

export const updateProduct = async (id, data) => {
    const response = await API.put(`/products/${id}`, data);
    return response.data;
};

export const deleteProduct = async (id) => {
    const response = await API.delete(`/products/${id}`);
    return response.data;
};
import axios from "axios";

const API_URL = "http://localhost:8000/api"; // Adjust this if needed

export const fetchCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/categories/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    return [];
  }
};

export const fetchSubCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/subcategories/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching subcategories:", error);
    return [];
  }
};

export const fetchProducts = async () => {
  try {
    const response = await axios.get(`${API_URL}/products/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching products:", error);
    return [];
  }
};
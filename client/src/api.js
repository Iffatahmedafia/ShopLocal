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

export const addFavourites = async () => {
  try {
    const response = await axios.post(`${API_URL}/products/`);
    const result = await response.json();
      console.log(result)
  } catch (error) {
    console.error("Error adding addtoFavourites:", error);
    return [];
  }
};
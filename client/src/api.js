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

export const fetchSubSubCategories = async () => {
  try {
    const response = await axios.get(`${API_URL}/sub_subsubcategories/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching subsubcategories:", error);
    return [];
  }
};

export const fetchBrands = async () => {
  try {
    const response = await axios.get(`${API_URL}/brands/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching brands:", error);
    return [];
  }
};

export const fetchUsers = async () => {
  try {
    const response = await axios.get(`${API_URL}/users/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching users:", error);
    return [];
  }
};

export const fetchUserData = async () => {
  try {
    const response = await axios.get(`${API_URL}/profile/`, { withCredentials: true });
    console.log("User Data:",response.data)
    return response.data;
  } catch (error) {
    console.error("Failed to load user data");
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

export const fetchFavorites = async () => {
  try {
    const response = await axios.get(`${API_URL}/favorites/`, {
      withCredentials: true, // Correct way to send user ID
       
      });
      return response.data.favorites

  } catch (error) {
    console.error("Error fetching favorites:", error);
    return [];
  }
};

export const fetchSavedBrands = async () => {
  try {
    const response = await axios.get(`${API_URL}/saved_brands/`, {
      withCredentials: true, // Correct way to send user ID
       
      });
      return response.data.saved_brands

  } catch (error) {
    console.error("Error fetching Saved Brands:", error);
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

export const updateBrandStatus = async (brandId, status) => {
  try {
    const response = await axios.put(`${API_URL}/brands/${brandId}/status/`, { status },
      {withCredentials: true}
    );
    return response
  } catch (error) {
    console.error("Error updating brand status:", error);
    throw error;
  }
};
export const updateProductStatus = async (productId, status) => {
  try {
    const response = await axios.put(`${API_URL}/products/${productId}/status/`, { status },
      {withCredentials: true}
    );
    return response
  } catch (error) {
    console.error("Error updating brand status:", error);
    throw error;
  }
};

export const updateBrand = async (brandId, formData) => {
  try {
    const response = await axios.patch(`${API_URL}/brands/update/${brandId}/`,
      {
        about: formData.about,
        phone: formData.phone,
        province: formData.province,
        category: formData.category,
        website_link: formData.onlineStore,
        store_address: formData.offlineStore,
        supershop_store: formData.supermarketStore,
        canadian_owned: formData.canadian_owned,
        origin_country: formData.origin_country,
        manufactured_in: formData.manufactured_in,
        disclaimer_agreed: formData.disclaimer_agreed
      },
      {
        withCredentials: true, // Sends cookies
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Update brand failed:", error.response?.data || error.message);
    throw error;
  }
};
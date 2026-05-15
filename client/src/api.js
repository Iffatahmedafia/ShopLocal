import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";

// use API_URL in fetch/axios calls


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

export const fetchProduct = async (productId) => {
  try {
    const response = await axios.get(`${API_URL}/products/${productId}/`);
    return response.data;
  } catch (error) {
    console.error("Error fetching product:", error);
    throw error;
  }
};

export const fetchRecommendations = async () => {
  try {
    const response = await axios.get(`${API_URL}/recommendations/`, {
      withCredentials: true,
    });
    return response.data.recommendations || [];
  } catch (error) {
    console.error("Error fetching recommendations:", error);
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

export const fetchCart = async () => {
  try {
    const response = await axios.get(`${API_URL}/cart/`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching cart:", error);
    return { items: [], total_items: 0, subtotal: "0.00" };
  }
};

export const addToCart = async (productId, quantity = 1) => {
  try {
    const response = await axios.post(
      `${API_URL}/cart/items/`,
      { product: productId, quantity },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error adding to cart:", error);
    throw error;
  }
};

export const updateCartItem = async (itemId, quantity) => {
  try {
    const response = await axios.patch(
      `${API_URL}/cart/items/${itemId}/`,
      { quantity },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating cart item:", error);
    throw error;
  }
};

export const removeCartItem = async (itemId) => {
  try {
    const response = await axios.delete(`${API_URL}/cart/items/${itemId}/`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error removing cart item:", error);
    throw error;
  }
};

export const clearCart = async () => {
  try {
    const response = await axios.delete(`${API_URL}/cart/clear/`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error clearing cart:", error);
    throw error;
  }
};

export const checkoutCart = async (checkoutData) => {
  try {
    const response = await axios.post(`${API_URL}/orders/checkout/`, checkoutData, {
      headers: {
        "Content-Type": "application/json",
      },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error checking out cart:", error);
    throw error;
  }
};

export const fetchOrders = async () => {
  try {
    const response = await axios.get(`${API_URL}/orders/`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching orders:", error);
    return [];
  }
};

export const fetchOrder = async (orderId) => {
  try {
    const response = await axios.get(`${API_URL}/orders/${orderId}/`, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching order:", error);
    throw error;
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await axios.patch(
      `${API_URL}/orders/${orderId}/status/`,
      { status },
      {
        headers: {
          "Content-Type": "application/json",
        },
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error updating order status:", error);
    throw error;
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

export const deleteProduct = async (productId) => {
  try {
    const response = await axios.patch(`${API_URL}/product/trash/${productId}/`,{},
      { withCredentials: true }
    );
    return response
  } catch (error) {
    console.error("Error deleting product:", error);
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
        manufactured_in: formData.manufactured_in
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

export const getBrandAnalytics = async () => {
  return await axios.get(`${API_URL}/brand/analytics`, {
    withCredentials: true
  });
};
export const getAdminAnalytics = async () => {
  return await axios.get(`${API_URL}/admin/analytics`, {
    withCredentials: true
  })
}

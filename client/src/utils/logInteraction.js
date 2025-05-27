// utils/logInteraction.js

import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000/api";


export const logInteraction = async ({ userId, productId = null, action = "view", searchQuery = "" }) => {
  const data = {
    user: userId,
    product: productId,
    action,
    search_query: searchQuery,
  };

  try {
    await axios.post(`${API_URL}/interactions/`, data);
    console.log("Logged:", data);
  } catch (err) {
    console.error("Interaction log failed:", err);
  }
};


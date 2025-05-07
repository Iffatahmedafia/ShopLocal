// utils/logInteraction.js

import axios from "axios";

export const logInteraction = async ({ userId, productId = null, action = "view", searchQuery = "" }) => {
  const data = {
    user: userId,
    product: productId,
    action,
    search_query: searchQuery,
  };

  try {
    await axios.post("http://localhost:8000/api/interactions/", data);
    console.log("Logged:", data);
  } catch (err) {
    console.error("Interaction log failed:", err);
  }
};


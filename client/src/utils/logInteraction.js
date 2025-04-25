// utils/logInteraction.js
import axios from "axios";

export const logInteraction = ({ userId, productId = null, action = "view", searchQuery = "" }) => {
  const data = {
    user: userId,
    product: productId,
    action,
    search_query: searchQuery,
  };

  axios.post("/api/interactions/", data)
    .then(() => console.log("Logged:", data))
    .catch((err) => console.error("Interaction log failed:", err));
};

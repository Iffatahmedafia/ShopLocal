export const formatMoney = (value) => {
  const amount = Number(value || 0);
  return amount.toLocaleString("en-CA", {
    style: "currency",
    currency: "CAD",
  });
};

export const formatOrderDate = (value) => {
  if (!value) return "N/A";
  return new Date(value).toLocaleDateString("en-CA", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export const getFullImageUrl = (image) => {
  if (!image || image === "images/default.jpg") return "https://placehold.co/200";
  if (image.startsWith("http")) return image;
  if (image.startsWith("/")) return image;
  return `/${image}`;
};

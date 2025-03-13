import { FiHeart } from "react-icons/fi";

const ProductCard = ({ product, handleFavourites }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg overflow-hidden transition transform hover:scale-105 hover:shadow-2xl">
      {/* Product Image */}
      <img
        src={product.image}
        alt={product.name}
        className="w-full h-48 object-cover"
      />

      {/* Product Details */}
      <div className="p-4">
        <h3 className="text-lg font-bold text-gray-900 dark:text-white">{product.name}</h3>
        <p className="text-gray-500 dark:text-gray-400 font-semibold">Brand: {product.brand}</p>

        {/* Where to Buy */}
        <div className="mt-2">
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-semibold">Offline Store:</span> {product.offline_store || "Not Available"}
          </p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            <span className="font-semibold">Online Store: </span> 
            <a 
              href={product.online_store} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="text-red-500 hover:underline"
            >
              {product.online_store ? product.online_store : " Not Available"}
            </a>
          </p>
        </div>

        {/* Add to Favorites Button */}
        <button
          onClick={() => handleFavourites(product.id)}
          className="mt-4 w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg transition font-semibold"
        >
          <FiHeart size={18} /> Add to Favorites
        </button>
      </div>
    </div>
  );
};

export default ProductCard;

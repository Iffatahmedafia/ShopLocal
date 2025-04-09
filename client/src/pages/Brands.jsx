import React from "react";
import { useState, useEffect } from "react";
import { useSearch } from '../SearchContext.jsx';


const brands = [
  {
    id: 1,
    name: "Apple",
    category: "Electronics",
    province: "Ontario",
    offline: ["Apple Store (Toronto)", "Best Buy (Hamilton)"],
    online: ["https://www.apple.com/ca", "https://www.bestbuy.ca"],
  },
  {
    id: 2,
    name: "Lululemon",
    category: "Activewear",
    province: "British Columbia",
    offline: ["Lululemon Store (Vancouver)", "Sport Chek"],
    online: ["https://www.lululemon.com", "https://www.sportchek.ca"],
  },
  {
    id: 3,
    name: "IKEA",
    category: "Furniture",
    province: "Alberta",
    offline: ["IKEA (Edmonton)"],
    online: ["https://www.ikea.com/ca/en/"],
  },
];

const brandFilters = ["Apple", "IKEA", "Sony", "Samsung"];
const provinceFilters = ["Ontario", "Alberta", "British Columbia", "Manitoba"];

const Brand = () => {
  const [selectedBrand, setSelectedBrand] = useState("");
  const [selectedProvince, setSelectedProvince] = useState("");
  const { query } = useSearch();

  // Filter products dynamically
  const filteredBrands = brands.filter(
    (brand) =>
      (selectedBrand === "" || brand.name === selectedBrand) &&
      (selectedProvince === "" || brand.province === selectedProvince) &&
      (brand.name.toLowerCase().includes(query.toLowerCase()) || brand.brand.toLowerCase().includes(query.toLowerCase())) // Apply search query filter
  );

  return (
    <>
    <div className="bg-slate dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen transition duration-300">
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        <aside className="w-full md:w-1/4 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">Filters</h3>
            {/* Brand Filter */}
            <div className="mb-6">
              <label className="block font-semibold">Brand</label>
              <select
                className="w-full mt-2 p-2 bg-white dark:bg-gray-700 rounded-md"
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
              >
                <option value="">All Brands</option>
                {brandFilters.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
            </div>
            {/* Province Filter */}
            <div className="mb-6">
              <label className="block font-semibold">Province</label>
              <select
                className="w-full mt-2 p-2 bg-white dark:bg-gray-700 rounded-md"
                value={selectedProvince}
                onChange={(e) => setSelectedProvince(e.target.value)}
              >
                <option value="">All Province</option>
                {provinceFilters.map((province) => (
                  <option key={province} value={province}>
                    {province}
                  </option>
                ))}
              </select>
            </div>

            {/* Reset Filters Button */}
            <button
              className="w-full bg-red-600 hover:bg-red-700 text-white py-2 rounded-lg"
              onClick={() => {
                setSelectedBrand("");
                setSelectedProvince("");
              }}
            >
              Reset Filters
            </button>
        </aside>
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-6">Discover Brands</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredBrands.map((brand) => (
              <div
                key={brand.id}
                className="bg-gray-100 dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition hover:shadow-xl"
              >
                <div className="mb-4">
                  <h2 className="text-2xl font-semibold text-red-700 dark:text-white">
                    {brand.name}
                  </h2>
                  <p className="text-gray-600 dark:text-gray-300">
                    Category: <span className="font-medium">{brand.category}</span>
                  </p>
                  <p className="text-gray-600 dark:text-gray-300">
                    Province: <span className="font-medium">{brand.province}</span>
                  </p>
                </div>

                <hr className="my-4 border-gray-300 dark:border-gray-700" />

                <div>
                  <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-2">
                    Where to Buy
                  </h3>

                  <div className="mb-3">
                    <p className="font-semibold text-gray-700 dark:text-gray-200">Offline:</p>
                    <ul className="list-disc ml-5 text-gray-600 dark:text-gray-400">
                      {brand.offline.map((store, index) => (
                        <li key={index}>{store}</li>
                      ))}
                    </ul>
                  </div>

                  <div>
                    <p className="font-semibold text-gray-700 dark:text-gray-200">Online:</p>
                    <ul className="list-disc ml-5 text-blue-600 dark:text-blue-400">
                      {brand.online.map((url, index) => (
                        <li key={index}>
                          <a
                            href={url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline hover:text-blue-800 dark:hover:text-blue-300"
                          >
                            {new URL(url).hostname}
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default Brand;

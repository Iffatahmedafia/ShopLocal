import React, { useState, useEffect, Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { useSearch } from "../SearchContext.jsx";
import { fetchBrands, fetchCategories } from "../api.js";

const provinceOptions = [
  "Ontario",
  "Alberta",
  "British Columbia",
  "Quebec",
  "Manitoba",
  "Saskatchewan",
  "Nova Scotia",
];

function MultiSelect({ options, selected, setSelected, label }) {
  const toggleSelection = (option) => {
    if (selected.includes(option)) {
      setSelected(selected.filter((item) => item !== option));
    } else {
      setSelected([...selected, option]);
    }
  };

  return (
    <div className="mb-4">
      <label className="block font-semibold mb-1">{label}</label>
      <Listbox value={selected} onChange={setSelected} multiple>
        <div className="relative mt-1">
          <Listbox.Button className="relative w-full cursor-default rounded-lg bg-white dark:bg-gray-700 py-2 pl-3 pr-10 text-left border dark:border-gray-600 shadow-md">
            <span className="block truncate">
              {selected.length === 0 ? `Select ${label}` : selected.join(", ")}
            </span>
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon className="h-5 w-5 text-gray-400" />
            </span>
          </Listbox.Button>
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white dark:bg-gray-700 py-1 text-base shadow-lg ring-1 ring-black/5 focus:outline-none">
              {options.map((option, index) => (
                <Listbox.Option
                  key={index}
                  value={option}
                  as={Fragment}
                >
                  {({ active, selected: isSelected }) => (
                    <li
                      className={`relative cursor-default select-none py-2 pl-10 pr-4 flex items-center gap-2 ${
                        active ? "bg-red-100 dark:bg-red-700 text-black dark:text-white" : "text-gray-900 dark:text-white"
                      }`}
                      onClick={() => toggleSelection(option)}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        readOnly
                        className="h-4 w-4 accent-red-700"
                      />
                      <span className={`block truncate ${isSelected ? "font-medium" : "font-normal"}`}>
                        {option}
                      </span>
                    </li>
                  )}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
    </div>
  );
}

const Brand = () => {
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [selectedProvinces, setSelectedProvinces] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);

  const { query } = useSearch();

  useEffect(() => {
    const getBrands = async () => {
      const data = await fetchBrands();
      setBrands(data);
    };
    getBrands();
  }, []);

  useEffect(() => {
    const getCategories = async () => {
      const data = await fetchCategories();
      setCategories(data);
    };
    getCategories();
  }, []);

  const uniqueBrandNames = [...new Set(brands.map((b) => b.name))];
  const uniqueCategoryNames = [...new Set(categories.map((c) => c.name))];

  const filteredBrands = brands.filter((brand) => {
    const brandCategoryName =
      categories.find((cat) => cat.id === brand.category)?.name || "";

    return (
      (selectedBrands.length === 0 || selectedBrands.includes(brand.name)) &&
      (selectedProvinces.length === 0 || selectedProvinces.includes(brand.province)) &&
      (selectedCategories.length === 0 || selectedCategories.includes(brandCategoryName)) &&
      (brand.name.toLowerCase().includes(query.toLowerCase()) ||
        brandCategoryName.toLowerCase().includes(query.toLowerCase()))
    );
  });

  return (
    <div className="bg-slate dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen transition duration-300">
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-1/4 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">Filters</h3>

          <MultiSelect
            options={uniqueBrandNames}
            selected={selectedBrands}
            setSelected={setSelectedBrands}
            label="Brands"
          />
          <MultiSelect
            options={provinceOptions}
            selected={selectedProvinces}
            setSelected={setSelectedProvinces}
            label="Provinces"
          />
          <MultiSelect
            options={uniqueCategoryNames}
            selected={selectedCategories}
            setSelected={setSelectedCategories}
            label="Categories"
          />

          <button
            onClick={() => {
              setSelectedBrands([]);
              setSelectedProvinces([]);
              setSelectedCategories([]);
            }}
            className="w-full mt-4 bg-red-700 hover:bg-red-800 text-white py-2 rounded-lg"
          >
            Reset Filters
          </button>
        </aside>

        {/* Main content */}
        <div className="flex-1">
          <h2 className="text-2xl font-bold mb-6">Discover Brands</h2>
          {filteredBrands.length === 0 ? (
            <div className="text-center py-20 bg-gray-100 dark:bg-gray-800 rounded-xl shadow-inner">
              <h3 className="text-xl font-semibold text-gray-700 dark:text-gray-300">
                No brands match your filters.
              </h3>
              <p className="text-gray-500 dark:text-gray-500 mt-2">Try adjusting your filters or search keywords.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBrands.map((brand) => {
                const categoryName =
                  categories.find((cat) => cat.id === brand.category)?.name || "N/A";
                return (
                  <div
                    key={brand.id}
                    className="bg-gray-100 dark:bg-gray-800 rounded-2xl shadow-lg p-6 transition hover:shadow-xl"
                  >
                    <div className="mb-4">
                      <h2 className="text-2xl font-semibold text-red-700 dark:text-white">
                        {brand.name}
                      </h2>
                      <p className="text-gray-600 dark:text-gray-300">
                        Category:{" "}
                        <span className="font-medium">{categoryName}</span>
                      </p>
                      <p className="text-gray-600 dark:text-gray-300">
                        Province:{" "}
                        <span className="font-medium">{brand.province}</span>
                      </p>
                    </div>
                    <hr className="my-4 border-gray-300 dark:border-gray-700" />
                    <div>
                      <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100 mb-2">Where to Buy</h3>
                      <p className="font-semibold text-gray-700 dark:text-gray-200">
                        Store:{" "}
                        <span className="text-gray-600 dark:text-gray-400">
                          {brand.store_address || "Not Available"}
                        </span>
                      </p>
                      <p className="font-semibold text-gray-700 dark:text-gray-200 mt-2">
                        Website:{" "}
                        {brand.website_link ? (
                          <a
                            href={brand.website_link}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="underline text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
                          >
                            {new URL(brand.website_link).hostname}
                          </a>
                        ) : (
                          "Not Available"
                        )}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Brand;
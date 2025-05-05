import React, { useState, useEffect, Fragment } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, ChevronUpDownIcon } from "@heroicons/react/20/solid";
import { useSearch } from "../SearchContext.jsx";
import { fetchBrands, fetchCategories } from "../api.js";
import BrandCard from "../components/BrandCard.jsx";

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
                <Listbox.Option key={index} value={option} as={Fragment}>
                  {({ active, selected: isSelected }) => (
                    <li
                      className={`relative cursor-default select-none py-2 pl-10 pr-4 flex items-center gap-2 ${
                        active
                          ? "bg-red-100 dark:bg-red-700 text-black dark:text-white"
                          : "text-gray-900 dark:text-white"
                      }`}
                      onClick={() => toggleSelection(option)}
                    >
                      <input
                        type="checkbox"
                        checked={isSelected}
                        readOnly
                        className="h-4 w-4 accent-red-700"
                      />
                      <span
                        className={`block truncate ${
                          isSelected ? "font-medium" : "font-normal"
                        }`}
                      >
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
  const [isCanadianOwned, setIsCanadianOwned] = useState(false);

  const { query } = useSearch();

  useEffect(() => {
    const getBrands = async () => {
      const data = await fetchBrands();
      console.log("Fetched Brands", data)
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

  // Filter brand dropdown based on Canadian Owned if checked
  const filteredBrandList = brands.filter((brand) =>
    isCanadianOwned ? brand.canadian_owned : true
  );

  const uniqueBrandNames = [
    ...new Set(filteredBrandList.map((b) => b.name)),
  ];
  const uniqueCategoryNames = [
    ...new Set(categories.map((c) => c.name)),
  ];

  const filteredBrands = brands.filter((brand) => {
    const brandCategoryName =
      categories.find((cat) => cat.id === brand.category)?.name || "";

    const brandMatch =
      selectedBrands.length === 0 || selectedBrands.includes(brand.name);

    const provinceMatch =
      selectedProvinces.length === 0 ||
      selectedProvinces.includes(brand.province);

    const categoryMatch =
      selectedCategories.length === 0 ||
      selectedCategories.includes(brandCategoryName);

    const canadianOwnedMatch = !isCanadianOwned || brand.canadian_owned;

    const searchMatch =
      brand.name.toLowerCase().includes(query.toLowerCase()) ||
      brandCategoryName.toLowerCase().includes(query.toLowerCase());

    return (
      brandMatch &&
      provinceMatch &&
      categoryMatch &&
      canadianOwnedMatch &&
      searchMatch
    );
  });

  return (
    <div className="bg-slate dark:bg-gray-900 text-gray-900 dark:text-white min-h-screen transition duration-300">
      <div className="container mx-auto px-4 py-8 flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-1/4 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-md">
          <h3 className="text-xl font-bold mb-4">Filters</h3>

          <div className="mb-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={isCanadianOwned}
                onChange={(e) => setIsCanadianOwned(e.target.checked)}
                className="h-4 w-4 text-red-700 border-gray-300 rounded focus:ring-red-500"
              />
              <span className="ml-2 font-semibold">Canadian Owned</span>
            </label>
          </div>

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
              setIsCanadianOwned(false);
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
              <p className="text-gray-500 dark:text-gray-500 mt-2">
                Try adjusting your filters or search keywords.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-6 p-4">
              {filteredBrands.map((brand) => {
                const categoryName =
                  categories.find((cat) => cat.id === brand.category)?.name ||
                  "N/A";
                return (
                  <BrandCard
                    key={brand.id}
                    brand={brand}
                    category={categoryName}
                    type="add"
                  />
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

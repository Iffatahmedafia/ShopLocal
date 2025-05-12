// SearchContext.js
import React, { createContext, useState, useContext } from 'react';

const SearchContext = createContext();

export const useSearch = () => {
  return useContext(SearchContext);
};

export const SearchProvider = ({ children }) => {
  const [query, setQuery] = useState('');

  const updateSearchQuery = (newQuery) => {
    setQuery(newQuery);
  };

  return (
    <SearchContext.Provider value={{ query, updateSearchQuery }}>
      {children}
    </SearchContext.Provider>
  );
};

import { createContext, useCallback, useContext, useEffect, useState } from "react";

import { fetchCategories, fetchSubCategories, fetchSubSubCategories } from "../api";

const LookupDataContext = createContext({
  categories: [],
  subcategories: [],
  subsubcategories: [],
  subSubCategories: [],
  loading: true,
  error: null,
  ensureLookupData: async () => {},
  refreshLookupData: async () => {},
});

let lookupCache = null;
let lookupPromise = null;

const loadLookupData = async ({ force = false } = {}) => {
  if (lookupCache && !force) return lookupCache;
  if (lookupPromise && !force) return lookupPromise;

  lookupPromise = Promise.all([
    fetchCategories(),
    fetchSubCategories(),
    fetchSubSubCategories(),
  ]).then(([categories, subcategories, subsubcategories]) => {
    lookupCache = {
      categories,
      subcategories,
      subsubcategories,
      subSubCategories: subsubcategories,
    };
    lookupPromise = null;
    return lookupCache;
  }).catch((error) => {
    lookupPromise = null;
    throw error;
  });

  return lookupPromise;
};

export const LookupDataProvider = ({ children }) => {
  const [lookupData, setLookupData] = useState(() => lookupCache || {
    categories: [],
    subcategories: [],
    subsubcategories: [],
    subSubCategories: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const ensureLookupData = useCallback(async () => {
    if (lookupCache) {
      setLookupData(lookupCache);
      return lookupCache;
    }

    setLoading(true);
    setError(null);
    try {
      const data = await loadLookupData();
      setLookupData(data);
      return data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const refreshLookupData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await loadLookupData({ force: true });
      setLookupData(data);
      return data;
    } catch (err) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return (
    <LookupDataContext.Provider value={{ ...lookupData, loading, error, ensureLookupData, refreshLookupData }}>
      {children}
    </LookupDataContext.Provider>
  );
};

export const useLookupData = () => {
  const context = useContext(LookupDataContext);

  useEffect(() => {
    context.ensureLookupData().catch(() => {});
  }, [context.ensureLookupData]);

  return context;
};

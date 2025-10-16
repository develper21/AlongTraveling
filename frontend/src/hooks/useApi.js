import { useState, useCallback, useRef, useEffect } from 'react';

// Cache for storing API responses
const responseCache = new Map();

// Cache for storing requests in progress
const requestCache = new Map();

// Helper to generate cache key
const generateCacheKey = (url, params = {}) => {
  const sortedParams = Object.keys(params)
    .sort()
    .reduce((acc, key) => ({
      ...acc,
      [key]: params[key]
    }), {});
  
  return `${url}-${JSON.stringify(sortedParams)}`;
};

// Main hook
export const useApi = (apiCall, { manual = false } = {}) => {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(!manual);
  const isMounted = useRef(true);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const fetchData = useCallback(async (...args) => {
    const cacheKey = generateCacheKey(apiCall.name, args[0]);
    
    // Return cached response if available
    if (responseCache.has(cacheKey)) {
      const cachedData = responseCache.get(cacheKey);
      if (isMounted.current) {
        setData(cachedData);
        setLoading(false);
      }
      return { data: cachedData, error: null };
    }

    // Return existing promise if request is in progress
    if (requestCache.has(cacheKey)) {
      try {
        const result = await requestCache.get(cacheKey);
        if (isMounted.current) {
          setData(result);
          setLoading(false);
        }
        return { data: result, error: null };
      } catch (err) {
        if (isMounted.current) {
          setError(err);
          setLoading(false);
        }
        return { data: null, error: err };
      }
    }

    // Make the API call
    try {
      if (isMounted.current) {
        setLoading(true);
        setError(null);
      }

      const promise = apiCall(...args);
      requestCache.set(cacheKey, promise);

      const result = await promise;
      
      // Cache successful responses
      responseCache.set(cacheKey, result);
      requestCache.delete(cacheKey);

      if (isMounted.current) {
        setData(result);
        setLoading(false);
      }

      return { data: result, error: null };
    } catch (err) {
      requestCache.delete(cacheKey);
      
      if (isMounted.current) {
        setError(err);
        setLoading(false);
      }
      
      return { data: null, error: err };
    }
  }, [apiCall]);

  // Auto-fetch on mount if not manual
  useEffect(() => {
    if (!manual) {
      fetchData();
    }
  }, [fetchData, manual]);

  // Clear cache for this API call
  const clearCache = useCallback(() => {
    const cacheKey = generateCacheKey(apiCall.name);
    responseCache.forEach((_, key) => {
      if (key.startsWith(cacheKey)) {
        responseCache.delete(key);
      }
    });
  }, [apiCall.name]);

  return {
    data,
    error,
    loading,
    fetchData,
    clearCache,
    setData // Allow manual data updates
  };
};

// Higher-order function to create a custom hook for a specific API call
export const createApiHook = (apiCall) => {
  return (options) => useApi(apiCall, options);
};

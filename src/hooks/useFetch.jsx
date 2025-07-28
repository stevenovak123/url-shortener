import { useState } from 'react';

const useFetch = (callback, options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState(null);

  const fnc = async (...args) => {
    setLoading(true);
    setError(null);
    try {
      const response = await callback(options, ...args);
      setData(response);
    } catch (error) {
      setError(error);
    } finally {
      setLoading(false);
    }
  };
  return { data, loading, error, fnc };
};
export default useFetch;

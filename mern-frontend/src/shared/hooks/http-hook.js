import { useState, useEffect, useCallback, useRef } from 'react';

export const useHttpClient = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState();
  const activeHttpRequests = useRef([]);

  const sendRequest = useCallback(
    async (url, method = 'GET', headers = {}, body = null) => {
      setIsLoading(true);
      const httpAbortControl = new AbortController();
      activeHttpRequests.current.push(httpAbortControl);

      try {
        const response = await fetch(url, {
          method,
          headers: { ...headers },
          body,
          signal: httpAbortControl.signal,
        });

        const responseData = await response.json();
        activeHttpRequests.current = activeHttpRequests.current.filter(
          (reqControl) => reqControl !== httpAbortControl
        );

        if (!response.ok) {
          throw new Error(responseData.message);
        }

        setIsLoading(false);
        return responseData;
      } catch (err) {
        if (err.name === 'AbortError') {
          return;
        }
        setError(err.message);
        setIsLoading(false);
        throw err;
      }
    },
    []
  );

  const clearError = () => {
    setError(null);
  };

  useEffect(() => {
    const clean = () => {
      // eslint-disable-next-line react-hooks/exhaustive-deps
      activeHttpRequests.current.forEach((abortCtrl) => abortCtrl.abort());
    };
    return clean;
  }, []);

  return { isLoading, error, sendRequest, clearError };
};

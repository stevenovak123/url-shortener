import { createContext, useContext, useEffect } from 'react';
import useFetch from './hooks/useFetch';
import { getCurrentUser } from './db/apiAuth';
const UrlContext = createContext();

const UrlProvider = ({ children }) => {
  const { data: user, loading, fnc: fetchUser } = useFetch(getCurrentUser);

  const isAuth = user?.role === 'authenticated';
  useEffect(() => {
    fetchUser();
  }, []);
  return (
    <UrlContext.Provider value={{ user, fetchUser, loading, isAuth }}>
      {children}
    </UrlContext.Provider>
  );
};

export const UrlState = () => {
  return useContext(UrlContext);
};
export default UrlProvider;

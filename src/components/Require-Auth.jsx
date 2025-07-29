import { UrlState } from '@/Context';
import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarLoader } from 'react-spinners';

function RequireAuth({ children }) {
  const navigate = useNavigate();
  const { loading, isAuth } = UrlState();

  useEffect(() => {
    if (!isAuth && loading === false) navigate('/auth');
  }, [isAuth, loading]);

  if (loading) return <BarLoader width={'100%'} color='#36d7b7' />;
  if (isAuth) return children;
}

export default RequireAuth;

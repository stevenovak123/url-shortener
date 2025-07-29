import React, { useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useNavigate, useSearchParams } from 'react-router-dom';
import Login from '@/components/Login';
import Signup from '@/components/Signup';
import { UrlState } from '@/Context';

const Auth = () => {
  const [searchParams] = useSearchParams();
  const longLink = searchParams.get('createNew');
  const navigate = useNavigate();

  const { isAuth, loading } = UrlState();

  useEffect(() => {
    if (isAuth && !loading) {
      navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ''}`);
    }
  }, [isAuth]);
  return (
    <div className='mt-20 flex flex-col items-center gap-10'>
      <h1 className='text-5xl font-extrabold'>Login/Signup</h1>
      {longLink ? 'Login first' : ''}
      <Tabs defaultValue='login' className='w-[400px]'>
        <TabsList className='grid w-full grid-cols-2'>
          <TabsTrigger value='login'>Login</TabsTrigger>
          <TabsTrigger value='signup'>Signup</TabsTrigger>
        </TabsList>
        <TabsContent value='login'>
          <Login />
        </TabsContent>
        <TabsContent value='signup'>
          <Signup />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Auth;

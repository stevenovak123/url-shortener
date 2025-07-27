import Header from '@/components/Header';
import React from 'react';
import { Outlet } from 'react-router-dom';

const AppLayout = () => {
  return (
    <div>
      <main className='min-h-screen min-w-screen'>
        <Header />
        <Outlet />
      </main>
      <div className='p-10 text-center bg-gray-800 text-white'>
        Made by Stevenovak123
      </div>
    </div>
  );
};

export default AppLayout;

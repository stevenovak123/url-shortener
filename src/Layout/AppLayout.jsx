import Header from '@/components/Header';
import React from 'react';
import { Outlet } from 'react-router-dom';

const AppLayout = () => {
  return (
    <div>
      <main className='min-h-screen mx-auto max-w-7xl px-4 sm:px-6 lg:px-8'>
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

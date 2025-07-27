import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';

const Header = () => {
  return (
    <div>
      <Link>
        <img src='/logo.png' className='h-16' alt='Linkerr logo' />
      </Link>
      <div className=''>
        <Button>Login</Button>
      </div>
    </div>
  );
};

export default Header;

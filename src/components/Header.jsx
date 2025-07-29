import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { LinkIcon, LogOut } from 'lucide-react';
import { UrlState } from '@/Context';
import useFetch from '@/hooks/useFetch';
import { BarLoader } from 'react-spinners';
import { logout } from '@/db/apiAuth';

const Header = () => {
  const navigate = useNavigate();
  const { user, fetchUser } = UrlState();
  const { loading, fnc } = useFetch(logout);
  return (
    <>
      <nav className='py-4 flex justify-between items-center'>
        <Link to='/'>
          <img src='/logo.png' className='h-16' alt='Linkerr logo' />
        </Link>
        <div className=''>
          {!user ? (
            <Button onClick={() => navigate('/auth')}>Login</Button>
          ) : (
            <DropdownMenu>
              <DropdownMenuTrigger className='w-8 rounded-full overflow-hidden'>
                <Avatar>
                  <AvatarImage
                    src={user?.user_metadata?.profile_pic}
                    className='object-contain'
                  />
                  <AvatarFallback>US</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>
                  {user?.user_metadata?.name}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link to='/dashboard' className='flex'>
                    <LinkIcon className='mr-2 h-4 w-2' />
                    <span>My Links</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className='text-red-400'
                  onClick={() => {
                    fnc().then(() => {
                      fetchUser();
                      navigate('/');
                    });
                  }}
                >
                  <LogOut className='mr-2 h-4 w-2' />
                  <span>Logout</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </nav>
      {loading && <BarLoader className='mb-4' width={'100%'} color='#36d7b7' />}
    </>
  );
};

export default Header;

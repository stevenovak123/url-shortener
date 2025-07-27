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

const Header = () => {
  const navigate = useNavigate();
  const user = true;
  return (
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
                <AvatarImage src='https://github.com/shadcn.png' />
                <AvatarFallback>US</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuLabel>SJ</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <LinkIcon className='mr-2 h-4 w-2' />
                <span>My Links</span>
              </DropdownMenuItem>
              <DropdownMenuItem className='text-red-400'>
                <LogOut className='mr-2 h-4 w-2' />
                <span>Logout</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </nav>
  );
};

export default Header;

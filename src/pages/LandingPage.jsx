import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useNavigate } from 'react-router-dom';
const LandingPage = () => {
  const [longUrl, setLongUrl] = useState();
  const navigate = useNavigate();
  const handleShorten = (e) => {
    e.preventDefault();
    if (longUrl) navigate(`/auth?createNew=${longUrl}`);
  };
  return (
    <div className='flex flex-col items-center'>
      <h2 className='my-10 sm:my-16 text-3xl sm:text-6xl lg:text-7xl text-white text-center font-extrabold'>
        Linkerr. <br />
        URL Shortening with analytics
      </h2>
      <form
        onSubmit={handleShorten}
        className='sm:h-14 flex flex-col sm:flex-row w-full md:w-2/4 gap-2'
      >
        <Input
          type='url'
          value={longUrl}
          placeholder='Enter your long url'
          className='h-full flex-1 py-4 px-4'
          onChange={(e) => setLongUrl(e.target.value)}
        />
        <Button className='h-full' type='submit' variant='destructive'>
          Shorten!
        </Button>
      </form>

      <Accordion
        type='multiple'
        collapsible
        className='w-full py-11 md:px-11 mb-10'
      >
        <AccordionItem value='item-1'>
          <AccordionTrigger className='text-4xl'>
            How does it work?
          </AccordionTrigger>
          <AccordionContent className='text-xl'>
            When you enter a long url, the app will generate a shorter version
            of the URL. This shortenend URL will be a redirect to the original
            long URL when accessed.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value='item-2'>
          <AccordionTrigger className='text-4xl'>
            Do I need an account for analytics?
          </AccordionTrigger>
          <AccordionContent className='text-xl'>
            Yes. Creating an account will allow you to manage URLs, view
            analytics, and customize your short URLs.
          </AccordionContent>
        </AccordionItem>
        <AccordionItem value='item-3'>
          <AccordionTrigger className='text-4xl'>
            What analytics are available
          </AccordionTrigger>
          <AccordionContent className='text-xl'>
            You can view the number of clicks, geolocation data and device types
            for each URL.
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};

export default LandingPage;

import React, { useState } from 'react';
import { BarLoader } from 'react-spinners';

import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Filter } from 'lucide-react';
import useFetch from '@/hooks/useFetch';
import { getUrl } from '@/db/apiUrl';
import { UrlState } from '@/Context';
import { getClicksForUrls } from '@/db/apiClicks';
import { useEffect } from 'react';
import LinkCard from '@/components/LinkCard';
import CreateLink from '@/components/Create-link';
const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState('');

  const { user } = UrlState();
  const { loading, error, data: urls, fnc: fnUrl } = useFetch(getUrl, user.id);
  const {
    loading: loadingClicks,
    data: clicks,
    fnc: fnClicks,
  } = useFetch(
    getClicksForUrls,
    urls?.map((url) => url.id)
  );

  useEffect(() => {
    fnUrl();
  }, []);

  const filteredUrls = urls?.filter((url) =>
    url.title.toLowerCase().includes(searchQuery.toLowerCase())
  );
  useEffect(() => {
    if (urls?.length) {
      fnClicks();
    }
  }, [urls?.length]);

  return (
    <div className='flex flex-col gap-8'>
      {(loading || loadingClicks) && (
        <BarLoader width={'100%'} color='#36d7b7' />
      )}
      <div className='grid grid-cols-2 gap-4'>
        <Card>
          <CardHeader>
            <CardTitle className='text-3xl '>Links created</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-xl'>{urls?.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className='text-3xl'>Total Clicks</CardTitle>
          </CardHeader>
          <CardContent>
            <p className='text-xl'>{clicks?.length}</p>
          </CardContent>
        </Card>
      </div>
      <div className='flex justify-between'>
        <h1 className='text-5xl font-extrabold'>My links</h1>
        <CreateLink />
      </div>
      <div className='relative'>
        <Input
          type='text'
          placeholder='Filter Links..'
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className='h-13'
        />
        <Filter className='absolute top-2 right-2 p-1 h-10' />
      </div>
      {error && <Error message={error?.message} />}
      {(filteredUrls || []).map((urls, i) => (
        <LinkCard key={i} url={urls} fetchUrls={fnUrl} />
      ))}
    </div>
  );
};

export default Dashboard;

import { storeClicks } from '@/db/apiClicks';
import { getLongUrl } from '@/db/apiUrl';
import useFetch from '@/hooks/useFetch';
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { BarLoader } from 'react-spinners';

const Redirect = () => {
  const { id } = useParams();

  const { loading, data, fnc } = useFetch(getLongUrl, id);
  const { loading: loadingStats, fnc: fnStats } = useFetch(storeClicks, {
    id: data?.id,
    originalUrl: data?.original_url,
  });

  useEffect(() => {
    fnc();
  }, []);

  useEffect(() => {
    if (!loading && data) {
      fnStats();
    }
  }, [loading]);

  if (loading || loadingStats) {
    return (
      <>
        <div className='text-center'>
          <BarLoader width={'100%'} color='#36d7b7' />
          <div className='flex items-center justify-center '>
            <br />
            <h1 className='text-8xl font-bold pt-40'>Redirecting....</h1>
          </div>
        </div>
      </>
    );
  }
  return null;
};

export default Redirect;

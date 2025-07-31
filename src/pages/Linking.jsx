import DeviceStats from '@/components/DeviceStats';
import Location from '@/components/Location';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { UrlState } from '@/Context';
import { getClicksForUrl } from '@/db/apiClicks';
import { deleteUrl, getUrlForUser } from '@/db/apiUrl';
import useFetch from '@/hooks/useFetch';
import { Copy, Download, LinkIcon, Trash } from 'lucide-react';
import React, { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { BarLoader, BeatLoader } from 'react-spinners';

const Linking = () => {
  const { id } = useParams();
  const { user } = UrlState();
  const navigate = useNavigate();
  const WebUrl = import.meta.env.VITE_WEBPAGE_URL;

  const {
    loading,
    data: url,
    fnc,
    error,
  } = useFetch(getUrlForUser, { id, user_id: user?.id });

  const {
    loading: loadingStats,
    data: stats,
    fnc: fnStats,
  } = useFetch(getClicksForUrl, id);

  const { loading: loadingDelete, fnc: fnDelete } = useFetch(deleteUrl, id);

  useEffect(() => {
    fnc();
    fnStats();
  }, []);

  const downloadImage = async () => {
    const imageUrl = url?.qr;
    const fileName = url?.title || 'qr-code';

    if (!imageUrl) {
      console.error('Image URL is missing!');
      return;
    }

    const isValidUrl =
      imageUrl.startsWith('http') || imageUrl.startsWith('https');
    if (!isValidUrl) {
      console.error('Invalid image URL:', imageUrl);
      return;
    }

    try {
      // Fetch the image as a blob to bypass CORS issues
      const response = await fetch(imageUrl);

      if (!response.ok) {
        throw new Error(`Failed to fetch image: ${response.status}`);
      }

      const blob = await response.blob();

      // Create a blob URL
      const blobUrl = URL.createObjectURL(blob);

      // Create anchor element to trigger download
      const anchor = document.createElement('a');
      anchor.href = blobUrl;
      anchor.download = `${fileName}.png`; // Add file extension

      // Append the anchor to the DOM, trigger click, and then remove it
      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);

      // Clean up the blob URL to free memory
      URL.revokeObjectURL(blobUrl);
    } catch (error) {
      console.error('Error downloading image:', error);

      // Fallback: Try the original method (will likely open in new tab)

      const anchor = document.createElement('a');
      anchor.href = imageUrl;
      anchor.download = `${fileName}.png`;
      anchor.target = '_blank';

      document.body.appendChild(anchor);
      anchor.click();
      document.body.removeChild(anchor);
    }
  };

  if (error) {
    navigate('/dashboard');
  }

  let link = '';
  if (url) {
    link = url?.custom_url ? url?.custom_url : url.short_url;
  }

  return (
    <>
      {(loading || loadingStats) && (
        <BarLoader className='mb-4' width={'100%'} color='#36d7b7' />
      )}
      <div className='flex flex-col gap-8 sm:flex-row justify-between'>
        <div className='flex flex-col items-start gap-8 rounded-lg sm:w-2/5 sm:flex-wrap'>
          <span className='text-6xl font-extrabold hover: underline cursor-pointer'>
            {url?.title}
          </span>
          <a
            href={`${WebUrl}/${link}`}
            target='_blank'
            className='text-3xl sm:text-4xl text-blue-400 font-bold hover:underline cursor-pointer '
          >
            {WebUrl}/{link}
          </a>
          <a
            href={url?.original_url}
            target='_blank'
            className='flex items-center gap-1 hover:underline cursor-pointer'
          >
            <LinkIcon className='p-1' />
            {url?.original_url}
          </a>
          <span className='flex items-end font-extralight text-sm'>
            {new Date(url?.created_at).toLocaleString()}
          </span>
          <div className='flex gap-2  '>
            <Button
              variant='ghost'
              onClick={() =>
                navigator.clipboard.writeText(`${WebURL}/${url?.short_url}`)
              }
            >
              <Copy />
            </Button>
            <Button variant='ghost' onClick={downloadImage}>
              <Download />
            </Button>
            <Button variant='ghost' onClick={() => fnDelete()}>
              {loadingDelete ? (
                <BeatLoader size={'5'} color='white' />
              ) : (
                <Trash />
              )}
            </Button>
          </div>
          <img
            src={url?.qr}
            alt='qr code'
            className='w-8xl self-center sm:self-start ring ring-blue-500 p-1  object-contain'
          />
        </div>
        <Card className='sm:w-3/5'>
          <CardHeader>
            <CardTitle className='text-4xl font-bold mb-0'>Stats</CardTitle>
          </CardHeader>
          {stats && stats?.length ? (
            <CardContent className='flex flex-col gap-4'>
              <CardTitle className='text-2xl'>Total Clicks</CardTitle>

              <CardContent>
                <p className='text-xl'>{stats?.length}</p>
              </CardContent>
              <CardTitle className='text-2xl'>Location Data</CardTitle>
              <CardContent className='w-full h-70 sm:w-4/5 md:w-3/4 sm:h-96 md:h-[400px] lg:h-[300px] xl:h-[300px] 2xl:h-[300px]'>
                <Location stats={stats} />
              </CardContent>

              <CardTitle className='text-2xl'>Device Info</CardTitle>
              <CardContent className='w-full h-70 sm:w-4/5 md:w-3/4 sm:h-96 md:h-[400px] lg:h-[300px] xl:h-[300px] 2xl:h-[300px]'>
                <DeviceStats stats={stats} />
              </CardContent>
            </CardContent>
          ) : (
            <CardContent>
              {loadingStats === false
                ? 'No Statistics yet'
                : 'Loading Statistics...'}
            </CardContent>
          )}
        </Card>
      </div>
    </>
  );
};

export default Linking;

import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from './ui/button';
import { Copy, Download, Trash } from 'lucide-react';
import useFetch from '@/hooks/useFetch';
import { deleteUrl } from '@/db/apiUrl';
import { BeatLoader } from 'react-spinners';

const LinkCard = ({ url, fetchUrls }) => {
  const WebURL = import.meta.env.VITE_WEBPAGE_URL;

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
  const { loading: loadingDelete, fnc: fnDelete } = useFetch(deleteUrl, url.id);

  return (
    <div className='flex flex-col md:flex-row gap-5 border p-4 bg-gray-900 rounded lg'>
      <img
        src={url?.qr}
        className='h-32 object-contain ring ring-blue-500 self-start'
        alt='qrCode'
      />
      <Link to={`/link/${url?.id}`} className='flex flex-col flex-1'>
        <span className='text-3xl font-extrabold hover:underline cursor-pointer'>
          {url?.title}
        </span>
        <span className='text-2xl text-blue-400 font-bold hover:underline cursor-pointer '>
          {WebURL}/{url?.custom_url ? url?.custom_url : url.short_url}
        </span>
        <span className='flex items-center gap-1 hover:underline cursor-pointer'>
          {url?.original_url}
        </span>
        <span className='flex items-end font-extralight text-sm flex-1'>
          {new Date(url?.created_at).toLocaleString()}
        </span>
      </Link>
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
        <Button
          variant='ghost'
          onClick={() => fnDelete().then(() => fetchUrls())}
        >
          {loadingDelete ? <BeatLoader size={'5'} color='white' /> : <Trash />}
        </Button>
      </div>
    </div>
  );
};

export default LinkCard;

import React, { useEffect, useRef, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { UrlState } from '@/Context';
import * as Yup from 'yup';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card } from './ui/card';
import Error from './Error';
import { QRCode } from 'react-qrcode-logo';
import useFetch from '@/hooks/useFetch';
import { createUrl } from '@/db/apiUrl';
import { BeatLoader } from 'react-spinners';

const CreateLink = () => {
  const { user } = UrlState();
  const navigate = useNavigate();
  let [searchParams, setSearchParams] = useSearchParams();
  const WebURL = import.meta.env.VITE_WEBPAGE_URL;
  const longLink = searchParams.get('createNew');
  const [errors, setErrors] = useState({});
  const [formValues, setFormValues] = useState({
    title: '',
    longUrl: longLink ? longLink : '',
    customUrl: '',
  });
  const ref = useRef();
  const schema = Yup.object().shape({
    title: Yup.string().required('Title is required'),
    longUrl: Yup.string()
      .url('Must be a valid URL')
      .required('Long URL is required'),
    customUrl: Yup.string(),
  });
  const handleChange = (event) => {
    setFormValues({
      ...formValues,
      [event.target.id]: event.target.value,
    });
  };

  const {
    loading,
    error,
    data,
    fnc: fnCreateUrl,
  } = useFetch(createUrl, { ...formValues, user_id: user.id });

  const createNewLink = async () => {
    setErrors([]);
    try {
      await schema.validate(formValues, { abortEarly: false });

      const canvas = ref.current.canvasRef.current;
      const blob = await new Promise((resolve) => canvas.toBlob(resolve));

      await fnCreateUrl(blob);
    } catch (e) {
      const newErrors = {};

      e?.inner?.forEach((err) => {
        newErrors[err.path] = err.message;
      });

      setErrors(newErrors);
    }
  };

  useEffect(() => {
    if (error === null && data) {
      navigate(`/link/${data[0].id}`);
    }
  }, [error, data]);
  return (
    <Dialog
      defaultOpen={longLink}
      onOpenChange={(res) => {
        if (!res) setSearchParams({});
      }}
    >
      <DialogTrigger className='bg-red-600 rounded px-1 font-bold'>
        Create New Link
      </DialogTrigger>
      <DialogContent className='sm:max-w-md'>
        <DialogHeader>
          <DialogTitle className='font-bold text-3xl'>Create New</DialogTitle>
        </DialogHeader>
        {formValues?.longUrl && (
          <QRCode
            value={formValues?.longUrl}
            size={180}
            ref={ref}
            logoImage='/logo.png'
            logoHeight={60}
            logoWidth={50}
          />
        )}
        <Input
          id='title'
          placeholder='Short link title'
          value={formValues.title}
          onChange={handleChange}
        />
        {errors.title && <Error message={errors.title} />}

        <Input
          id='longUrl'
          placeholder='Enter your long url'
          value={formValues.longUrl}
          onChange={handleChange}
        />
        {errors.longUrl && <Error message={errors.longUrl} />}

        <div className='flex items-center gap-2'>
          <Card className='p-2'>{WebURL}</Card>/
          <Input
            id='customUrl'
            placeholder='Custom Link (optional)'
            value={formValues.customUrl}
            onChange={handleChange}
          />
        </div>
        {error && <Error message={error.message} />}
        <DialogFooter className='sm:justify-start'>
          <Button
            type='button'
            onClick={createNewLink}
            disabled={loading}
            variant='destructive'
            className='cursor-pointer'
          >
            {loading ? <BeatLoader size={10} color='white' /> : 'Create link'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default CreateLink;

import React, { useEffect, useState } from 'react';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import * as Yup from 'yup';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { BeatLoader } from 'react-spinners';
import Error from './Error';
import useFetch from '@/hooks/useFetch';
import { signUp } from '@/db/apiAuth';
import { useNavigate, useSearchParams } from 'react-router-dom';

const Signup = () => {
  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    profile_pic: null,
  });

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const longLink = searchParams.get('createNew');

  const { data, loading, error, fnc } = useFetch(signUp, formData);

  useEffect(() => {
    if (error === null && data) {
      navigate(`/dashboard?${longLink ? `createNew=${longLink}` : ''}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [error, data]);

  const handleInputChange = (event) => {
    const { name, value, files } = event.target;
    setFormData((prevState) => ({
      ...prevState,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSignup = async () => {
    setErrors([]);
    try {
      const schema = Yup.object().shape({
        name: Yup.string().required('Name is required'),
        email: Yup.string()
          .email('Invalid email')
          .required('Email is required'),
        password: Yup.string()
          .min(6, 'Password must be at least 6 characters')
          .required('Password is required'),
        profile_pic: Yup.mixed().required('Profile picture is required'),
      });

      await schema.validate(formData, { abortEarly: false });

      //* api call.
      await fnc();
    } catch (error) {
      const newErrors = {};
      if (error?.inner) {
        error.inner.forEach((err) => {
          newErrors[err.path] = err.message;
        });

        setErrors(newErrors);
      } else {
        setErrors({ api: error.message });
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Signup</CardTitle>
        <CardDescription>Signup to your account</CardDescription>
        {error && <Error message={error.message} />}
      </CardHeader>
      <CardContent className='space-y-2'>
        <div className='space-y-1'>
          <Input
            name='name'
            type='text'
            placeholder='Enter your name'
            onChange={handleInputChange}
          />
          {errors.name && <Error message={errors.name} />}
        </div>
        <div className='space-y-1'>
          <Input
            name='email'
            type='email'
            placeholder='Enter Email'
            onChange={handleInputChange}
          />
          {errors.email && <Error message={errors.email} />}
        </div>
        <div className='space-y-1'>
          <Input
            name='password'
            type='password'
            placeholder='Enter password'
            onChange={handleInputChange}
          />
          {errors.password && <Error message={errors.password} />}
        </div>
        <div className='space-y-1'>
          <Input
            name='profile_pic'
            type='file'
            accept='image/*'
            onChange={handleInputChange}
          />
          {errors.profile_pic && <Error message={errors.profile_pic} />}
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSignup}>
          {loading ? (
            <BeatLoader size={10} color='#36d7b7' />
          ) : (
            'Create Account'
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default Signup;

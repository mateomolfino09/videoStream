import imageLoader from '../../../../../imageLoader';
import axios from 'axios';
import Cookies from 'js-cookie';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { toast } from 'react-toastify';

function EmailVerification() {
  const router = useRouter();

  const { token } = router.query;

  useEffect(() => {
    const cookies: any = Cookies.get('userToken')
  
    if (cookies) {
      router.push('/src/home');
    }
  }, [router]);

  useEffect(() => {
    sendToken(token);
  }, [token]);

  const sendToken = async (token: string | string[] | undefined) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const { data } = await axios.put(`/api/user/email/${token}`, {}, config);
      toast.success(data.message);
    } catch (error: any) {
      toast.error(error?.response?.data?.error);
    }
  };

  return (
    <div className='relative flex h-screen w-screen flex-col bg-black md:items-center md:justify-center md:bg-transparent'>
      <Head>
        <title>Video Streaming</title>
        <meta name='description' content='Stream Video App' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <div className='h-full w-full relative flex flex-col md:items-center md:justify-center'>
        <Image
          src='/images/bgIndex2.jpg'
          layout='fill'
          className='-z-10 !hidden opacity-60 sm:!inline'
          objectFit='cover'
          alt='icon image'
          loader={imageLoader}
        />
        {/* Logo position */}
        <img
          src='/images/logo.png'
          className='absolute left-4 top-4 cursor-pointer object-contain md:left-10 md:top-6 transition duration-500 hover:scale-105'
          width={150}
          height={150}
          alt={'icon img'}
        />
        <div className='relative mt-24 space-y-8 rounded bg-black/75 py-10 px-6 md:mt-0 md:max-w-lg md:px-14'>
          <h1 className='text-4xl font-semibold'>Enhorabuena!</h1>
          <div className='space-y-4'>
            <label className='inline-block w-full'>
              <p>Ya puedes utilizar tu cuenta</p>
            </label>
            <Link href={'/src/user/login'}>
              <button
                type='button'
                className='text-white underline cursor-pointer'
              >
                Ingresar al sitio
              </button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EmailVerification;

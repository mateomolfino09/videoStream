import { LoadingSpinner } from '../../../components/LoadingSpinner';
import imageLoader from '../../../../imageLoader';
import axios from 'axios';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useRef, useState } from 'react';
import ReCAPTCHA from 'react-google-recaptcha';
import { toast } from 'react-toastify';
import Cookies from 'js-cookie';

function Forget() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string | null>(null);
  const router = useRouter();
  const recaptchaRef = useRef<any>();
  const key =
    process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY != undefined
      ? process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY
      : '';

  useEffect(() => {
    const cookies: any = Cookies.get('userToken')
  
    if (cookies) {
      router.push('/src/home');
    }
  }, [router]);

  const onChange = () => {
    if (recaptchaRef.current.getValue()) {
      setCaptchaToken(recaptchaRef.current.getValue());
    } else {
      setCaptchaToken(null);
    }
  };

  const handleSubmit = async (event: any) => {
    event.preventDefault();
    setLoading(true);

    const captcha = captchaToken;
    if (!captcha) {
      toast.error('Error de CAPTCHA, vuelva a intentarlo mas tarde');
      setLoading(false);
      setTimeout(() => {
        window.location.reload();
      }, 4000);
      return;
    }
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const { data } = await axios.post(
        `/api/user/forget`,
        { email, captcha },
        config
      );
      toast.success(data.message);
      router.push('/src/user/login');
    } catch (error: any) {
      toast.error(error?.response?.data?.error);
    }
    setTimeout(() => {
      window.location.reload();
    }, 4000);
    setLoading(false);
  };

  return (
    <div className='relative flex h-screen w-screen flex-col bg-black md:items-center md:justify-center md:bg-transparent'>
      <Head>
        <title>Video Streaming</title>
        <meta name='description' content='Stream Video App' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      {loading && (
        <div
          className={`h-full w-full relative flex flex-col md:items-center md:justify-center`}
        >
          <LoadingSpinner />
        </div>
      )}
      {!loading && (
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
            alt='icon image'
          />
          <div className='relative mt-24 space-y-8 rounded bg-black/75 py-10 px-6 md:mt-0 md:max-w-lg md:px-14'>
            <h1 className='text-4xl font-semibold'>Resetear Contraseña</h1>
            <form className='relative space-y-8 md:mt-0 md:max-w-lg'>
              <div className='space-y-4'>
                <label className='inline-block w-full'>
                  <input
                    type='email'
                    id='email'
                    name='email'
                    placeholder='Email'
                    className='input'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </label>
                <ReCAPTCHA
                  ref={recaptchaRef}
                  sitekey={key}
                  onChange={onChange}
                />
              </div>

              <button
                className='w-full bg-black/10 border border-white rounded-md transition duration-500 hover:bg-black py-3 font-semibold'
                onClick={(e) => handleSubmit(e)}
              >
                Resetear
              </button>
            </form>
            <div className='flex items-start justify-between flex-row'>
              <div className='text-xl md:text-sm'>
                <Link href={'/src/user/login'}>
                  <button
                    type='button'
                    className='text-white hover:underline cursor-pointer'
                  >
                    Volver al Inicio
                  </button>
                </Link>
              </div>
              <div className='text-[gray] text-xl md:text-sm'>
                Eres nuevo en Video Stream?
                <br />
                <Link href={'/src/user/register'}>
                  <button type='button' className='text-white hover:underline'>
                    Crea tu cuenta ahora!
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Forget;

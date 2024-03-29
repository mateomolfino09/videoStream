import { LoadingSpinner } from '../../../components/LoadingSpinner';
import LoginButton from '../../../components/LoginButton';
import imageLoader from '../../../../imageLoader';
import { User } from '../../../../typings';
import axios from 'axios';
import cookie from 'js-cookie';
import { getProviders, getSession } from 'next-auth/react';
import Head from 'next/head';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { parseCookies } from 'nookies';
import React, { MouseEvent, use, useEffect, useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useAuth } from '../../../hooks/useAuth';
import Cookies from 'js-cookie';
import { serialize } from "cookie";

const Login = () => {
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [validateEmail, setValidateEmail] = useState(false);
  const [capsLock, setCapsLock] = useState<boolean>(false);
  const auth = useAuth()
  const router = useRouter();

  useEffect(() => {
    if (typeof window != 'undefined' && document != undefined) {
      document.addEventListener('keydown', testCapsLock);
      document.addEventListener('keyup', testCapsLock);
    }
  }, []);

  function testCapsLock(event: any) {
    if (event.code === 'CapsLock') {
      let isCapsLockOn = event.getModifierState('CapsLock');
      if (isCapsLockOn) {
        setCapsLock(true);
      } else {
        setCapsLock(false);
      }
    }
  }

  useEffect(() => {
    const cookies: any = Cookies.get('userToken')
  
    if (cookies) {
      router.push('/src/home');
    }
  }, [router]);

  const signinUser = async (e: any) => {
    e.preventDefault();
    setLoading(true);

    auth.signIn(email, password).then((res: any) => {
      if(res.type != 'error') {
        toast.success(res.message);
        router.push('/src/home');
      } 
      else toast.error(res.message);
    })


    setLoading(false);
  };

  const resendTokenValidate = async (e: MouseEvent<HTMLButtonElement>) => {
    try {
      e.preventDefault();
      setLoading(true);

      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const { data } = await axios.post(
        '/api/user/resendTokenValidate',
        { email },
        config
      );

      if (data?.message) {
        toast.success(data?.message);
      }

      setValidateEmail(false);
      setLoading(false);
    } catch (error: any) {
      toast.error(error.response.data.error);
    }
    setLoading(false);
  };

  return (
    <div className='relative flex h-screen w-screen flex-col bg-black md:items-center md:justify-center md:bg-transparent overflow-hidden'>
      <Head>
        <title>Video Streaming</title>
        <meta name='description' content='Stream Video App' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      {loading && <LoadingSpinner />}
      {!loading && !validateEmail && (
        <div className='h-full w-full relative flex flex-col md:items-center md:justify-center'>
          <Image
            src='/images/bgIndex2.jpg'
            layout='fill'
            className='-z-10 !hidden opacity-50 sm:!inline h-screen'
            objectFit='cover'
            alt='icon image'
            loader={imageLoader}
          />
          <Link href={'/'}>
            <img
              src='/images/logoWhite.png'
              className='absolute left-4 top-4 cursor-pointer object-contain md:left-10 md:top-6 transition duration-500 hover:scale-105'
              width={150}
              height={150}
              alt='icon image'
            />
          </Link>

          <div className='relative mt-24 mb-4 space-y-8 rounded bg-black/75 py-10 px-6 md:mt-0 md:max-w-lg md:px-10 md:top-12 md:mx-6'>
            <form className='relative space-y-8 md:mt-0 md:max-w-lg'>
              <h1 className='text-4xl font-medium'>
                Te damos la bienvenida a Video Stream!
              </h1>
              <h2 className='text-2xl font-normal'>
                Ingresa tu cuenta para acceder al sitio
              </h2>
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
                <label className='inline-block w-full'>
                  <input
                    name='password'
                    id='password'
                    type='password'
                    placeholder='Password'
                    className='input'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </label>
                <label className='inline-block w-full'>
                  <div className='w-full my-0 relative bottom-2'>
                    <p
                      className={`text-white/80 text-xs font-light ${
                        !capsLock && 'hidden'
                      }`}
                    >
                      Bloq Mayús Activado
                    </p>
                  </div>
                </label>
              </div>

              <button
                className='w-full bg-black/10 border border-white rounded-md transition duration-500 hover:bg-black py-3 font-medium'
                onClick={(e) => signinUser(e)}
              >
                Log In{' '}
              </button>
            </form>
            <div className='flex items-start justify-between flex-row text-center'>
              <div className='text-[gray] text-xl md:text-sm font-normal'>
                Eres nuevo en Video Stream?
                <br />
                <Link href={'/src/user/register'}>
                  <button
                    type='button'
                    className='text-white font-normal hover:underline'
                  >
                    Crea tu cuenta ahora!
                  </button>
                </Link>
              </div>

              <div className='text-[gray] text-xl md:text-sm text-center font-normal'>
                ¿Olvidaste tu contraseña?
                <br />
                <Link href={'/src/user/forget'}>
                  <button
                    type='button'
                    className='text-white hover:underline font-normal'
                  >
                    Recuperar mi cuenta
                  </button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}
      {!loading && validateEmail && (
        <div className='h-full w-full relative flex flex-col md:items-center md:justify-center'>
          <Image
            src='images/bgIndex1.jpg'
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
          <div className='relative mt-24 space-y-8 rounded-md bg-black/75 py-10 px-6 md:mt-0 md:max-w-lg md:px-14'>
            <h1 className='text-4xl font-semibold'>
              No ha confirmado su cuenta aún!
            </h1>
            <div className='space-y-4'>
              <label className='inline-block w-full'>
                <p>¿Desea que volvamos a enviar un email de confirmación?</p>
              </label>
              <button
                className='w-full bg-black/10 border border-white rounded-md transition duration-500 hover:bg-black hover:scale-105 py-3 font-semibold'
                onClick={(e) => resendTokenValidate(e)}
              >
                Volver a Enviar{' '}
              </button>
              <button
                type='button'
                onClick={() => {
                  setValidateEmail(false);
                  window.location.reload();
                }}
                className='text-white underline cursor-pointer mt-4'
              >
                Volver al Inicio
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


export default Login;

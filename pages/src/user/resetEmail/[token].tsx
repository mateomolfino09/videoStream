import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'
import imageLoader from '../../../../imageLoader'
import Head from 'next/head'
import { useDispatch, useSelector } from "react-redux"
import { useRouter } from 'next/router'
import axios from 'axios'
import { toast } from 'react-toastify'

function Token() {
    const [email, setEmail] = useState('')
    const [conEmail, setConEmail] = useState('')
    const router = useRouter()
    const { token } = router.query

    const handleSubmit = async (event: any) => {
      event.preventDefault()
      try {
        const config = {
          headers: {
            "Content-Type": "application/json",
          },
        }
  
        const { data } = await axios.put(
          `/api/user/resetEmail/${token}`,
          { conEmail, email },
          config
        )
        toast.success(data.message)
      } catch (error: any) {
        toast.error(error?.response?.data?.error)
      }
    }

  return (
    <div className='relative flex h-screen w-screen flex-col bg-black md:items-center md:justify-center md:bg-transparent'>
    <Head>
        <title>Video Streaming</title>
        <meta name="description" content="Stream Video App" />
        <link rel="icon" href="/favicon.ico" />
    </Head>
    <div className='h-full w-full relative flex flex-col md:items-center md:justify-center'>
    <Image
        src="https://rb.gy/p2hphi"
        layout="fill"
        className="-z-10 !hidden opacity-60 sm:!inline"
        objectFit="cover"
        alt='icon image'
        loader={imageLoader}
    />
        {/* Logo position */}
    <img
        src="https://rb.gy/ulxxee"
        className="absolute left-4 top-4 cursor-pointer object-contain md:left-10 md:top-6"
        width={150}
        alt='icon image'
        height={150}
    />
    <div className='relative mt-24 space-y-8 rounded bg-black/75 py-10 px-6 md:mt-0 md:max-w-lg md:px-14'>
        <h1 className='text-4xl font-semibold'>Resetear Email</h1>
        <form className='relative space-y-8 md:mt-0 md:max-w-lg'>
        <label className='inline-block w-full'>
                  <input 
                  type="email" 
                  placeholder='Nuevo Email'
                  className='input'
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </label>
              <label className='inline-block w-full'>
                  <input 
                  type="email" 
                  placeholder='Confirmar Email'
                  className='input'
                  value={conEmail}
                  onChange={e => setConEmail(e.target.value)}
                />
              </label>

                    <button className='w-full rounded bg-[#e50914] py-3 font-semibold' onClick={(e) => handleSubmit(e)}>Resetear</button>

                </form>
        <div className='space-y-4'>
            <Link href={"/src/user/login"}> 
            <button type='button' className='text-white underline cursor-pointer'>Volver al Inicio</button>
            </Link>
        </div>
        
    </div>
        </div>
    </div>
  )
}

export default Token
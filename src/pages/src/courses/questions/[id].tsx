import React, { useEffect } from 'react'
import connectDB from '../../../../config/connectDB';
import { getQuestionById } from '../../../api/question/getQuestionById'
import { Question } from '../../../../../typings';
import Head from 'next/head';
import OneQuestion from '../../../../components/Question';
import { useRouter } from 'next/router';
import { useAuth } from '../../../../hooks/useAuth';
import Cookies from 'js-cookie';
import { AiOutlineUser } from 'react-icons/ai';

interface Props {
  question: Question
}

const Index = ({ question }: Props) => {
  console.log(question)

  const router = useRouter();
  const auth = useAuth()

  const handleRouteChange = async (route: string) => {
    router.push(route);
  };

  useEffect(() => {

    const cookies: any = Cookies.get('userToken')
    
    if (!cookies) {
      router.push('/src/user/login');
    }
    
    if(!auth.user) {
      auth.fetchUser()
    }

  }, [auth.user]);

  return (
    <div>      
      <Head>
        <title>Video Streaming</title>
        <meta name='description' content='Stream Video App' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <header className={`bg-dark`}>
        <div onClick={() => handleRouteChange('/src/home')}>
          <img
            alt='Logo Video Stream'
            src='/images/logoWhite.png'
            width={80}
            height={80}
            className='cursor-pointer object-contain transition duration-500 hover:scale-105 opacity-70 hover:opacity-90'
          />
        </div>
        <AiOutlineUser className='h-6 w-6 cursor-pointer' />
      </header>
      <OneQuestion user={auth.user} question={question} />
  </div>
  )
}

export async function getServerSideProps(context: any) {
    connectDB();
    const { params, req } = context;
    const { id } = params;
    const question = await getQuestionById(id);
  
    return {
      props: { question }
    };
  }

export default Index


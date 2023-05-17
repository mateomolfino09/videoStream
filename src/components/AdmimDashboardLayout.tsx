import { useAppDispatch } from '../hooks/useTypeSelector';
import { State } from '../redux/reducers';
import { loadUser } from '../redux/user/userAction';
import { User } from '../../typings';
import AdminDashboardSideBar from './AdminDashboardSideBar';
import AdminDashboardTopBar from './AdminDashboardTopBar';
import { Transition } from '@headlessui/react';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { parseCookies } from 'nookies';
import React, { Fragment, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

interface Props {
  children: any;
}

const AdmimDashboardLayout = ({ children }: Props) => {
  const [showNav, setShowNav] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const cookies = parseCookies();
  const { data: session } = useSession();
  const router = useRouter();

  const dispatch = useAppDispatch();
  const profile = useSelector((state: State) => state.profile);
  const { loading, error, dbUser } = profile;

  const user: User = dbUser
    ? dbUser
    : cookies?.user
    ? JSON.parse(cookies.user)
    : session?.user
    ? session?.user
    : '';

  function handleResize() {
    if (innerWidth <= 640) {
      setShowNav(false);
      setIsMobile(true);
    } else {
      setShowNav(true);
      setIsMobile(false);
    }
  }

  useEffect(() => {
    if (typeof window !== 'undefined') {
      addEventListener('resize', handleResize);
    }

    return () => {
      removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <div className=''>
      <AdminDashboardTopBar
        showNav={showNav}
        setShowNav={setShowNav}
        dbUser={dbUser}
      />
      <Transition
        as={Fragment}
        show={showNav}
        enter='transform transition duration-[400ms]'
        enterFrom='-translate-x-full'
        enterTo='translate-x-0'
        leave='transform duration-[400ms] transition ease-in-out'
        leaveFrom='translate-x-0'
        leaveTo='-translate-x-full'
      >
        <AdminDashboardSideBar />
      </Transition>
      <main
        className={`bg-gray-700 rounded-sm h-full pt-16 transition-all duration-[400ms] ${
          showNav && !isMobile ? 'pl-56' : ''
        }`}
      >
        <div className='flex flex-col justify-center items-center px-4 md:px-16 rounded-sm h-full w-full'>
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdmimDashboardLayout;
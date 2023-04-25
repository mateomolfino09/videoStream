import { MagnifyingGlassIcon, BellIcon, Cog8ToothIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { Fragment, RefObject, useContext, useEffect, useState } from "react";
import { signOut, useSession } from "next-auth/react";
import { parseCookies } from "nookies";
import cookie from "js-cookie";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { loadUser } from "../redux/user/userAction";
import { State } from "../redux/reducers";
import { useAppDispatch } from "../hooks/useTypeSelector";
import { Notification, User } from "../typings";
import { Menu, Transition, Popover } from "@headlessui/react";
import {AiOutlineUser} from 'react-icons/ai'
import { CheckIcon } from "@heroicons/react/24/solid";
import { UserContext } from "../hooks/userContext";
import axios from "axios";


const Header = ({ scrollToList, scrollToModa, scrollToNuevo, scrollToMy, dbUser }: any) => {

  interface ProfileUser {
    user: User | null;
    loading: boolean;
    error: any;
  }

  interface Props {
    email: String;
    user: User;
  }

  const cookies = parseCookies();
  const { data: session } = useSession();
  const router = useRouter();
  const [userState, setUserState] = useState<any>(null); 
  const [isScrolled, setIsScrolled] = useState(false);
  const {userCtx, setUserCtx} = useContext( UserContext )
  const [notificationList, setNotificationList] = useState<null | Notification[]>(null)

  const user: User = dbUser
    ? dbUser
    : cookies?.user
    ? JSON.parse(cookies.user)
    : session?.user
    ? session?.user
    : "";

    const checkReadNotis = async () => {
      const config = {
        headers: {
          "Content-Type": "application/json",
        },
    }
    const notifications = userCtx.notifications.filter((x: Notification) => !x.read).slice(-5)
    const userId = userCtx?._id
      try {
        const { data } = await axios.put('/api/user/notifications/checkAsRead', { userId }, config)
        // setListCourse([...listCourse, course])
        setUserCtx(data)
        setNotificationList(data.notifications.filter((x: Notification) => !x.read).slice(-5))
  
      } catch (error) {
        console.log(error)
      }
  
    }

    useEffect(() => {
      userCtx != null ?  setNotificationList(userCtx?.notifications.filter((x: Notification) => !x.read).slice(-5)) : null
    }, [userCtx])

  useEffect(() => {
    session ? setUserState(session.user) : setUserState(user);

    const handleScroll = () => {
      if (window.scrollY > 0) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [router]);

  function scrollToHome() {
    if(window) {
      const y = 0;
  
      window.scrollTo({top: y, behavior: 'smooth'});
      return
      // return refToModa?.current.scrollIntoView({behavior: 'smooth'})
    }
  }

  return (
    <header className={`${isScrolled && "bg-[#141414]"}`}>
      <div className="flex items-center space-x-2 md:space-x-10">
        <Link href={'/'}>
        <img
          alt='icon image'
          src="/images/logoWhite.png"
          width={100}
          height={100}
          className="cursor-pointer object-contain transition duration-500 hover:scale-105 opacity-90 hover:opacity-100"
        />
        </Link>

        <ul className="hidden space-x-4 md:flex">
        <li className="headerLink" onClick={scrollToHome}>Home</li>
        {scrollToModa != null ? <li onClick={scrollToModa} className="headerLink">Cursos</li> : <Link href={'/src/home'}><li className="headerLink">Cursos</li></Link>}
        {scrollToNuevo != null ? <li onClick={scrollToNuevo} className="headerLink">Nuevo</li> : <Link href={'/src/home'}><li className="headerLink">Nuevo</li></Link>}
        {scrollToList != null ? <li onClick={scrollToList} className="headerLink">Mi Lista</li> : <Link href={'/src/home'}><li className="headerLink">Mi Lista</li></Link>}
        {scrollToMy != null ? <li onClick={scrollToMy} className="headerLink">Mis Cursos</li> : <Link href={'/src/home'}><li className="headerLink">Mis Cursos</li></Link>}
        
        </ul>
      </div>
      <div className="flex items-center space-x-4 text-sm font-light">
      { user?.rol === 'Admin' ? (
            <>
            <Link href={'/src/admin'}>
              <Cog8ToothIcon className="h-6 w-6 inline cursor-pointer" />
            </Link>
            </>
          ) : null
          }
        <MagnifyingGlassIcon className="hidden h-6 w-6 sm:inline cursor-pointer" />
        <p className="hidden lg:inline">Mis cursos</p>
        <Popover>
          <Popover.Button className='outline-none cursor-pointer text-white'>
          <BellIcon className="h-6 w-6 cursor-pointer" />
          </Popover.Button>
          <Transition
            enter="transition ease-out duration-100"
            enterFrom="transform scale-95"
            enterTo="transform scale-100"
            leave="transition ease-in duration=75"
            leaveFrom="transform scale-100"
            leaveTo="transform scale-95"
          >
            <Popover.Panel className="absolute -right-16 sm:right-4 z-50 mt-2 bg-white shadow-sm rounded max-w-xs sm:max-w-sm w-screen">
              <div className="relative p-3">
                <div className="flex justify-between items-center w-full">
                  <p className="text-gray-700 font-medium">Notificaciones</p>
                  <a className="text-sm text-black underline" href="#" onClick={checkReadNotis}>
                    Marcar como leidos
                  </a>
                </div>
                
                <div className="mt-4 grid gap-4 grid-cols-1 overflow-hidden">
                  
                  {userCtx?.notifications && notificationList && notificationList.length > 0 ? (
                    <>
                    {notificationList.map((notification: Notification) => (
                              <>
                                <div className="flex">
                                <div className={`rounded-full shrink-0 ${notification.status === 'green' ? 'bg-green-200' : notification.status === 'red' ? 'bg-red-500' : 'bg-yellow-200'} h-8 w-8 flex items-center justify-center`}>
                                  <CheckIcon className={`h-4 w-4 `} />
                                </div>
                                <div className="ml-4">
                                  <p className="font-medium text-gray-700">
                                    {notification.title}
                                  </p>
                                  <p className="text-sm text-gray-500 truncate break-all whitespace-normal">
                                  {notification.message}
                                  </p>

                                  {notification.link && notification.link != '' ? (
                                    <a href={notification.link} className="text-sm text-gray-500 truncate break-all whitespace-normal underline">link</a>
                                    ) : null} 
                                </div>
                              </div>
                              </>
                    ))}
                    </>


                  ) : (
                    <div className="flex">
                    <div className="ml-4">
                      <p className="font-medium text-gray-700">
                        No hay Notificaciones por el momento
                      </p>
                    </div>
                  </div>
                  )
                }

                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </Popover>
        {/* <Link href="/account"> */}
        <Link href={'user/account'}>
            <AiOutlineUser className="h-6 w-6 cursor-pointer"/>
        </Link>

        {/* </Link> */}
      </div>
    </header>
  );
};

export default Header;

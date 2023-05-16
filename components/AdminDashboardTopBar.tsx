import { Fragment, useContext, useState } from "react";
import {
  Bars3CenterLeftIcon,
  PencilIcon,
  ChevronDownIcon,
  CreditCardIcon,
  Cog8ToothIcon,
} from "@heroicons/react/24/solid";
import { BellIcon, CheckIcon } from "@heroicons/react/24/outline";
import { Menu, Transition, Popover } from "@headlessui/react";
import Link from "next/link";
import { Notification, User } from "../typings";
import { UserContext } from "../hooks/userContext";
import { AiOutlineUser } from "react-icons/ai";
import axios from "axios";

interface Props {
  showNav: any;
  setShowNav: any;
  dbUser: User | null;
}

const AdminDashboardTopBar = ({ showNav, setShowNav }: Props) => {
  const { userCtx, setUserCtx } = useContext(UserContext);
  const [notificationList, setNotificationList] = useState(
    userCtx.notifications.filter((x: Notification) => !x.read).slice(-5)
  );

  const checkReadNotis = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const notifications = userCtx.notifications
      .filter((x: Notification) => !x.read)
      .slice(-5);
    const userId = userCtx?._id;
    try {
      const { data } = await axios.put(
        "/api/user/notifications/checkAsRead",
        { userId },
        config
      );
      // setListCourse([...listCourse, course])
      setUserCtx(data);
      setNotificationList(
        data.notifications.filter((x: Notification) => !x.read).slice(-5)
      );
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      className={`bg-gray-100 fixed w-full h-16 flex justify-between items-center transition-all duration-[400ms] z-10 ${
        showNav ? "pl-56" : ""
      }`}
    >
      <div className="pl-4 md:pl-16">
        <Bars3CenterLeftIcon
          className="h-8 w-8 text-gray-700 cursor-pointer"
          onClick={() => setShowNav(!showNav)}
        />
      </div>
      <div className="flex items-center pr-4 md:pr-16">
        <Popover>
          <Popover.Button className="outline-none mr-5 md:mr-8 cursor-pointer text-gray-700">
            <BellIcon className="h-6 w-6" />
          </Popover.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform scale-95"
            enterTo="transform scale-100"
            leave="transition ease-in duration=75"
            leaveFrom="transform scale-100"
            leaveTo="transform scale-95"
          >
            <Popover.Panel className="absolute  z-50 -ml-52 sm:-ml-72 md:-ml-16 mt-2 bg-white shadow-sm rounded max-w-xs sm:max-w-sm w-screen">
              <div className="  relative p-3 ">
                <div className="flex justify-between items-center w-full">
                  <p className="text-gray-700 font-medium">Notificaciones</p>
                  <a
                    className="text-sm text-orange-500"
                    href="#"
                    onClick={checkReadNotis}
                  >
                    Marcar como leidos
                  </a>
                </div>

                <div className="mt-4 grid gap-4 grid-cols-1 overflow-hidden">
                  {userCtx?.notifications && notificationList.length > 0 ? (
                    <>
                      {notificationList.map((notification: Notification) => (
                        <div className="flex" key={notification.title}>
                          <div
                            className={`rounded-full shrink-0 ${
                              notification.status === "green"
                                ? "bg-green-200"
                                : notification.status === "red"
                                ? "bg-red-500"
                                : "bg-yellow-200"
                            } h-8 w-8 flex items-center justify-center`}
                          >
                            <CheckIcon className={`h-4 w-4 `} />
                          </div>
                          <div className="ml-4">
                            <p className="font-medium text-gray-700">
                              {notification.title}
                            </p>
                            <p className="text-sm text-gray-500 truncate break-all whitespace-normal">
                              {notification.message}
                            </p>
                          </div>
                        </div>
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
                  )}
                </div>
              </div>
            </Popover.Panel>
          </Transition>
        </Popover>
        <Menu as="div" className="relative inline-block text-left">
          <div>
            <Menu.Button className="inline-flex w-full justify-center items-center">
              <AiOutlineUser className=" cursor-pointer text-black rounded h-6 w-6 md:mr-2 border-2 border-white shadow-sm" />
              <span className="hidden md:block font-medium text-gray-700">
                {userCtx?.name}
              </span>
              <ChevronDownIcon className="ml-2 h-4 w-4 text-gray-700" />
            </Menu.Button>
          </div>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform scale-95"
            enterTo="transform scale-100"
            leave="transition ease-in duration=75"
            leaveFrom="transform scale-100"
            leaveTo="transform scale-95"
          >
            <Menu.Items className="absolute right-0 w-56 z-50 mt-2 origin-top-right bg-white rounded shadow-sm">
              <div className="p-1">
                <Menu.Item>
                  <Link
                    href="#"
                    className="flex hover:bg-orange-500 hover:text-white text-gray-700 rounded p-2 text-sm group transition-colors items-center"
                  >
                    <PencilIcon className="h-4 w-4 mr-2" />
                    Editar
                  </Link>
                </Menu.Item>
                <Menu.Item>
                  <Link
                    href="/src/admin/billing"
                    className="flex hover:bg-orange-500 hover:text-white text-gray-700 rounded p-2 text-sm group transition-colors items-center"
                  >
                    <CreditCardIcon className="h-4 w-4 mr-2" />
                    Facturas
                  </Link>
                </Menu.Item>
                <Menu.Item>
                  <Link
                    href="#"
                    className="flex hover:bg-orange-500 hover:text-white text-gray-700 rounded p-2 text-sm group transition-colors items-center"
                  >
                    <Cog8ToothIcon className="h-4 w-4 mr-2" />
                    Configuración
                  </Link>
                </Menu.Item>
              </div>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
    </div>
  );
};

export default AdminDashboardTopBar;

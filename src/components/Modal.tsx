import { CourseListContext } from '../hooks/courseListContext';
import { useAppDispatch,  useAppSelector} from '../redux/hooks';
import { UserContext } from '../hooks/userContext';
import { loadCourse, closeCourse } from '../redux/features/courseModalSlice'; 
import { Courses, CoursesDB, Item, User } from '../../typings';
import requests from '../utils/requests';
import Row from './Row';
import {
  HandThumbUpIcon,
  PlusCircleIcon,
  PlusIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';
import MuiModal from '@mui/material/Modal';
import axios from 'axios';
import Link from 'next/link';
import {
  Dispatch,
  SetStateAction,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';
import ReactCanvasConfetti from 'react-canvas-confetti';
import toast, { Toaster } from 'react-hot-toast';
import {
  AiFillPlusCircle,
  AiOutlineCheckCircle,
  AiOutlineMinusCircle,
  AiOutlinePlusCircle,
  AiOutlineShoppingCart
} from 'react-icons/ai';
import {
  FaPlay,
  FaThumbsUp,
  FaVolumeMute,
  FaVolumeOff,
  FaVolumeUp
} from 'react-icons/fa';
import { HiHandThumbUp, HiOutlineHandThumbUp } from 'react-icons/hi2';
import { MdAdd, MdOutlineClose, MdRemove } from 'react-icons/md';
import { TbLockOpenOff } from 'react-icons/tb';
import ReactPlayer from 'react-player/lazy';
import { toast as toaster } from 'react-toastify';
import { useAuth } from '../hooks/useAuth';
import { useRouter } from 'next/router';
import Cookies from 'js-cookie';
import {useLoadCourseQuery} from '../redux/services/courseModalApi'

interface Props {
  courseDB: CoursesDB | null;
  user: User | null;
}

interface UserProps {
  dbUser: User;
}

const notify = (message: String, agregado: boolean, like: boolean) =>
  toast.custom(
    (t) => (
      <div
        className={`${
          like ? 'notificationWrapperLike' : 'notificationWrapper'
        } ${t.visible ? 'top-0' : '-top-96'}`}
      >
        <div className={'iconWrapper'}>
          {agregado ? <AiOutlineCheckCircle /> : <AiOutlineMinusCircle />}
        </div>
        <div className={`contentWrapper`}>
          <h1>{message}</h1>
          {like ? (
            <p>Le has dado {message} a este curso</p>
          ) : (
            <p>Este curso ha sido {message} exitosamente</p>
          )}
        </div>
        <div className={'closeIcon'} onClick={() => toast.dismiss(t.id)}>
          <MdOutlineClose />
        </div>
      </div>
    ),
    { id: 'unique-notification', position: 'top-center' }
  );

function Modal({ courseDB, user }: Props) {
  const youtubeURL = `${requests.playlistYTAPI}?part=snippet&playlistId=${courseDB?.playlist_code}&maxResults=50&key=${process.env.NEXT_PUBLIC_YOUTUBE_API_KEY}`;
  const [items, setItems] = useState<Item[] | null>(null);
  const [url, setUrl] = useState<string | null>(null);
  const [like, setLike] = useState<boolean>(false);
  const [list, setList] = useState<boolean>(false);
  const [actualCourseIndex, setActualCourseIndex] = useState<number>(0);
  const [courseIndex, setCourseIndex] = useState<number>(0);
  const { listCourse, setListCourse } = useContext(CourseListContext);
  const auth = useAuth()
  const router = useRouter()

  const {data, error, isLoading, isFetching } = useLoadCourseQuery(null)

  useEffect(() => {
    const cookies: any = Cookies.get('userToken')
    
    if (!cookies) {
      router.push('/src/user/login');
    }
    
    if(!auth.user) {
      auth.fetchUser()
    }

  }, [auth.user]);

  const addCourseToList = async () => {
    const courseId = courseDB?.id;
    const userId = user?._id;
    notify('Agregado a la Lista', true, false);
    auth.addCourseToList(courseId, userId)
    setListCourse([...listCourse, courseDB]);
  };

  const removeCourseToList = async () => {
    const courseId = courseDB?.id;
    const userId = user?._id;
      notify('Eliminado de la Lista', false, false);
      setListCourse([
        ...listCourse.filter((value: CoursesDB) => value.id != courseDB?.id)
      ]);
      auth.deleteCourseFromList(courseId, userId)
  };
  
  const course: any = useAppSelector(
    (state: any) => state.courseModalReducer
  );
  let { activeModal } = course;
  const dispatch = useAppDispatch();
  const indexCourse = user?.courses.findIndex((element: any) => {
    return element.course.valueOf() === courseDB?._id;
  });

  const [muted, setMuted] = useState(false);

  useEffect(() => {
    if (!courseDB) return;
    let courseInCourseIndex = user?.courses.findIndex((x) => {
      return x.course.valueOf() === courseDB._id.valueOf();
    });
    courseInCourseIndex && setCourseIndex(courseInCourseIndex);
    courseInCourseIndex != null
      ? setActualCourseIndex(
          user?.courses[courseInCourseIndex].actualChapter
            ? user?.courses[courseInCourseIndex].actualChapter - 1
            : 0
        )
      : null;

    const getCourseInfo = async () => {
      try {
        const config = {
          headers: {
            'Content-Type': 'application/json'
          }
        };
        let { data } = await axios.post(
          '/api/course/getCourseInfo',
          { youtubeURL },
          config
        );
        courseInCourseIndex != null
          ? setUrl(
              user?.courses[courseInCourseIndex].actualChapter
                ? `https://www.youtube.com/embed/${
                    data.items[
                      user?.courses[courseInCourseIndex].actualChapter - 1
                    ].snippet.resourceId.videoId
                  }?rel=0`
                : ''
            )
          : null;
        setItems(data.items);
      } catch (error: any) {
        console.log(error.message);
      }
    };
    getCourseInfo();
    indexCourse != undefined && auth.user.courses[indexCourse].like
      ? setLike(true)
      : null;
    indexCourse != undefined && auth.user.courses[indexCourse].inList
      ? setList(true)
      : null;
  }, []);

  useEffect(() => {}, [auth.user]);

  const handleClose = () => {
    dispatch(closeCourse());
  };

  const handleLike = async () => {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const courseId = courseDB?.id;
    const userId = user?._id;

    if (!like) {
      setLike(true);
      const { data } = await axios.put(
        '/api/user/course/likeCourse',
        { courseId, userId },
        config
      );
    } else {
      setLike(false);
      const { data } = await axios.put(
        '/api/user/course/dislikeCourse',
        { courseId, userId },
        config
      );
      toaster.success(data.message);
    }
  };

  const handleAddToList = async () => {
    if (!list) {
      // courseDB ? setListFunc(courseDB, list) : null
      await addCourseToList();
    } else {
      await removeCourseToList();
    }
  };

  return (
    <MuiModal
      open={activeModal}
      onClose={handleClose}
      className='fixed !top-7 left-0 right-0 z-50 mx-auto w-full max-w-5xl overflow-hidden overflow-y-scroll rounded-md scrollbar-hide bg-[#181818]'
    >
      <>
        <button
          onClick={handleClose}
          className='modalButton absolute -right-2 top-2 !z-40 h-9 w-9 border-none'
        >
          <XCircleIcon className='h-6 w-6' />
        </button>

        <div className='relative pt-[56.25%] bg-gradient-to-b react-player'>
          <ReactPlayer
            url={url?.toString()}
            width='100%'
            height='100%'
            style={{ position: 'absolute', top: '0', left: '0 ' }}
            playing
            muted={muted}
          />
          <div className='absolute bottom-10 flex w-full items-center justify-between px-10'>
            <div className='flex space-x-2'>
              {!auth.user?.courses[
                auth.user?.courses.findIndex((x: any) => {
                  return x.course.valueOf() === courseDB?._id.valueOf();
                })
              ].purchased ? (
                <Link href={`/src/courses/purchase/${courseDB?.id}`}>
                  <button className='flex items-center gap-x-2 rounded bg-white px-8 text-xl font-bold py-1 text-black transition hover:bg-[#e6e6e6]'>
                    {' '}
                    <AiOutlineShoppingCart className='h-7 w-7 text-black' />
                    Obtener
                  </button>
                </Link>
              ) : (
                <>
                  <Link
                    href={
                      indexCourse != undefined
                        ? `/src/courses/${courseDB?.id}/${auth.user?.courses[indexCourse].actualChapter}`
                        : `/src/courses/${courseDB?.id}/1`
                    }
                  >
                    <button className='flex items-center gap-x-2 rounded bg-white px-8 text-xl font-bold py-1 text-black transition hover:bg-[#e6e6e6]'>
                      {' '}
                      <FaPlay className='h-7 w-7 text-black' />
                      Ver
                    </button>
                  </Link>
                </>
              )}
              <div className='cursor-pointer w-8 h-8 bg-transparent border-white  border rounded-full flex justify-center items-center transition  ml-2'>
                {!auth.user?.courses[courseIndex].inList ? (
                  <MdAdd
                    className=' text-white w-6 h-6'
                    onClick={() => addCourseToList()}
                  />
                ) : (
                  <MdRemove
                    className=' text-white w-6 h-6'
                    onClick={() => removeCourseToList()}
                  />
                )}
              </div>
            </div>
            <button
              className='modalButton'
              onClick={() => {
                setMuted(!muted);
              }}
            >
              {muted ? (
                <FaVolumeMute className='h-6 w-6' />
              ) : (
                <FaVolumeUp className='h-6 w-6' />
              )}
            </button>
          </div>
        </div>

        <div className='flex space-x-16 rounded-b-md bg-[#181818] px-10 py-10'>
          <div className='space-y-6 text-lg'>
            <div className='flex items-center space-x-2 text-sm'>
              <p className='font-semibold text-green-400'>100% Match</p>
              <p className='font-light'>
                {items != null
                  ? new Date(items[0].snippet.publishedAt)
                      .getFullYear()
                      .toString()
                  : ''}
              </p>
              <div className='flex h-4 items-center justify-center rounded border border-white/40 px-1.5 text-xs '>
                HD
              </div>
              {!auth.user?.courses[courseIndex].purchased && (
                <div className='flex h-4 items-center justify-center rounded border border-white/40 px-1.5 text-xs '>
                  <TbLockOpenOff />
                </div>
              )}
            </div>
            <div className='flex flex-col gap-x-10 gap-y-4 font-light md:flex-row '>
              <p className='w-5/6 text-sm leading-6'>{courseDB?.description}</p>
              <div className='flex flex-col space-y-3 text-sm'>
                <div>
                  <span className='text-[gray]'>Generos: </span>
                  Peluqueria
                </div>

                <div>
                  <span className='text-[gray]'>Idioma Original: </span>
                  en
                </div>
              </div>
            </div>
            <h1 className='pt-12 text-2xl'>Episodios</h1>
          </div>
        </div>
        <div className='flex space-x-16 rounded-b-md bg-[#181818]'>
          <Row
            items={items}
            courseDB={courseDB}
            title={items != null ? items[0].snippet.title : ''}
            coursesDB={null}
            setSelectedCourse={null}
            actualCourseIndex={actualCourseIndex}
            setRef={null}
            isClass={false}
            user={user}
            courseIndex={courseIndex}
          />
        </div>
        <Toaster />
      </>
    </MuiModal>
  );
}

export default Modal;

import { CoursesContext } from '../hooks/coursesContext';
import { loadCourse, closeCourse } from '../redux/features/courseModalSlice'; 
import { Courses, CoursesDB, Item, Ricks, User } from '../../typings';
import CourseThumbnail from './CourseThumbnail';
import Thumbnail from './Thumbnail';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { motion as m } from 'framer-motion';
import Link from 'next/link';
import {
  Dispatch,
  RefObject,
  SetStateAction,
  useContext,
  useEffect,
  useRef,
  useState
} from 'react';
import { useAppSelector } from '../redux/hooks';

interface Props {
  title: string | null;
  coursesDB: CoursesDB[] | null;
  setSelectedCourse: Dispatch<SetStateAction<CoursesDB | null>> | null;
  items: Item[] | null;
  courseDB: CoursesDB | null;
  actualCourseIndex: number;
  setRef: any;
  isClass: boolean;
  user: User | null;
  courseIndex: number;
}

function Row({
  title,
  coursesDB,
  setSelectedCourse,
  items,
  courseDB,
  actualCourseIndex,
  setRef,
  isClass,
  user,
  courseIndex
}: Props) {
  const rowRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [isMoved, setIsMoved] = useState(false);
  const course: any = useAppSelector(
    (state: any) => state.courseModalReducer
  );
  let { activeModal } = course;
  const [overflow, setOverflow] = useState('hidden');
  const { courses, setCourses } = useContext(CoursesContext);

  const handleClick = (direction: string) => {
    setIsMoved(true);

    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;

      const scrollTo =
        direction === 'left'
          ? scrollLeft - clientWidth
          : scrollLeft + clientWidth;

      rowRef.current.scrollTo({ left: scrollTo, behavior: 'smooth' });
    }
  };

  useEffect(() => {
    if (rowRef != null && setRef != null) setRef(rowRef);
  }, []);

  return (
    <div
      className='h-80 lg:h-80 space-y-0.5 md:space-y-2 w-full !mb-12 py-8'
      ref={rowRef}
    >
      {!activeModal && !isClass ? (
        <>
          <h2 className='w-56 md:ml-4 relative cursor-pointer text-lg font-semibold text-[#E5E5E5] transition duration-200 hover:text-white md:text-2xl mb-4 ml-1'>
            {title}
          </h2>
          <div className='group block md:-ml-2'>
            <ChevronLeftIcon
              className={`ScrollIcon left-2 ${!isMoved && 'hidden'}`}
              onClick={() => handleClick('left')}
            />
            <div className='h-42 lg:h-72 lg:pb-0 scrollbar-hide flex items-center justify-start md:-top-0 space-x-0 overflow-y-hidden overflow-x-scroll md:space-x-2.5 md:p-2 relative'>
              {/* {coursesDB?.map((course: CoursesDB) => (
                                <Thumbnail key={course?._id} course={course} setSelectedCourse={setSelectedCourse} user={user} courseIndex={course.id - 1}/>
              ))} */}
            </div>

            <ChevronRightIcon
              className={`ScrollIcon right-2`}
              onClick={() => handleClick('right')}
            />
          </div>
        </>
      ) : (
        <>
          <div className='group relative w-full'>
            <div
              ref={rowRef}
              className='scrollbar-hide flex flex-col items-center space-y-12 bg-[#181818]'
            >
              <CourseThumbnail
                items={items}
                course={courseDB}
                actualClassIndex={actualCourseIndex}
                isClass={isClass}
                user={user}
                courseIndex={courseIndex}
              />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Row;

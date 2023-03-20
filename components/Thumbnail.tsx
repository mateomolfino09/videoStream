import { CldImage } from 'next-cloudinary'
import Image from 'next/image'
import React, { Dispatch, SetStateAction, useContext, useEffect, useState } from 'react'
import { useAppDispatch } from '../hooks/useTypeSelector'
import imageLoader from '../imageLoader'
import { loadCourse } from '../redux/courseModal/courseModalAction'
import { CoursesDB, Ricks, User } from '../typings'
import { MdBlock, MdOutlineClose, MdRemove } from 'react-icons/md'
import { ChevronDownIcon, PlayIcon } from '@heroicons/react/24/solid'
import zIndex from '@mui/material/styles/zIndex'
import { MdAdd } from 'react-icons/md'
import { CourseListContext } from '../hooks/courseListContext'
import { AiOutlineCheckCircle, AiOutlineMinusCircle } from 'react-icons/ai'
import { toast, Toaster } from 'react-hot-toast'
import axios from 'axios'
import { CoursesContext } from '../hooks/coursesContext'

interface Props {
  course: CoursesDB,
  setSelectedCourse: Dispatch<SetStateAction<CoursesDB | null>> | null
  user: User | null
  courseIndex: number
  //Firebase
    // character: Ricks | DocumentData[]
} 

const notify = ( message: String, agregado: boolean, like: boolean ) =>
  toast.custom(
    (t) => (
      <div
        className={`${like ? 'notificationWrapperLike' : 'notificationWrapper'} ${t.visible ? "top-0" : "-top-96"}`}
      >
        <div className={'iconWrapper'}>
        {agregado ? <AiOutlineCheckCircle /> : <AiOutlineMinusCircle />}

        </div>
        <div className={`contentWrapper`}>
          <h1>{message}</h1>
          {like ? (<p>
            Le has dado {message} a este curso

          </p>) : (
            <p >
            Este curso ha sido {message} exitosamente   

          </p>
          )}

        </div>
        <div className={'closeIcon'} onClick={() => toast.dismiss(t.id)}>
          <MdOutlineClose />
        </div>
      </div>
    ),
    { id: "unique-notification", position: "top-center" }
  );


function Thumbnail({ course, setSelectedCourse , user, courseIndex}: Props) {
  const dispatch = useAppDispatch()
  const courseUser = user?.courses[courseIndex]
  const [ zIndex, setZIndex ] = useState(0)
  const [ list, setList ] = useState(courseUser?.inList)
  const {listCourse, setListCourse} = useContext( CourseListContext )

  const addCourseToList = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
  }
  const courseId = course?.id
  const userId = user?._id
    try {
      const { data } = await axios.put('/api/user/course/listCourse', { courseId, userId }, config)
      setListCourse([...listCourse, course])
      notify('Agregado a la Lista', true, false)
      setList(!list)

    } catch (error) {
      console.log(error)
    }

  }
  const removeCourseToList = async () => {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
  }
  console.log(user)
  const courseId = course?.id
  const userId = user?._id
    try {
      const { data } = await axios.put('/api/user/course/dislistCourse', { courseId, userId }, config)
  
      setListCourse([...listCourse.filter((value: CoursesDB) => value.id != course?.id)])
  
      notify('Eliminado de la Lista', false, false)
      setList(!list)
    } catch (error) {
      
    }


  }



  const handleOpen = () => {
    dispatch(loadCourse());
    if(setSelectedCourse != null) setSelectedCourse(course)
  }

  // const styles = {
  //   zIndex: 1000,
  // };

  return (
    <div onMouseEnter={(e) => setZIndex(1000)} onMouseLeave={() => {
      setTimeout(() => {
        setZIndex(0)
      }, 500)
      return
    }} style={{zIndex: zIndex}} className={`group/item relative h-28 min-w-[180px] cursor-pointer transition duration-1000 ease-out md:h-36 md:min-w-[260px] md:hover:scale-105 overflow-visible`}>
        <CldImage 
            src={course?.image_url} 
            preserveTransformations
            layout="fill"
            className={`rounded-sm object-cover md:rounded cursor-pointer transition duration-200 delay-300 group-hover/item:opacity-90 sm:group-hover/item:opacity-0 z-0`}
            alt={course?.name}
            loader={imageLoader}
            onClick={handleOpen}
            />
            <div className={`absolute opacity-0 top-0 h-full w-full transition duration-200 sm:visible invisible delay-300 group-hover/item:scale-105 group-hover/item:-translate-y-[6vw] group-hover/item:translate-x-[1vw] group-hover/item:opacity-100`}>
              <CldImage 
              src={course?.image_url} 
              preserveTransformations
              layout="fill"
              className='rounded-sm object-cover md:rounded cursor-pointer
              transition
              duration-200
              shadow-xl z-[200]'
              alt={course?.name}
              loader={imageLoader}
              onClick={handleOpen}
              />
              <div className='
                z-[100]
                darkGray
                p-2
                lg:p-4
                flex
                flex-col
                w-full
                h-56
                absolute
                transition
                shadow-md
                rounded-b-md
                justify-end
                items-start'>
                  <div className='h-1/4 w-full bg-black'>

                  </div>
                  <div className='h-1/4 w-full'>

                  </div>
                  <div className='h-1/2 w-full z-[100]'>
                  <div className="flex flex-row items-center mt-10">
                  <div className="cursor-pointer w-4 h-4 lg:w-6 lg:h-6 bg-white rounded-full flex justify-center items-center transition hover:bg-neutral-300 ">
                    <PlayIcon className="text-black w-4 h-4 lg:w-4 lg:h-4" onClick={handleOpen}
/>
                  </div>
                  <div className="cursor-pointer w-4 h-4 lg:w-6 lg:h-6 bg-transparent border-white  border rounded-full flex justify-center items-center transition  ml-2">
                    {!list ? (
                      <MdAdd className=" text-white w-4 h-4 lg:w-4 lg:h-4" onClick={() => addCourseToList()}/>
                    ) : (
                      <MdRemove className=" text-white w-4 h-4 lg:w-4 lg:h-4" onClick={() => removeCourseToList()}/>
                    )}
                  </div>
                  <div className="cursor-pointer ml-auto group/item w-4 h-4 lg:w-6 lg:h-6 border-white border rounded-full flex justify-center items-center transition hover:border-neutral-300">
                    <ChevronDownIcon className="text-white group-hover/item:text-neutral-300 w-4 lg:w-4" onClick={handleOpen}
/>
                  </div>
                </div>
                <div className="flex flex-row mt-0 lg:mt-4 gap-2 items-center"> 
            <p className="text-white text-[10px] lg:text-sm">{course?.name}</p>
          </div>
                  </div>
              </div>
            </div>
      </div>
  )
}

export default Thumbnail
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { ClassesDB, CoursesDB, Item } from '../typings'
import Row from './Row'


interface Props {
    clase: ClassesDB
    youtubeURL: string
    courseDB: CoursesDB
}

const ClassDescription = ({clase, youtubeURL, courseDB} : Props) => {
    const [url, setUrl] = useState<string | null>(null)
    const [item, setItem] = useState<Item | null>(null)
    const [items, setItems] = useState<Item[] | null>(null)

    useEffect(() => {
        const getClassInfo = async () => {
            try {
                const config = {
                    headers: {
                      "Content-Type": "application/json",
                    },
                  }
                let { data } = await axios.post('/api/course/getCourseInfo', { youtubeURL }, config)
                setUrl(`https://www.youtube.com/embed/${data.items[clase.id - 1].snippet.resourceId.videoId}?rel=0`) 
                setItem(data.items[clase.id - 1])
                setItems(data.items)

    
            } catch (error: any) {
                console.log(error.message)
            }
        }

        getClassInfo()
    }, [clase])

    console.log(item)

  return (
    <div className='w-full h-full flex items-center justify-center mt-6'>
      <div className='w-3/5 h-full p-6 md:pl-20 lg:ml-24 lg:pl-32 md:ml-8 flex items-center justify-end'>
        <h2 className='h-full'>{item?.snippet.description}</h2>
      </div>
      <div className='w-1/3 h-full p-6 pr-12 overflow-scroll scrollbar-hide'>
      <Row items={items} courseDB={courseDB} title= {item != null ? item.snippet.title : ''} courses={null} setSelectedCourse={null} actualCourseIndex={clase.id - 1} setRef={null} isClass={true}/> 

      </div>
    </div>
  )
}

export default ClassDescription
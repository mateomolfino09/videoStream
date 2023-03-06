import Cookies from 'cookies'
import { useRouter } from 'next/router'
import React, { useMemo, useState } from 'react'
import { useSelector } from 'react-redux'
import AdmimDashboardLayout from '../../../components/AdmimDashboardLayout'  
import { UserContext } from '../../../hooks/userContext'
import { State } from '../../../redux/reducers'
import { User } from '../../../typings'
import { getUserFromBack } from '../../api/user/getUserFromBack'

interface Props {
  user: User 
}

const index = ({ user }: Props) => {
  const [userCtx, setUserCtx] = useState<User>(user)
  const router = useRouter()

  const providerValue = useMemo(() => ({userCtx, setUserCtx}), [userCtx, setUserCtx])

  if (user === null || user.rol != "Admin") {
    router.push("/src/user/login");
  }

  return (
    <UserContext.Provider value={providerValue}>
      <AdmimDashboardLayout>
        <div className='bg-gray-700 w-full'>
          <p className="text-white text-3xl my-12 font-bold">Bienvenido al Dashboard</p>

          <div className="grid lg:grid-cols-3 gap-5 mb-16">
            <div className="rounded bg-gray-500 h-40 shadow-sm"></div>
            <div className="rounded bg-gray-500 h-40 shadow-sm"></div>
            <div className="rounded bg-gray-500 h-40 shadow-sm"></div>
          </div>
          <div className="grid col-1 bg-gray-500 h-96 shadow-sm"></div>
        </div>
      </AdmimDashboardLayout>
  </UserContext.Provider>

  )
}

export async function getServerSideProps(context: any) {
  const { params, query, req, res } = context
  const cookies = new Cookies(req, res)
  // Get a cookie
  const jsonCookie = cookies.get('user')?.toString();

  const userCookie = jsonCookie != null ? JSON.parse(jsonCookie) : null
  const email = userCookie.email   
  const user = await getUserFromBack(email)

  return {
    props: { user  }
  }
} 

export default index
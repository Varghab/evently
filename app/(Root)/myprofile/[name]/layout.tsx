import UserCard from '@/components/shared/UserCard';
import { getUserByUsername } from '@/lib/actions/user.actions';
import { currentUser } from '@clerk/nextjs';
import Link from 'next/link';
import React from 'react'

type ProfileLayoutProps = {
  children: Readonly<React.ReactNode>;
  params:{name:string}
}

const ProfileLayout = async ({params:{name},
    children,
  }:ProfileLayoutProps) => {
    const user = await currentUser();
    const isCurrentUser = user?.username === name; 
    const {success, data} = await getUserByUsername(name) as {success:true, data:any};
    // if success -> false, then user not found!
    
  return (
    <div className=''>
      {!success?
      <div className='wrapper'>
        <h5 className='h5-bold text-gray-700'>User not found!</h5>
        <p className='text-md mt-1'>You have visited a wrong link. <Link className='text-primary-500' href="/">Click here</Link> to visit the home page.</p>
      </div>
      :<UserCard searchedUsername={name} children={children} isCurrentUser={isCurrentUser} userDetails = {data}/>}
    </div>
  )
}

export default ProfileLayout

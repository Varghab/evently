import { UserParams } from '@/types'
import Image from 'next/image'
import React from 'react'

type UserCardProps = {
    children: Readonly<React.ReactNode>;
    isCurrentUser: boolean,
    userDetails: UserParams
}
const UserCard = ({isCurrentUser, userDetails, children}: UserCardProps) => {
  const {firstName, username, lastName, photo, email} = userDetails;
  return (
    <div className=''>
      <section className='py-6 bg-dotted-pattern bg-cover bg-center bg-primary-50'>
        <div className='flex flex-col gap-3 wrapper'>
          <Image className='rounded-full' src={photo} width={100} height={100} alt="Profile Image" />
          <div>
            <h5 className='text-2xl font-bold'>{firstName + ' ' + lastName}</h5>
            <p>@{username}</p>
          </div>
        </div>
      </section>
      <section>

      </section>
      <section>
        {children}
      </section>
    </div>
  )
}

export default UserCard

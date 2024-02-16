import { UserParams } from '@/types'
import Image from 'next/image'
import { auth, currentUser } from '@clerk/nextjs';
import UserInfo from './UserInfo';
import { getAllEventsByUserId } from '@/lib/actions/event.actions';
import Collection from './Collection';

type UserCardProps = {
    children: Readonly<React.ReactNode>;
    isCurrentUser: boolean,
    userDetails: UserParams,
    searchedUsername: string
}

const UserCard = async({isCurrentUser, userDetails, children, searchedUsername}: UserCardProps) => {
  const {firstName, username, lastName, photo, email} = userDetails;
  // const userId = user?.userId
  
  const events = await getAllEventsByUserId(searchedUsername);
  
  return (
    <div className=''>
      <section className='py-6 bg-dotted-pattern bg-cover bg-center bg-primary-50'>
        <div className='flex flex-col gap-3 wrapper'>
          <Image className='rounded-full' src={photo} width={100} height={100} alt="Profile Image" />
          <div>
            <h5 className='text-2xl font-bold'>{firstName} {!lastName?"":lastName}</h5>
            <p>@{username}</p>
          </div>
        </div>
      </section>
      <UserInfo organizedEvents={events?.data} isCurrentUser={isCurrentUser}>
        <Collection data={events?.data} emptyStateSubtext='' page={1} limit={6} emptyTitle='No events has been created yet.'  />    
      </UserInfo>
    </div>
  )
}

export default UserCard

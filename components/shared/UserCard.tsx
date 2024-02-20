import { UserParams } from '@/types'
import Image from 'next/image'
import { auth, currentUser } from '@clerk/nextjs';
import UserInfo from './UserInfo';
import { getAllEventsByUserId } from '@/lib/actions/event.actions';
import Collection from './Collection';
import { getOrderByUserId, getOrdersBySellerId } from '@/lib/actions/order.actions';

type UserCardProps = {
    children: Readonly<React.ReactNode>;
    isCurrentUser: boolean,
    userDetails: UserParams,
    searchedUsername: string
}

const UserCard = async({isCurrentUser, userDetails, children, searchedUsername}: UserCardProps) => {
  const {firstName, username, lastName, photo, email} = userDetails;
  const {sessionClaims} = auth();
  const userId = sessionClaims?.userId as string
  const events = await getAllEventsByUserId(searchedUsername);
  const myTickets = await getOrderByUserId(userId);
  const dashboardData = await getOrdersBySellerId(userId);  
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
      <UserInfo dashboardData={dashboardData?.data} myTickets={myTickets?.data} organizedEvents={events?.data} isCurrentUser={isCurrentUser} />
    </div>
  )
}

export default UserCard

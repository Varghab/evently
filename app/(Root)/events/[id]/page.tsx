import CheckoutButton from '@/components/shared/CheckoutButton'
import Collection from '@/components/shared/Collection'
import { Button } from '@/components/ui/button'
import { getCategoryById } from '@/lib/actions/category.actions'
import { getEventById, getEventsByCategory } from '@/lib/actions/event.actions'
import { getUserById } from '@/lib/actions/user.actions'
import { formatDateTime } from '@/lib/utils'
import { auth } from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

type EventProps = {
    params:{id:string},
    searchParams:{imageUrl:string}
}

type Category = {
    _id?:string,
    name?: string
}

type User = {
    _id: string;
    clerkId: string;
    email: string;
    username: string;
    firstName: string;
    lastName: string;
    photo: string;
    __v: 0;
}

const EventDetails = async ({params:{id}, searchParams:{imageUrl}}:EventProps) => {
    const event = await getEventById(id)   
    const categoryName = event.category.name;
    const relatedEvents = await getEventsByCategory({categoryName, id}); 
    // console.log(relatedEvents);
    const {sessionClaims} = auth();
    const userId = sessionClaims?.userId as string;  
    const currentUser = userId === event?.organizer?._id;

    const {dateOnly:startDate, timeOnly:startTime} = formatDateTime(event.startDateTime);
    const {dateOnly:endDate, timeOnly:endTime} = formatDateTime(event.endDateTime);

    return (
        <>
        <div className='bg-primary-50 bg-dotted-pattern bg-contain'>
            <div className='grid grid-cols-1 py-72 md:grid-cols-2 2xl:max-w-7xl wrapper justify-between gap-6'>
                    <Image src={event.imageUrl} alt={`${event.title}`} width={2000} height={100} className='h-full min-h-[300px] object-cover object-center' />
                <div className='flex flex-col'>
                    <h2 className='h2-bold'>{event.title}</h2>
                    <div className='flex mt-5 flex-col md:flex-row md:items-center md:gap-6'>
                        <div className='flex md:items-center gap-4 text-lg'>
                            <p className='rounded-full max-w-fit bg-green-500/10 text-green-700 font-bold  py-2 px-4'>{event.isFree?"Free":`₹${event.price}`}</p>
                            <p className='rounded-full max-w-fit bg-grey-500/10 py-2 text-grey-500 px-4'>{event.category.name}</p>
                        </div>
                        {event.organizer?.firstName&&event.organizer?.lastName&&<p className='p-medium-18 mt-4 md:mt-0 '>by <span className="text-primary-500/80">{event.organizer?.firstName} {event.organizer?.lastName}</span></p>}
                    </div>
                    <CheckoutButton currentUser={currentUser} event={event} />
                    <div className='mt-8 flex flex-col gap-3'>
                        <div className='flex items-center gap-2'>
                            <Image alt="calendar" height={30} width={30} src="/assets/icons/calendar.svg" />
                            <div className='flex flex-col'>
                                <p>{startDate} | {startTime}</p>
                                <p>{endDate} | {endTime}</p>
                            </div>
                        </div>
                        <div className='flex items-center gap-2'>
                            <Image alt="location" height={30} width={30} src="/assets/icons/location.svg" />
                            <p>{event.location}</p>
                        </div>
                    </div>
                    <div className='mt-8 text-base md:text-lg'>
                        <p className='p-bold-20 '>What you will learn:</p>
                        <p className='mt-2 p-regular-18'>{event.description}</p>
                        <Link className='' href={event.url}>
                            <p className='truncate mt-1  text-primary-500/90 underline italic'>{event.url}</p>
                        </Link>
                    </div>
                </div>
            </div>
        </div>
        <div className='wrapper'>
            <h3 className='h3-bold'>Related Events</h3>
            <div className='mt-8'>
                <Collection limit={6} emptyStateSubtext="Visit the home page for more events" emptyTitle="No related events" data={relatedEvents?.data} page={1} />
            </div>
        </div>
        </>
    )
}

export default EventDetails

import { IEvent } from '@/lib/database/models/event.model'
import { formatDateTime } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import DeleteDialog from './DeleteDialog'
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';

type CardProps = {
  event: IEvent,
  hasOrderLink:boolean,
  hidePrice: boolean,
  currentUser: boolean
}

const Card = ({event, hasOrderLink, hidePrice, currentUser}:CardProps) => {
  
  return (
    <div className='group relative min-h-[300px] w-full max-w-[400px] flex-col overflow-hidden rounded-xl bg-white shadow-md transition-all hover:shadow-lg d:min-h-[438px]'>
      <Link href={`/events/${event._id}`} >
        <div className='flex flex-col' >
          <div className='min-h-[200px] bg-cover bg-center' style={{backgroundImage:`url(${event.imageUrl})`}}>
          </div>  
          {/* is Event creator soon... */}
          <div className='p-5 flex flex-col min-h-[230px] gap-3'>
            <div className='flex flex-col gap-3 md:gap-4'>
                <div className='flex items-center gap-4'>
                  {!hidePrice?<span className='rounded-full py-2 px-4 bg-green-600/10 font-semibold text-green-700'>{event.isFree?"FREE" : `₹${event.price}`}</span>:<span className='rounded-full py-2 px-4 bg-green-600/10 text-green-700'>Paid</span>}
                  <p className='bg-primary-500/10 rounded-full py-2 px-4'>{event?.category?.name}</p>
                </div>
            </div>
            <div>
              <p className='p-regular-16'>{event?.startDateTime&&formatDateTime(event.startDateTime).dateOnly}</p>
              <p className='mt-1 p-bold-20'>{event?.title}</p>
            </div>
            <p className='flex-1 text-primary-500/90 flex items-end'>{event?.organizer?.firstName} {event?.organizer?.lastName &&event?.organizer?.lastName}</p>
          </div>
        </div>
      </Link>
      {currentUser&&<div className='absolute right-4 bg-white rounded-lg top-3 flex flex-col gap-3 items-center py-2 px-2'>
        <Link href={`/events/${event?._id}/update`}><Image className='cursor-pointer' src="/assets/icons/edit.svg" alt="edit" width={20} height={20} /></Link>
        <DeleteDialog eventId = {event._id} />
      </div>}
      {/* <ToastContainer /> */}
    </div>
  )
}

export default Card

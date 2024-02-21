'use client'
import { IEvent } from '@/lib/database/models/event.model'
import React from 'react'
import Card from './Card'
import { useUser } from '@clerk/nextjs'

type CollectionProps = {
  data: IEvent[],
  emptyTitle:string,
  emptyStateSubtext:string,
  limit: number,
  page: number | string,
  totalPages?:number,
  urlParamName?:string,
  collectionType?: "Events_Organized" | "My_Tickets" | "All_Events"
}

const Collection = ({data, emptyTitle, emptyStateSubtext, page, totalPages=0, urlParamName, collectionType}:CollectionProps) => {
  const {user} = useUser();
  const userId = user?.publicMetadata?.userId as string
  
  return (
    <>
      {data.length > 0? 
        <div className='flex flex-col items-center gap-10'>
          <ul className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 w-full gap-5 xl:gap-10'>
            {data && data.map((event)=>{              
              const hasOrderLink = collectionType === 'Events_Organized';
              const hidePrice = collectionType === 'My_Tickets';
              return(
                <li key={event._id} className='flex justify-center'>
                  <Card currentUser={userId===event?.organizer?._id} event={event} hasOrderLink={hasOrderLink} hidePrice={hidePrice} />
                </li>
              )
            })}
          </ul>
        </div>
      :
      <div className='wrapper rounded-[14px] flex-center min-h-[200px] w-full flex-col bg-grey-50 text-center py-20'>
        <h5 className='p-bold-20 md:h5-bold'>{emptyTitle}</h5>
        <p className='p-regular-14 md:mt-2 mt-1'>{emptyStateSubtext}</p>
      </div>
      }
    </>
  )
}

export default Collection

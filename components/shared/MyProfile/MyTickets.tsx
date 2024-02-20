'use client'
import React from 'react'
import Collection from '../Collection'
import { IEvent } from '@/lib/database/models/event.model'

const MyTickets = ({myTickets}:{myTickets:IEvent[]}) => {
  console.log(myTickets);
  
  return (
    <div>
      <Collection collectionType='My_Tickets' data={myTickets} emptyTitle='No tickets to show' emptyStateSubtext='You have not bought any tickets' limit={6} page={1} />
    </div>
  )
}

export default MyTickets

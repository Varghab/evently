import { IEvent } from '@/lib/database/models/event.model';
import Collection from '../Collection';
import React from 'react';

const EventsOrganized = ({events}:{events:IEvent[]}) => {
  return (
    <div>
      <Collection data={events} emptyStateSubtext='' page={1} limit={6} emptyTitle='No events has been created yet.'  />    
    </div>
  )
}

export default EventsOrganized

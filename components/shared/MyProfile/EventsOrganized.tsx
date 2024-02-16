import { IEvent } from '@/lib/database/models/event.model';
import Collection from '../Collection';
import React from 'react';

const EventsOrganized = ({children}:{children: React.ReactNode}) => {
  return (
    <div>
      {children}
    </div>
  )
}

export default EventsOrganized

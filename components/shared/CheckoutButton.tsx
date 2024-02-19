'use client'
import { IEvent } from '@/lib/database/models/event.model'
import { SignedOut } from '@clerk/clerk-react';
import { SignedIn, useUser } from '@clerk/nextjs';
import React from 'react'
import { Button } from '../ui/button';
import Link from 'next/link';
import Checkout from './Checkout';

type CheckoutButtonProps = {
    event: IEvent;
    currentUser: boolean
}

const CheckoutButton = ({event, currentUser}:CheckoutButtonProps) => {
    const isEventClosed = new Date(event.endDateTime) < new Date();
    const {user} = useUser();
    const userId = user?.publicMetadata.userId as string;
    
    return (
        <div className='flex items-center gap-3 mt-4'>   
            {
                isEventClosed?<p className='p-2 text-red-400 '>Sorry! Tickets are no longer available</p>:
                <>
                    <SignedOut>
                        <Button asChild size="lg" className='button rounded-full'>
                            <Link href="/sign-in">
                                Get Ticket
                            </Link>
                        </Button>
                    </SignedOut>
                    <SignedIn>
                        {!currentUser&&<Checkout event={event} userId={userId} />}
                    </SignedIn>
                </>
            }
        </div>
    )
}

export default CheckoutButton

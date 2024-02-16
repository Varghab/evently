'use client'
import React, { useState } from 'react'
import { Button } from '../ui/button';
import Profile from './MyProfile/Profile';
import MyTickets from './MyProfile/MyTickets';
import EventsOrganized from './MyProfile/EventsOrganized';
import Dashboard from './MyProfile/Dashboard';
import { useUser } from '@clerk/nextjs';
import { IEvent } from '@/lib/database/models/event.model';
import Collection from './Collection';

type UserInfoProps = {
    isCurrentUser:boolean;
    organizedEvents: IEvent[];
    children:React.ReactNode;
}

export type Tab = 'Profile' | 'My_Tickets' | 'Events_Organized' | 'Dashboard' 

const UserInfo = ({isCurrentUser, organizedEvents, children }:UserInfoProps) => {
    const [currentTab, setCurrentTab] = useState<Tab>(isCurrentUser?'Profile':'Events_Organized');
    const handleTab = (tab:Tab) => {
        setCurrentTab(tab)
    }
    const {user} = useUser();

    let initialValues = {
        firstName:user?.firstName || "",
        lastName:user?.lastName || "",
        username: user?.username || ""
    }

    return (
        <>
        <section className='wrapper flex gap-4 flex-col md:flex-row'>
            {isCurrentUser&&<Button onClick={()=>handleTab('Profile')} className={`flex-1 hover:bg-white text-neutral-700 ${currentTab==='Profile'?'bg-white shadow-lg':'bg-white shadow'}`}>Profile</Button>}
            {isCurrentUser&&<Button onClick={()=>handleTab('Dashboard')} className={`flex-1 hover:bg-white text-neutral-700 ${currentTab==='Dashboard'?'bg-white shadow-lg':'bg-white shadow'}`}>Dashboard</Button>}
            {isCurrentUser&&<Button onClick={()=>handleTab('My_Tickets')} className={`flex-1 hover:bg-white text-neutral-700 ${currentTab==='My_Tickets'?'bg-white shadow-lg':'bg-white shadow'}`}>My Tickets</Button>}
            <Button onClick={()=>handleTab('Events_Organized')} className={`flex-1 hover:bg-white text-neutral-700 ${currentTab==='Events_Organized'?'bg-white shadow-lg':'bg-white shadow'}`}>Events Organized</Button>
        </section>
        <section className='wrapper'>
            {currentTab==='Profile'&&isCurrentUser&&<Profile initialValues={initialValues} clerkId={user?.id || ''} />}
            {currentTab==='My_Tickets'&&isCurrentUser&&<MyTickets />}
            {currentTab==='Events_Organized'&& <EventsOrganized>
                {children}
            </EventsOrganized>}
            {currentTab==='Dashboard'&&isCurrentUser&&<Dashboard />}
        </section>
        </>
    )
}

export default UserInfo

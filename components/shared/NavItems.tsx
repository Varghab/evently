'use client'
import React, { useEffect, useState } from 'react'
import { headerLinks } from '@/constants'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SignedIn, useUser } from '@clerk/nextjs'

const NavItems = () => {    
    const pathname = usePathname();
    let allLinks = [...headerLinks];
    allLinks[2] = {
        label:"My Profile",
        route: `/myprofile`
    }
    return (
        <ul className='md:flex-between flex flex-col md:flex-row gap-3 md:gap-5'>
            {allLinks.map((headerItem,id)=>{
                return(
                    <Link key={id} href={headerItem.route}><li className={`${headerItem.route===pathname&&"text-primary-500"} p-medium-16 whitespace-nowrap `}>{headerItem.label}</li></Link>
                )
            })}
        </ul>
    )
}

export default NavItems

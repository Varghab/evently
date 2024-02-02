'use client'
import React from 'react'
import { headerLinks } from '@/constants'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const NavItems = () => {
    const pathname = usePathname();    
    return (
        <ul className='md:flex-between flex flex-col md:flex-row gap-3 md:gap-5'>
            {headerLinks.map((headerItem,id)=>{
                return(
                    <Link key={id} href={headerItem.route}><li className={`${headerItem.route===pathname&&"text-primary-500"} p-medium-16 whitespace-nowrap `}>{headerItem.label}</li></Link>
                )
            })}
        </ul>
    )
}

export default NavItems

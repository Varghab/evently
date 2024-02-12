import { SignedIn, SignedOut, UserButton, currentUser, useAuth} from '@clerk/nextjs'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { Button } from '../ui/button'
import NavItems from './NavItems'
import {
    Sheet,
    SheetContent,
    SheetTrigger,
  } from "@/components/ui/sheet"
  import { Separator } from "@/components/ui/separator"
  
const Header = async() => {

  return (
    <header className='w-full border-b'>
        <div className='wrapper flex justify-between items-center'>
            <Link href="/" className='w-36'>
                <Image alt="Evently Logo" src="/assets/images/logo.svg" width={128} height={38} />
            </Link>
            <div className='hidden md:block'>
                <NavItems  />
            </div>
            <div className='flex justify-end gap-3'>
                <SignedOut>
                    <Button asChild className='rounded-full' size="lg">
                        <Link href="/sign-in">
                            Login
                        </Link>
                    </Button>
                </SignedOut>
                <SignedIn>
                    <UserButton afterSignOutUrl='/' />
                </SignedIn>
                <Sheet>
                    <SheetTrigger className='block md:hidden '>
                        <Image src="/assets/icons/menu.svg" alt="menu" width={28} height={28} />
                    </SheetTrigger>
                    <SheetContent className='bg-neutral-100 flex flex-col gap-6 md:hidden'>
                        <Image src="/assets/images/logo.svg" alt='Logo' width={128} height={38} />
                        <Separator className='border border-gray-200' />
                        <div className='block md:hidden'>
                            <NavItems />
                        </div>
                    </SheetContent>
                </Sheet>
            </div>
        </div>
    </header>
  )
}

export default Header

import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const Footer = () => {
  return (
    <footer className='border-t'>
      <div className='flex-center wrapper flex-between flex-col flex gap-4 text-center p-5 sm:flex-row'>
        <Link href="/">
        <Image src="/assets/images/logo.svg" alt="Logo" width={128} height={38} /></Link>
        <p>2024 Evently. All Right Reserved</p>
      </div>
    </footer>
  )
}

export default Footer

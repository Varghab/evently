import Image from 'next/image'
import React from 'react'

const Loading = () => {
  return (
    <div className='fixed top-0 h-screen w-full flex items-center justify-center bg-neutral-100/40'>
      <div className='flex items-center'>
        <Image alt="loading" width={70} height={70} src="/assets/icons/loader.svg" />
        <p className='text-primary-500'>Loading...</p>
      </div>
    </div>
  )
}

export default Loading

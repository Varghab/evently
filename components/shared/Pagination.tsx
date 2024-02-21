"use client"
import React from 'react'
import { Button } from '../ui/button';
import qs from 'query-string'
import { useRouter } from 'next/navigation';
type PaginationProps = {
    page: number | string;
    urlParamName?: string;
    totalPages: number
}

const Pagination = ({urlParamName, page, totalPages}: PaginationProps) => {
    const router = useRouter();
    const onClick = (btnType: string) => {
        const pageValue = btnType === 'next' ? Number(page) + 1: Number(page) - 1;
        let newUrl = "";
        newUrl = qs.stringifyUrl({
            url: window.location.pathname,
            query: {
                page: pageValue
            }
        },{skipNull: true})
        router.push(newUrl, {scroll: false});
    }

  return (
    <div className='flex gap-2'>
      <Button size="lg" className='w-28' variant='outline' onClick={()=>onClick('prev')} disabled={Number(page)<=0} >
        Previous
      </Button>
      <Button size="lg" className='w-28' variant='outline' onClick={()=>onClick('next')} disabled={Number(page)>=totalPages-1} >
        Next
      </Button>
    </div>
  )
}

export default Pagination

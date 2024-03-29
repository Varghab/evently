"use client"
import Image from 'next/image';
import { useEffect, useState } from 'react'
import { Input } from '../ui/input';
import { useSearchParams, useRouter } from 'next/navigation';
import qs from 'query-string'

const Search = ({placeholder="Search Title..."}:{placeholder?:string}) => {
    const [query, setQuery] = useState('');
    const router = useRouter();
    useEffect(()=>{
        let newUrl = '';
        const debounce = setTimeout(()=>{
            if(query){
                newUrl = qs.stringifyUrl({
                    url: window.location.pathname,
                    query: {
                        search: query
                    },
                },{skipNull:true})
            }else{
                newUrl = qs.stringifyUrl({
                    url: window.location.pathname,
                },{skipNull:true})
            }
            router.push(newUrl, {scroll: false});
        },500)
        return () => clearTimeout(debounce)
    },[query, router])

    return (
        <div className="flex-center min-h-[54px] w-full overflow-hidden rounded-full bg-grey-50 px-4 py-2">
            <Image src="/assets/icons/search.svg" alt="search" width={24} height={24} />
            <Input 
                type="text"
                placeholder={placeholder}
                onChange={(e) => setQuery(e.target.value)}
                className="p-regular-16 border-0 bg-grey-50 outline-offset-0 placeholder:text-grey-500 focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
    </div>
    )
}

export default Search

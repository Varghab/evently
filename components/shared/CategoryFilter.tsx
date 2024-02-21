"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { getAllCategories } from "@/lib/actions/category.actions"
import { ICategory } from "@/lib/database/models/category.model"
import { useEffect, useState } from "react"
import qs from 'query-string'
import { useRouter, useSearchParams } from "next/navigation"

const CategoryFilter = () => {
    const [categories, setCategories] = useState<ICategory[]>([]);
    const router  = useRouter();
    useEffect(()=>{
        const getCategories = async () => {
            const categoryList = await getAllCategories();
            categoryList && setCategories(categoryList as ICategory[])
        }
        getCategories();
    },[])
    const onSelectCategory = (value:string) => {
        let newUrl = '';
        if(value&&value!=='All'){
            newUrl = qs.stringifyUrl({
                url: window.location.pathname,
                query: {
                    category: value,
                }
            },{skipNull:true})
        }else{
            newUrl = qs.stringifyUrl({
                url: window.location.pathname                             
            },{skipNull:true})
        }        
        router.push(newUrl, {scroll:false})
    }
    return (
            <Select onValueChange={(value: string) => onSelectCategory(value)}>
                <SelectTrigger className="select-field">
                    <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                    <SelectItem value="All" className="select-item p-regular-14">All</SelectItem>

                    {categories.map((category) => (
                    <SelectItem value={category.name} key={category._id} className="select-item p-regular-14">
                        {category.name}
                    </SelectItem>
                    ))}
                </SelectContent>
            </Select>
    )
}

export default CategoryFilter

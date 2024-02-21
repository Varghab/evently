"use server"

import { connectToDatabase } from "../database";
import Category from "../database/models/category.model";
import { handleError } from "../utils"

export const createCategory = async({name}:{name:string})=>{
    try {
        await connectToDatabase();
        const newCategory = await Category.create({name})        
        return JSON.parse(JSON.stringify(newCategory));
    } catch (error) {
        handleError(error);
    }
}

export const getAllCategories = async()=>{
    try {
        await connectToDatabase();
        const categories = await Category.find()
        return JSON.parse(JSON.stringify(categories));
    } catch (error) {
        handleError(error);
    }
}

export const getCategoryById = async(id:string)=>{
    try {
        await connectToDatabase();
        const category = await Category.findById(id);
        return JSON.parse(JSON.stringify(category));        
    } catch (error) {
        handleError(error);
    }
}

export const getCategoryByName = async(category:string) => {
    try {
        await connectToDatabase();
        const cat = await Category.findOne({ name: category });
        console.log(cat);
        
        return JSON.parse(JSON.stringify(cat));        
    } catch (error) {
        handleError(error);
    }
}
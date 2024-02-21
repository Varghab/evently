"use server"
import { CreateEventParams, DeleteEventParams, GetAllEventsParams } from "@/types";
import Event, { IEvent } from "../database/models/event.model";
import { handleError } from "../utils";
import { connectToDatabase } from "../database";
import User from "../database/models/user.model";
import Category from "../database/models/category.model";
import { z } from "zod";
import { eventFormSchema } from "../validator";
import { revalidatePath } from "next/cache";
import { getUserByUsername } from "./user.actions";
import { getCategoryByName } from "./category.actions";

export async function createEvent({ userId, event, path }: CreateEventParams) {
  try {
    await connectToDatabase();
    const {categoryId} = event;
    const newEvent = await Event.create({
        ...event,
        category:categoryId,
        organizer: userId
    })
    return JSON.parse(JSON.stringify(newEvent));
} catch (error) {
    console.log("Error occured in event action!");
    handleError(error);
  }
}

const populateQuery = async(query:any)=>{
    return query
            .populate({
                path:'organizer',
                model:User,
                select:"_id firstName lastName"
            })
            .populate({
                path:'category',
                model:Category,
                select:"_id name"
            })
}

export async function getEventById(id:string){
    try {
        await connectToDatabase();
        const event = await populateQuery(Event.findById({_id:id}));
        return JSON.parse(JSON.stringify(event));
    } catch (error) {
        handleError(error)
    }
}

export async function getAllEvents({query, category, limit=6, page}:GetAllEventsParams){
    try {
        await connectToDatabase();
        const titleCondition = query ? { title: { $regex: query, $options: 'i' } } : {}
        const categoryCondition = category ? await getCategoryByName(category) : null
        const condition = {
            $and : [
                titleCondition,
                categoryCondition ? {
                    category: categoryCondition._id
                }: {}
            ]
        }
        const eventsQuery = Event.find(condition)
            .sort({createdAt:"desc"})
            .skip(0)
            .limit(limit)
        
        const events = await populateQuery(eventsQuery);
        const eventsCount = await Event.countDocuments(titleCondition);
        return {
            data: JSON.parse(JSON.stringify(events)),
            totalPages: Math.ceil(eventsCount / limit)
        }
        
    } catch (error) {
        handleError(error)
    }
}

export async function updateEventById({eventId, values}:{eventId:string, values:z.infer<typeof eventFormSchema>}){
    try {
        await connectToDatabase();
        const event = await Event.findOneAndUpdate({_id:eventId}, {...values, category: values.categoryId}, {
            new:true,
            runValidators:true
        })        
        
        if(event){
            revalidatePath('/')
            revalidatePath('/myprofile/:name')
            return{
                success: true,
                data: JSON.parse(JSON.stringify(event)),
            }
        }
    } catch (error) {
        handleError(error)
    }
}

export async function getAllEventsByUserId(username:any){    
    try {
        await connectToDatabase();
        const res = await getUserByUsername(username);                
        if(res?.success){
            const allEventsByUser = await populateQuery(Event.find({organizer: res.data._id}));
            
            if(allEventsByUser){
                // revalidatePath('/myprofile/:name')
                // revalidatePath('/myprofile')
                return {
                    success: true, 
                    data: JSON.parse(JSON.stringify(allEventsByUser))
                }
            }
        }
        }   
        
    catch (error) {
        handleError(error); 
    }
}

export async function getEventsByCategory({categoryName, id}:{categoryName:string, id: string}){
    try {
        await connectToDatabase();
        const condition = {
            _id: {
                '$ne': id
            },
        }
        let relatedEvent = await populateQuery(Event.find(condition));
        relatedEvent = relatedEvent.filter((event:IEvent)=>event?.category?.name===categoryName)
        
        if(relatedEvent){
            return{
                success: true,
                data: JSON.parse(JSON.stringify(relatedEvent))
            }
        }else{
            return {
                success: false,
                data: []
            }
        }
        
    } catch (error) {
        handleError(error);
    }
}

export async function deleteEventById({eventId, path}:DeleteEventParams){
    try {
        await connectToDatabase();
        const deletedEvent = await Event.findByIdAndDelete(eventId);
        if(deletedEvent) revalidatePath(path);
    } catch (error) {
        handleError(error)
    }
}
"use server"
import { CreateEventParams, GetAllEventsParams } from "@/types";
import Event, { IEvent } from "../database/models/event.model";
import { handleError } from "../utils";
import { connectToDatabase } from "../database";
import User from "../database/models/user.model";
import Category from "../database/models/category.model";
import { z } from "zod";
import { eventFormSchema } from "../validator";
import { revalidatePath } from "next/cache";
import { getUserByUsername } from "./user.actions";

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
        const condition = {};
        const eventsQuery = Event.find(condition)
            .sort({createdAt:"desc"})
            .skip(0)
            .limit(limit)
        
        const events = await populateQuery(eventsQuery);
        const eventsCount = await Event.countDocuments(condition);
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
        const event = await Event.findOneAndUpdate({_id:eventId}, values, {
            new:true,
            runValidators:true
        })        
        if(event){
            revalidatePath('/')
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
                revalidatePath('/myprofile/:name')
                revalidatePath('/myprofile')
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
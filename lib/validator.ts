import { z } from "zod"

export const eventFormSchema = z.object({
    title: z.string().min(3, {message:"Title should be of atleast 3 characters"}),
    description: z.string().min(3, {message:"Description should be of atleast 3 characters"}).max(400, {message:"Description can't exceed 400 characters"}),
    location: z.string().min(3, {message:"Location should be of atleast 3 characters"}).max(400, {message:"Location can't exceed 400 characters"}),
    imageUrl: z.string(),
    startDateTime: z.date(),
    endDateTime: z.date(),
    categoryId: z.string(),
    price: z.string(),
    isFree: z.boolean(),
    url: z.string().url(),
})

export const userUpdateSchema = z.object({
    firstName: z.string().min(1, {message:"First name should be of atleast 1 character"}),
    lastName: z.string().max(50,{message:"Last name shouldn't exceed 50 characters"}),
    username: z.string().min(4, {message:"Username should be of atleast 4 character"}).max(24,{message:"Last name shouldn't exceed 24 characters"}),

})

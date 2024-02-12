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

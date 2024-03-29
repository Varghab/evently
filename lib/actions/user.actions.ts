'use server'

import { revalidatePath } from 'next/cache'

import { connectToDatabase } from '@/lib/database'
import User from '@/lib/database/models/user.model'
import Order from '@/lib/database/models/order.model'
import Event from '@/lib/database/models/event.model'
import { handleError } from '@/lib/utils'

import { CreateUserParams, UpdateUserParams } from '@/types'
import { z } from 'zod'
import { userUpdateSchema } from '../validator'
import { clerkClient } from '@clerk/nextjs'
import { redirect } from 'next/navigation'

export async function createUser(user: CreateUserParams) {
  try {
    await connectToDatabase();
    console.log("Connected to database");        
    const newUser = await User.create(user) 
    revalidatePath('/myprofile')   
    revalidatePath('/myprofile/:name')   
    console.log(newUser);
    return JSON.parse(JSON.stringify(newUser))
  } catch (error) {
    handleError(error)
  }
}

export async function getUserById(userId: string) {
  try {
    await connectToDatabase()
    const user = await User.findById(userId)
    if (!user) throw new Error('User not found')
    return JSON.parse(JSON.stringify(user))
  } catch (error) {
    handleError(error)
  }
}

export async function updateUser(clerkId: string, user: UpdateUserParams | z.infer<typeof userUpdateSchema>) {
  try {
    await connectToDatabase()

    const updatedUser = await User.findOneAndUpdate({ clerkId }, user, { new: true })

    if (!updatedUser) throw new Error('User update failed')
    return JSON.parse(JSON.stringify(updatedUser))
  } catch (error) {
    handleError(error)
  }
}

export async function deleteUser(clerkId: string) {
  try {
    await connectToDatabase()

    // Find user to delete
    const userToDelete = await User.findOne({ clerkId })
    
    if (!userToDelete) {
      throw new Error('User not found')
    }

    // Unlink relationships
    await Promise.all([
      // Update the 'events' collection to remove references to the user
      // Event.updateMany(
      //   { _id: { $in: userToDelete.events } },
      //   { $pull: { organizer: userToDelete._id } }
      // ),
      Event.deleteMany({organizer:userToDelete._id}),
      // Update the 'orders' collection to remove references to the user
      Order.deleteMany({seller: userToDelete._id})
    ])

    // Delete user
    const deletedUser = await User.findByIdAndDelete(userToDelete._id)
    revalidatePath('/')

    return deletedUser ? JSON.parse(JSON.stringify(deletedUser)) : null
  } catch (error) {
    handleError(error)
  }
}

export async function getUserByUsername(username:string){
  try {
    await connectToDatabase();
    const user = await User.findOne({username});
    if(user){
      return{
        success: true,
        data: JSON.parse(JSON.stringify(user))
      }
    }else{
      return{
        success: false,
      }
    } 
  } catch (error) {
    handleError(error)
  }
}

export async function updateUserProfile({clerkId, userDetails}:{clerkId: string, userDetails:z.infer<typeof userUpdateSchema>}){
  try {
    await connectToDatabase();
    const user = await clerkClient.users.updateUser(clerkId, userDetails);
    if(user){
      const updatedUser = await updateUser(clerkId, userDetails);
      if(updatedUser){
        revalidatePath('/myprofile');
        revalidatePath('/myprofile/:name')
        return {
          success:true,
          data:updatedUser
        }
      }
    }else{
      return {
        success:false,
        messsage:"User update failed"
      }
    }
  } catch (error:any) {
    if(error.clerkError){
      return {
        success: false,
        message: error?.errors[0]?.message
      }
    }    
  }
}
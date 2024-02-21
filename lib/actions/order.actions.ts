'use server'

import { CheckoutOrderParams, CreateOrderParams, DashboardData, GetOrdersByEventParams, GetOrdersByUserParams } from "@/types";
import { redirect } from "next/navigation";
import Stripe from 'stripe';
import User from "../database/models/user.model";
import Order from "../database/models/order.model";
import { connectToDatabase } from "../database";
import { handleError } from "../utils";
import { ObjectId } from "mongodb";
import Event from "../database/models/event.model";
import Category from "../database/models/category.model";

export const filterData = (orders:any) => {
  return orders.map((order:any)=>{
    const { _id, totalAmount} = order;
    const { title} = order.event;
    return {
      _id,
      totalAmount,
      eventTitle: title,
      buyerEmail: order.buyerEmail,
      buyerUsername: order.buyerUsername,
    }
  })
}

export async function checkoutOrder(order:CheckoutOrderParams){
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

    const price = order.isFree ? 0 : Number(order.price) * 100;
  
    try {
      const session = await stripe.checkout.sessions.create({
        line_items: [
          {
            price_data: {
              currency: 'inr',
              unit_amount: price,
              product_data: {
                name: order.eventTitle,
              }
            },
            quantity: 1
          },
        ],
        metadata: {
          eventId: order.eventId,
          buyerEmail: order.buyer.email,
          buyerUsername: order.buyer.username,
          sellerId: order.sellerId
        },
        mode: 'payment',
        success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/myprofile`,
        cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/`,
      });
  
      redirect(session.url!)
    } catch (error) {
      throw error;
    }
}

export const createOrder = async (order: CreateOrderParams) => {
  try {
    await connectToDatabase();
    console.log(order);
    const newOrder = await Order.create({...order, event: order.eventId ,seller: order.sellerId, buyer:{email: order.buyerEmail, username: order.buyerUsername}});
    return JSON.parse(JSON.stringify(newOrder));
  } catch (error) {
    handleError(error);
  }
}

// // GET ORDERS BY EVENT
// export async function getOrdersByEvent({ searchString, eventId }: GetOrdersByEventParams) {
//   try {
//     await connectToDatabase()

//     if (!eventId) throw new Error('Event ID is required')
//     const eventObjectId = new ObjectId(eventId)

//     const orders = await Order.aggregate([
//       {
//         $lookup: {
//           from: 'users',
//           localField: 'buyer',
//           foreignField: '_id',
//           as: 'buyer',
//         },
//       },
//       {
//         $unwind: '$buyer',
//       },
//       {
//         $lookup: {
//           from: 'events',
//           localField: 'event',
//           foreignField: '_id',
//           as: 'event',
//         },
//       },
//       {
//         $unwind: '$event',
//       },
//       {
//         $project: {
//           _id: 1,
//           totalAmount: 1,
//           createdAt: 1,
//           eventTitle: '$event.title',
//           eventId: '$event._id',
//           buyer: {
//             $concat: ['$buyer.firstName', ' ', '$buyer.lastName'],
//           },
//         },
//       },
//       {
//         $match: {
//           $and: [{ eventId: eventObjectId }, { buyer: { $regex: RegExp(searchString, 'i') } }],
//         },
//       },
//     ])

//     return JSON.parse(JSON.stringify(orders))
//   } catch (error) {
//     handleError(error)
//   }
// }

// // GET ORDERS BY USER
// export async function getOrdersByUser({ userId, limit = 3, page }: GetOrdersByUserParams) {
//   try {
//     await connectToDatabase()

//     const skipAmount = (Number(page) - 1) * limit
//     const conditions = { buyer: userId }

//     // const orders = await Order.distinct('event._id')
//     //   .find(conditions)
//     //   .sort({ createdAt: 'desc' })
//     //   .skip(skipAmount)
//     //   .limit(limit)
//     //   .populate({
//     //     path: 'event',
//     //     model: Event,
//     //     populate: {
//     //       path: 'organizer',
//     //       model: User,
//     //       select: '_id firstName lastName',
//     //     },
//     //   })

//     const ordersCount = await Order.distinct('event._id').countDocuments(conditions)

//     return { data: JSON.parse(JSON.stringify(orders)), totalPages: Math.ceil(ordersCount / limit) }
//   } catch (error) {
//     handleError(error)
//   }
// }

export async function getOrderByUserId(userId:string){
  try {
    await connectToDatabase();
    const condition = {
      buyer:userId
    }
    let orders = await Order.find(condition)
      .select('event')
      .sort({createdAt:'desc'})
      .populate({
        path:'event',
        model:Event,
        populate:[
          {
            path:'category',
            model:Category
          },
          {
            path:'organizer',
            model:User
          }
      ],
      })

    orders = orders.map((data) => data.event);
      
    if(orders){
      return {
        success: true,
        data: JSON.parse(JSON.stringify(orders))
      }
    }
  } catch (error) {
    handleError(error)
  }
}

export async function getOrdersBySellerId(sellerId:string){
  try {
    await connectToDatabase();
    const condition = {
      seller:sellerId
    }
    let orders = await Order.find(condition)
      .sort({createdAt:'desc'})
      .populate([
        {
          path:'event',
          model:Event
        }
      ])

    let filteredData:DashboardData[] = []; 

    if(orders.length>0){
      filteredData = filterData(orders) as DashboardData[]      
    }
      return {
        success: true,
        data: JSON.parse(JSON.stringify(filteredData))
      }
  } catch (error) {
    handleError(error)
  }
}
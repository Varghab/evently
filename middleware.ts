import { authMiddleware } from "@clerk/nextjs";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
 
export default authMiddleware({
  publicRoutes: [
    '/',
    '/api/webhook/clerk',
    '/api/webhook/stripe',
    '/api/uploadthing',
    "/api/webhook(.*)",
    "/myprofile/:name",
    "/events/:id"
  ],
  ignoredRoutes: [
    '/api/webhook/clerk',
    '/api/webhook/stripe',
    '/api/uploadthing'
  ],
});
 
export const config = {
  matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],

};
 

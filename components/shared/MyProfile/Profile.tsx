"use client"
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { userUpdateSchema } from "@/lib/validator";
import { z } from "zod";
import { currentUser, useUser } from "@clerk/nextjs";
import { updateUserProfile } from "@/lib/actions/user.actions";
import { useRouter } from "next/navigation";


const Profile = ({initialValues, clerkId}:{initialValues:z.infer<typeof userUpdateSchema>, clerkId:string}) => {
    
  const form = useForm<z.infer<typeof userUpdateSchema>>({
    resolver: zodResolver(userUpdateSchema),
    defaultValues: initialValues,
  });

  const router = useRouter();

  async function onSubmit(values: z.infer<typeof userUpdateSchema>) {    
    if(values.firstName===initialValues.firstName&&values.lastName===values.lastName&&values.username===initialValues.username){
      console.log("No Values Changed");
      return;
    }
    const updatedUser = await updateUserProfile({clerkId, userDetails: values})
    if(updatedUser?.success){
      console.log(updatedUser);
      form.reset();
      router.push(`/myprofile/${updatedUser.data.username}`)
    } else{

    }
  }

  return (
    <div className='min-h-[300px] w-full p-4 md:p-8 bg-white rounded-lg shadow-lg'>
      <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-6"
      >
        <div className="flex flex-col gap-5 md:flex-row">
          <div className="flex-1">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="First Name"
                      {...field}
                      className="input-field "
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex-1">
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                  <Input
                      placeholder="Last Name"
                      {...field}
                      className="input-field "
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
          <div className="flex-1">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="User name"
                      {...field}
                      className="input-field "
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="flex-1">
          <Button type="submit" disabled={form.formState.isSubmitting}>{form.formState.isSubmitting?'Saving Changes':`Save Changes`}</Button>
          
        </div>
      </form>
    </Form>
    </div>
  )
}

export default Profile

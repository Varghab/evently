"use client";

import { eventDefaultValues } from "@/constants";
import { eventFormSchema } from "@/lib/validator";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Dropdown from "./Dropdown";
import { Textarea } from "@/components/ui/textarea";
import { FileUploader } from "./FileUploader";
import { useState } from "react";
import Image from "next/image";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { Checkbox } from "../ui/checkbox";
import { useUploadThing } from "@/lib/uploadthing";
import { useRouter } from "next/navigation";
import { createEvent, updateEventById } from "@/lib/actions/event.actions";
import { IEvent } from "@/lib/database/models/event.model";
import { revalidatePath } from "next/cache";

type EventFormProps = {
  userId: string;
  type: "Create" | "Update";
  updateData?: IEvent;
  eventId?: string;
};

const EventForm = ({ userId, type, updateData, eventId }: EventFormProps) => {
  const [files, setFiles] = useState<File[]>([]);
  console.log(updateData);
  
  const initialValues = updateData && type==="Update" ? {...updateData,
    startDateTime: new Date(updateData.startDateTime),
    endDateTime: new Date(updateData.endDateTime),
    categoryId: updateData?.category?._id
  } : eventDefaultValues;    
  const router = useRouter();
  const {startUpload} = useUploadThing("imageUploader");
  const form = useForm<z.infer<typeof eventFormSchema>>({
    resolver: zodResolver(eventFormSchema),
    defaultValues: initialValues,
  });
  

  async function onSubmit(values: z.infer<typeof eventFormSchema>) {    
    if(form.getValues("isFree")) values.price = ""
    let uploadedImage = values.imageUrl;
    
    if(files.length>0){
      const uploadedImages = await startUpload(files);
      if(!uploadedImages) return;
      uploadedImage = uploadedImages[0].url;
    }

    if(type === "Create"){
      try {
        const newEvent = await createEvent({
          event:{...values, imageUrl: uploadedImage},
          userId,
          path:'/profile'
        })
        if(newEvent){
          form.reset();
          router.push(`/events/${newEvent._id}`)
        }
      } catch (error) {
        console.log("Error called in eventform");
        console.log(error);
      }
    }

    if(type === "Update"){
      if(!eventId){
        console.log("EventId not found!");        
        router.back();
        return;
      }
      const updatedEvent = await updateEventById({eventId, values});
      if(updatedEvent?.success){
        form.reset();
        router.push(`/events/${updatedEvent.data._id}`)      }
    }
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        <div className="flex flex-col gap-5 md:flex-row">
          <div className="flex-1">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      placeholder="Event Title"
                      {...field}
                      className="input-field bg-red-300"
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
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Dropdown
                      onChangeHandler={field.onChange}
                      value={field.value}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="flex flex-col md:flex-row gap-5">
          <div className="flex-1">
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl className="h-72">
                    <Textarea
                      placeholder="Description"
                      {...field}
                      className="textarea rounded-2xl"
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
              name="imageUrl"
              render={({ field }) => (
                <FormItem>
                  <FormControl className="h-72">
                    <FileUploader
                      onFileChange={field.onChange}
                      setFiles={setFiles}
                      imageUrl={field.value}
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
              name="location"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex-center w-full overflow-hidden rounded-full h-[54px] bg-grey-50 px-4 py-2">
                      <Image
                        src="/assets/icons/location-grey.svg"
                        alt="location pin"
                        width={24}
                        height={24}
                      />
                      <Input
                        placeholder="Location"
                        {...field}
                        className="input-field"
                      />
                    </div>
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
              name="startDateTime"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center w-full overflow-hidden rounded-full h-[54px] bg-grey-50 px-4 py-2">
                      <Image
                        src="/assets/icons/calendar.svg"
                        alt="calender"
                        width={24}
                        height={24}
                      />
                      <p className="ml-3 whitespace-nowrap text-grey-600">
                        Start Date :{" "}
                      </p>
                      <DatePicker
                        showTimeSelect
                        timeInputLabel="Time: "
                        dateFormat="dd/MM/yyyy h:mm aa"
                        wrapperClassName="dataPicker"
                        selected={field.value}
                        onChange={(date: Date): void => field.onChange(date)}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <div className="flex-1">
            <FormField
              control={form.control}
              name="endDateTime"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex items-center w-full overflow-hidden rounded-full h-[54px] bg-grey-50 px-4 py-2">
                      <Image
                        src="/assets/icons/calendar.svg"
                        alt="calender"
                        width={24}
                        height={24}
                      />
                      <p className="ml-3 whitespace-nowrap text-grey-600">
                        End Date :{" "}
                      </p>
                      <DatePicker
                        showTimeSelect
                        timeInputLabel="Time: "
                        dateFormat="dd/MM/yyyy h:mm aa"
                        wrapperClassName="dataPicker"
                        selected={field.value}
                        onChange={(date: Date): void => field.onChange(date)}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>
        <div className="flex flex-col gap-5 md:flex-row">
            <div className="md:w-1/2 w-full flex items-center overflow-hidden rounded-full h-[54px] bg-grey-50 px-4 py-2 gap ">
              <div className="flex-1 ">
                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem >
                      <FormControl>
                        <div className="flex items-center ">
                          <Input disabled={form.getValues("isFree")} type="number" placeholder="Price" {...field} className="p-regular-16 border-0 bg-grey-50 outline-offset-0 focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0" />
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
                <FormField
                  control={form.control}
                  name="isFree"
                  render={({ field }) => (                  
                    <FormItem>
                      <FormControl>
                          <div className="flex-center gap-3">
                            <label htmlFor="isFree" className="whitespace-nowrap leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ">Free Ticket</label>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} id="isFree" ref={field.ref} name={field.name} className=" border-primary-500" />
                          </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
            </div>
            <div className="md:w-1/2 w-full">
              <FormField
                control={form.control}
                name="url"
                render={({ field }) => (
                  <FormItem className="box-border">
                    <FormControl>
                      <div className="flex items-center w-full overflow-hidden rounded-full h-[54px] bg-grey-50 px-4 py-2">
                        <Image
                          src="/assets/icons/link.svg"
                          alt="calender"
                          width={24}
                          height={24}
                        />
                        <Input type="string" placeholder="URL" {...field} className="p-regular-16 border-0 bg-grey-50 outline-offset-0 focus:border-0 focus-visible:ring-0 focus-visible:ring-offset-0" />
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        <Button size="lg" disabled={form.formState.isSubmitting} type="submit">{form.formState.isSubmitting?type==="Create"?"Creating":"Updating":`${type} Event`}</Button>
      </form>
    </Form>
  );
};

export default EventForm;

'use client'
import React, { useTransition } from "react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "../ui/button";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { deleteEventById } from "@/lib/actions/event.actions";

type DeleteDialogProps = {
  eventId: string;
};

const DeleteDialog = ({ eventId }: DeleteDialogProps) => {
    const path = usePathname();
    console.log(path);
    
    const [isPending, startTransition] = useTransition();
    const deleteEvent = async () => {
        startTransition(async()=>{
            await deleteEventById({eventId, path});
        })
    }
  return (
    <AlertDialog>
      <AlertDialogTrigger className="cursor-pointer" asChild>
            <Image src='/assets/icons/delete.svg' alt="delete" width={20} height={20} />
      </AlertDialogTrigger>
      <AlertDialogContent className="bg-white">
        <AlertDialogHeader>
          <AlertDialogTitle>Are you sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete this event.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction disabled={isPending} onClick={deleteEvent}>{isPending?'Deleting':'Delete'}</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

export default DeleteDialog;

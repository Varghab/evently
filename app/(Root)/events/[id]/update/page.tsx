import EventForm from "@/components/shared/EventForm"
import { getEventById } from "@/lib/actions/event.actions";
import { auth } from "@clerk/nextjs"

type UpdateProps = {
    params: {id:string}
}

const UpdateEvent = async({params:{id}}:UpdateProps) => {
    const {sessionClaims} = auth();
    const userId = sessionClaims?.userId as string;     
    let event = await getEventById(id);
    
    return (
        <>
        <section className="bg-primary-50 bg-dotted-pattern bg-cover bg-center py-5 md:py-10">
            <h3 className="wrapper h3-bold text-center sm:text-left">Update Event</h3>
        </section>
        <div className="wrapper py-6">
            <EventForm updateData = {event} userId={userId} eventId={id} type="Update" />
        </div>
        </>
    )
}

export default UpdateEvent

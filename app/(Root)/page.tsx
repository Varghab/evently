import CategoryFilter from "@/components/shared/CategoryFilter";
import Collection from "@/components/shared/Collection";
import Search from "@/components/shared/Search";
import { Button } from "@/components/ui/button";
import { getAllEvents } from "@/lib/actions/event.actions";
import { IEvent } from "@/lib/database/models/event.model";
import { SearchParamProps } from "@/types";
import Image from "next/image";
import Link from "next/link";

export default async function Home({searchParams}:SearchParamProps) {
  const page = Number(searchParams?.page) || 0
  const events = await getAllEvents({
    query: (searchParams?.search as string) || '',
    limit:4,
    category:(searchParams?.category as string) || '',
    page: page,
  }) as {data:IEvent[],totalPages:number}

  return (
    <>
      <section className="bg-primary-50 bg-dotted-pattern bg-contain py-5 md:py-10">
        <div className="wrapper grid grid-cols-1 gap-5 md:grid-cols-2 2xl:gap-0">
          <div className="flex flex-col justify-center gap-8">
            <h1 className="h1-bold">Host, Connect, Celebrate: Your Events, Our Platform!</h1>
            <p className="p-regular-20 md:p-regular-24">Book and learn helpful tips from 3000+ mentors in world-class companies with out global community.</p>
            <Button asChild size="lg" className="button w-full sm:w-fit">
              <Link href="#events">Explore Now</Link>
            </Button>
          </div>
          <Image className="max-h-[70vh] object-contain object-center 2xl:max-h-[50vh]" src="/assets/images/hero.png" alt="Hero" width={1000} height={1000}></Image>
        </div>
      </section>
      <section id="events" className="wrapper my-8 flex flex-col gap-8 md:gap-12">
        <h2 className="h2-bold">Trusted by <br/>Thousands of Events</h2>
        <div className="flex w-ful flex-col gap-5 md:flex-row">
          <Search />
          <CategoryFilter />
        </div>
        <Collection
          data={events?.data}
          emptyTitle="No events found"
          emptyStateSubtext="Come back later"
          totalPages={events?.totalPages}
          limit={4}
          page={page}
          collectionType="Events_Organized"
        />
      </section>
    </>
  );
}

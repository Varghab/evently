import { currentUser } from '@clerk/nextjs';
import { redirect } from 'next/navigation'
const MyProfile = async () => {
    const user = await currentUser();    
    redirect(`/myprofile/${user?.username}`)
}
export default MyProfile

import { currentUser } from '@clerk/nextjs';
import React from 'react'

const Profile = async ({params:{name}}:{params:{name:string}}) => {
  const user = await currentUser();
  const isCurrentUser = user?.username === name;
  return (
    isCurrentUser?
    <div>
      Profile Page
    </div>
    :null
  )
}

export default Profile

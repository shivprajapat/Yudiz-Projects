import React from 'react'
import style from "./style.module.scss";
import { iconPlus, iconUser } from '@/assets/images';
import { Avatar, Button, Heading } from '@/shared/components';

const UserProfile = () => {
  const { user_profile, user_profile_avatar } = style;

  return (
    <section className={user_profile}>
      <Heading title='User Profiles' />
      <div className={user_profile_avatar}>
        <Avatar SizeL icon={iconUser} title='User 1' Vertical bgColor>
          <Button bgDark>Edit Profile</Button>
        </Avatar>
        <Avatar SizeL icon={iconUser} title='User 2' Vertical bgColor>
          <Button bgDark>Edit Profile</Button>
        </Avatar>
        <Avatar SizeL icon={iconUser} title='User 3' Vertical bgColor>
          <Button bgDark>Edit Profile</Button>
        </Avatar>
        <Avatar SizeL icon={iconPlus} Vertical bgColor>
          <Button bgOrange>Add Profile</Button>
        </Avatar>
      </div>
    </section>
  )
}

export default UserProfile